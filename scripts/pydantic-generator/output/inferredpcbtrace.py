from typing import Any, List, Point
from pydantic import BaseModel

class InferredPcbTrace(BaseModel):
    type: str
    source_trace_id: Any
    pcb_component_id: Any
    pcb_trace_id: Any
    route_thickness_mode: Any
    route_order_index: Any
    should_round_corners: Any
    route: List[Point]
