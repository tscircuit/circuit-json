from typing import Any
from pydantic import BaseModel

class PcbPlatedHoleInput(BaseModel):
    type: str
    shape: Any
    outer_diameter: Any
    hole_diameter: Any
    x: float
    y: float
    layers: Any
    port_hints: Any
    pcb_component_id: Any
    pcb_port_id: Any
    pcb_plated_hole_id: Any
    outer_width: Any
    outer_height: Any
    hole_width: Any
    hole_height: Any
