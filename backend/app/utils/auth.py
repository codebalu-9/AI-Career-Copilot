import hashlib
import hmac
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt_handler import decode_token
from app.database import get_db

security = HTTPBearer()

def hash_password(password: str) -> str:
    salt = os.urandom(32)
    key = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    return (salt + key).hex()

def verify_password(plain_password: str, hashed: str) -> bool:
    try:
        data = bytes.fromhex(hashed)
        salt = data[:32]
        stored_key = data[32:]
        key = hashlib.pbkdf2_hmac('sha256', plain_password.encode(), salt, 100000)
        return hmac.compare_digest(key, stored_key)
    except Exception:
        return False

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    db = get_db()
    from bson import ObjectId
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user