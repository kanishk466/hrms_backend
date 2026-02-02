from fastapi import APIRouter, HTTPException
from app.database import employee_collection
from app.schemas.employee import EmployeeCreate
from app.utils.response import serialize

router = APIRouter(prefix="/api/employees", tags=["Employees"])


@router.post("", status_code=201)
async def create_employee(data: EmployeeCreate):

    existing = await employee_collection.find_one({
        "$or": [
            {"employeeId": data.employeeId},
            {"email": data.email}
        ]
    })

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Employee with same ID or email already exists"
        )

    await employee_collection.insert_one(data.dict())
    return {"message": "Employee created successfully"}


@router.get("")
async def get_employees():
    employees = []
    async for emp in employee_collection.find():
        employees.append(serialize(emp))
    return employees


@router.delete("/{employee_id}")
async def delete_employee(employee_id: str):
    result = await employee_collection.delete_one(
        {"employeeId": employee_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(404, "Employee not found")

    return {"message": "Employee deleted successfully"}
