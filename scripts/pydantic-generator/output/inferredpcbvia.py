from typing import Any
from pydantic import BaseModel

class InferredPcbVia(BaseModel):
    type: str
    pcb_via_id: Any
    x: float
    y: float
    outer_diameter: Any
    hole_diameter: Any
    from_layer: Any
    to_layer: Any
    layers: Any
    pcb_trace_id: Any
