from typing import Any
from pydantic import BaseModel

class PcbHoleOvalInput(BaseModel):
    type: str
    pcb_hole_id: Any
    hole_shape: Any
    hole_width: Any
    hole_height: Any
    x: float
    y: float
