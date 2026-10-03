from sqlalchemy.orm import DeclarativeBase,Mapped,mapped_column
from sqlalchemy import ForeignKey

class Base(DeclarativeBase):
    pass

class Job(Base):
    __tablename__ = "job"

    id:Mapped[int] = mapped_column(primary_key=True)
    company:Mapped[str]
    role:Mapped[str]
    location:Mapped[str|None]
    salary:Mapped[int | None]
    status:Mapped[str]
    application_date:Mapped[str]

    user_id:Mapped[int] = mapped_column(ForeignKey("users.id"))