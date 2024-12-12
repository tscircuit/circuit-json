from typing import Any
from pydantic import BaseModel

class PcbPlatedHoleOval(BaseModel):
    type: str
    shape: Any
    outer_width: float
    outer_height: float
    hole_width: float
    hole_height: float
    x: float
    y: float
    layers: Any
    port_hints: Any
    pcb_component_id: str
    pcb_port_id: str
    pcb_plated_hole_id: str
