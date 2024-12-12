from typing import List, Point
from pydantic import BaseModel

class PCBTraceHint(BaseModel):
    type: str
    pcb_trace_hint_id: str
    pcb_port_id: str
    pcb_component_id: str
    route: List[Point]
