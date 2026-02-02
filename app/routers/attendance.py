from fastapi import APIRouter, HTTPException, Query
from app.database import attendance_collection, employee_collection
from app.schemas.attendance import AttendanceCreate
from app.utils.response import serialize
from datetime import date as date_type
router = APIRouter(prefix="/api/attendance", tags=["Attendance"])


@router.post("", status_code=201)
async def mark_attendance(data: AttendanceCreate):

    employee = await employee_collection.find_one(
        {"employeeId": data.employeeId}
    )

    if not employee:
        raise HTTPException(404, "Employee not found")

    existing = await attendance_collection.find_one({
        "employeeId": data.employeeId,
        "date": str(data.date)
    })

    if existing:
        raise HTTPException(409, "Attendance already marked for this date")

    await attendance_collection.insert_one({
        "employeeId": data.employeeId,
        "date": str(data.date),
        "status": data.status
    })

    return {"message": "Attendance marked successfully"}


@router.get("/{employee_id}")
async def get_attendance(employee_id: str):

    records = []
    async for record in attendance_collection.find(
        {"employeeId": employee_id}
    ):
        records.append(serialize(record))

    return records


# BONUS: Filter by date
@router.get("")
async def filter_by_date(date: str = Query(None)):

    query = {}
    if date:
        query["date"] = date

    records = []
    async for record in attendance_collection.find(query):
        records.append(serialize(record))

    return records





@router.get("")
async def filter_attendance(
    date: date_type | None = Query(None, description="Filter by date (YYYY-MM-DD)")
):
    query = {}
    if date:
        query["date"] = str(date)

    records = []
    async for record in attendance_collection.find(query):
        records.append(serialize(record))

    return {
        "count": len(records),
        "records": records
    }
    
@router.get("/summary")
async def attendance_summary():
    pipeline = [
        {
            "$match": {"status": "PRESENT"}
        },
        {
            "$group": {
                "_id": "$employeeId",
                "totalPresentDays": {"$sum": 1}
            }
        },
        {
            "$project": {
                "_id": 0,
                "employeeId": "$_id",
                "totalPresentDays": 1
            }
        }
    ]

    results = []
    async for doc in attendance_collection.aggregate(pipeline):
        results.append(doc)

    return results


@router.get("/summary/{employee_id}")
async def employee_attendance_summary(employee_id: str):

    total = await attendance_collection.count_documents({
        "employeeId": employee_id,
        "status": "PRESENT"
    })

    return {
        "employeeId": employee_id,
        "totalPresentDays": total
    }
