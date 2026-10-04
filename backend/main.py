from fastapi import FastAPI,Depends,HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.auth import SECRET_KEY,ALGORITHM
import jwt

from backend.security import password_hash

from backend.schemas.job import JobCreate,JobResponse
from backend.schemas.user import UserCreate,UserResponse,UserLogin

from backend.database import engine,get_db

from backend.models.job import Base,Job
from backend.models.user import User

from backend.dependencies import get_current_user

from sqlalchemy import select,and_,func

Base.metadata.create_all(bind=engine)
app = FastAPI()

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "https://job-tracker-phi-coral.vercel.app",],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test-auth")
def test_auth(current_user: User=Depends(get_current_user)):
    return current_user

@app.get("/jobs",response_model=list[JobResponse])
def get_jobs(db=Depends(get_db),current_user:User=Depends(get_current_user)):
    result = db.execute(select(Job).where(Job.user_id == current_user.id))
    jobs = result.scalars().all()
    return jobs

@app.post("/jobs",status_code=201)
def create_jobs(
    job:JobCreate,
    db=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    result = db.execute(
        select(Job).where(
            and_(
                func.lower(Job.company) == func.lower(job.company),
                func.lower(Job.role) == func.lower(job.role),
                func.lower(Job.location) == func.lower(job.location),
                Job.application_date == job.application_date,
                Job.status == job.status,
                Job.user_id == current_user.id
            )
        )
    )
    existing_job = result.scalars().one_or_none()
    if existing_job is not None:
        raise HTTPException(
            status_code=400,
            detail="Job already exists"
        )
    new_job = Job(
        company=job.company,
        role=job.role,
        location=job.location,
        salary=job.salary,
        status=job.status,
        application_date=job.application_date,
        user_id=current_user.id
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@app.get("/jobs/{job_id}",response_model=JobResponse)
def get_job(
    job_id:int, 
    db=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    result = db.execute(select(Job).where(
        and_(
            Job.id == job_id,
            Job.user_id == current_user.id
        )
    ))
    job = result.scalars().one_or_none()
    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )
    return job

@app.put("/jobs/{job_id}",response_model=JobResponse)
def update_job(
    job_id:int,
    job: JobCreate,
    db = Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    result = db.execute(select(Job).where(
        and_(
            Job.id == job_id,
            Job.user_id == current_user.id
        )
    ))
    existing_job = result.scalars().one_or_none()
    if existing_job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )
    existing_job.company = job.company
    existing_job.role = job.role
    existing_job.location = job.location
    existing_job.salary = job.salary
    existing_job.status = job.status
    existing_job.application_date = job.application_date
    db.commit()
    db.refresh(existing_job)
    return existing_job


@app.delete("/jobs/{job_id}")
def delete_job(
    job_id:int,
    db=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    result = db.execute(select(Job).where(
        and_(
            Job.id == job_id,
            Job.user_id == current_user.id
        )
    ))
    existing_job = result.scalars().one_or_none()
    if existing_job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )
    db.delete(existing_job)
    db.commit()
    return {
        "message":"Job deleted successfully"
    }

@app.post("/register",response_model=UserResponse,status_code=201)
def register_user(user:UserCreate,db=Depends(get_db)):
    result = db.execute(select(User).where(User.email == user.email))
    existing_user = result.scalars().one_or_none()

    if existing_user is not None:
        raise HTTPException(
            status_code = 400,
            detail = "User already exists"
        )
    hashed_password = password_hash.hash(user.password)
    new_user = User(
            email=user.email,
            password_hash=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login")
def login_user(user:UserLogin,db=Depends(get_db)):
    result = db.execute(select(User).where(User.email == user.email))
    existing_user = result.scalars().one_or_none()
    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail = "Invalid email or password"
        )
    if not password_hash.verify(user.password,existing_user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="invalid email or password"
        )
    token_data = {
        "sub":str(existing_user.id)
    }
    token = jwt.encode(
        token_data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return {
       "access_token":token,
       "token_type":"bearer"
    }

      

