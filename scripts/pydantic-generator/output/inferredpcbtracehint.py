from typing import Any, List, Point
from pydantic import BaseModel

class InferredPcbTraceHint(BaseModel):
    type: str
    pcb_trace_hint_id: Any
    pcb_port_id: Any
    pcb_component_id: Any
    route: List[Point]
