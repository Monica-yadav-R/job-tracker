from pydantic import BaseModel,EmailStr

class UserCreate(BaseModel):
    email:EmailStr
    password:str

class UserResponse(BaseModel):
    id:int
    email:str

class UserLogin(BaseModel):
    email:EmailStr
    password: str

# final-text@example.com
# example