from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from backend.database import get_db
from backend.models.user import User

import jwt
from backend.auth import SECRET_KEY,ALGORITHM

from fastapi import HTTPException
from sqlalchemy import select


oauth2_scheme = OAuth2PasswordBearer(tokenUrl ="/login")

def get_current_user(
        token: str = Depends(oauth2_scheme),
        db=Depends(get_db)):
   
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="invalid authentication credentials"
        )
    user_id = int(payload["sub"])

    result = db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalars().one_or_none()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials"
        )
    return user