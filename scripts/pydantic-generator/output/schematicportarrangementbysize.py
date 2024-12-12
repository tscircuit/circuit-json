from pydantic import BaseModel

class SchematicPortArrangementBySize(BaseModel):
    left_size: float
    right_size: float
    top_size: float
    bottom_size: float
