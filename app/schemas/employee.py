from pydantic import BaseModel, EmailStr, Field

class EmployeeCreate(BaseModel):
    employeeId: str = Field(..., min_length=1)
    fullName: str = Field(..., min_length=1)
    email: EmailStr
    department: str = Field(..., min_length=1)
