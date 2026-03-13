from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UserRegisterSchema(BaseModel):
    email: str
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=2)
    target_role: Optional[str] = None


class UserLoginSchema(BaseModel):
    email: str
    password: str


class UserResponseSchema(BaseModel):
    id: str
    email: str
    full_name: str
    target_role: Optional[str] = None
    created_at: datetime


class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponseSchema


class TokenDataSchema(BaseModel):
    user_id: Optional[str] = None
