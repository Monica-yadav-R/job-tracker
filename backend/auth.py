import os
import jwt

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"