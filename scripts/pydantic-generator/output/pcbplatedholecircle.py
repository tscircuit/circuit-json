from typing import Any
from pydantic import BaseModel

class PcbPlatedHoleCircle(BaseModel):
    type: str
    shape: Any
    outer_diameter: float
    hole_diameter: float
    x: float
    y: float
    layers: Any
    port_hints: Any
    pcb_component_id: str
    pcb_port_id: str
    pcb_plated_hole_id: str
