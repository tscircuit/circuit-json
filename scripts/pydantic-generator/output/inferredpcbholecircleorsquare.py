from typing import Any
from pydantic import BaseModel

class InferredPcbHoleCircleOrSquare(BaseModel):
    type: str
    pcb_hole_id: Any
    hole_shape: Any
    hole_diameter: Any
    x: float
    y: float
