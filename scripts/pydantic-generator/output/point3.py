from pydantic import BaseModel

class Point3(BaseModel):
    x: float
    y: float
    z: float
