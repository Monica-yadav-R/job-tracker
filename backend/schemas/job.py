from pydantic import BaseModel,ConfigDict,Field,field_validator
from enum import Enum
from datetime import date

class JobStatus(str,Enum):
    applied = "Applied"
    saved = "Saved"
    interview = "Interview"
    offer = "Offer"
    rejected = "Rejected"
    withdrawn = "Withdrawn"

class JobCreate(BaseModel):
    company:str = Field(min_length=1)
    role:str = Field(min_length=1)
    location:str|None=None
    salary:int|None=None
    application_date:date
    status:JobStatus

    @field_validator("company")
    @classmethod
    def validate_company(cls,value):
        value = value.strip()
        if value.lower() == "string":
            raise ValueError("Company cannot be 'string'")
        if not value.strip():
            raise ValueError('Company cannot be empty')
        return value

    
    @field_validator("role")
    @classmethod
    def validate_role(cls,value):
        if value.lower() == "string":
            raise ValueError("Role cannot be 'string'")
        if not value.strip():
            raise ValueError('Role cannot be empty')
        return value

    @field_validator("location")
    @classmethod
    def validate_location(cls,value):
        if value is None:
            return None
        value = value.strip()
        if not value:
            return None
        if value.lower() == "string":
            raise ValueError("Location cannot be 'string'")
        if value.lower() == "not specified":
            return None
        return value


class JobResponse(BaseModel):
    id:int
    company:str
    role: str
    location:str | None=None
    salary: int | None=None
    application_date:date
    status:JobStatus

    model_config = ConfigDict(from_attributes=True)