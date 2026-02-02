from bson import ObjectId

def serialize(doc: dict) -> dict:
    """
    Convert MongoDB document to JSON-serializable dict
    """
    if "_id" in doc and isinstance(doc["_id"], ObjectId):
        doc["_id"] = str(doc["_id"])
    return doc
