from pydantic import BaseModel

class InputPoint(BaseModel):
    x: float
    y: float
