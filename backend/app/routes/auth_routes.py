from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.user_schema import UserRegisterSchema, UserLoginSchema, TokenSchema, UserResponseSchema
from app.utils.auth import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
from app.database import get_db
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenSchema, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegisterSchema):
    db = get_db()

    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create user
    user_doc = {
        "email": user_data.email,
        "hashed_password": hash_password(user_data.password),
        "full_name": user_data.full_name,
        "target_role": user_data.target_role,
        "created_at": __import__("datetime").datetime.utcnow(),
    }

    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)

    token = create_access_token({"sub": user_id})

    return TokenSchema(
        access_token=token,
        user=UserResponseSchema(
            id=user_id,
            email=user_data.email,
            full_name=user_data.full_name,
            target_role=user_data.target_role,
            created_at=user_doc["created_at"],
        ),
    )


@router.post("/login", response_model=TokenSchema)
async def login(credentials: UserLoginSchema):
    db = get_db()

    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    user_id = str(user["_id"])
    token = create_access_token({"sub": user_id})

    return TokenSchema(
        access_token=token,
        user=UserResponseSchema(
            id=user_id,
            email=user["email"],
            full_name=user["full_name"],
            target_role=user.get("target_role"),
            created_at=user["created_at"],
        ),
    )


@router.get("/me", response_model=UserResponseSchema)
async def get_me(current_user: dict = Depends(__import__("app.utils.auth", fromlist=["get_current_user"]).get_current_user)):
    return UserResponseSchema(
        id=str(current_user["_id"]),
        email=current_user["email"],
        full_name=current_user["full_name"],
        target_role=current_user.get("target_role"),
        created_at=current_user["created_at"],
    )
