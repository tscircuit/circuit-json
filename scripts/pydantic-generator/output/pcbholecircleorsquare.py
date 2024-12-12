from typing import Any
from pydantic import BaseModel

class PcbHoleCircleOrSquare(BaseModel):
    type: str
    pcb_hole_id: str
    hole_shape: Any
    hole_diameter: float
    x: float
    y: float
