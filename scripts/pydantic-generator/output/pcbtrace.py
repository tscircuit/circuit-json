from typing import Any, List, Point
from pydantic import BaseModel

class PCBTrace(BaseModel):
    type: str
    source_trace_id: str
    pcb_component_id: str
    pcb_trace_id: str
    route_order_index: float
    route_thickness_mode: Any
    should_round_corners: bool
    route: List[Point]
