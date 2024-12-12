from typing import Any
from pydantic import BaseModel

class PcbHoleOval(BaseModel):
    type: str
    pcb_hole_id: str
    hole_shape: Any
    hole_width: float
    hole_height: float
    x: float
    y: float
