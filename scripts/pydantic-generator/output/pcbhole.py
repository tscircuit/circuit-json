from typing import Any
from pydantic import BaseModel

class PcbHole(BaseModel):
    type: str
    pcb_hole_id: str
    hole_shape: Any
    x: float
    y: float
