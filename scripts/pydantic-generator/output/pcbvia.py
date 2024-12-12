from typing import Any
from pydantic import BaseModel

class PCBVia(BaseModel):
    type: str
    pcb_via_id: str
    x: float
    y: float
    outer_diameter: Any
    hole_diameter: Any
    from_layer: Any
    to_layer: Any
    layers: Any
    pcb_trace_id: str
