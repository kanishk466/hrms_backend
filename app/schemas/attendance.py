from pydantic import BaseModel
from datetime import date
from enum import Enum

class AttendanceStatus(str, Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"

class AttendanceCreate(BaseModel):
    employeeId: str
    date: date
    status: AttendanceStatus
