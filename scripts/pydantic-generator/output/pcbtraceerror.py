from typing import Any, Point
from pydantic import BaseModel

class PCBTraceError(BaseModel):
    type: str
    pcb_trace_error_id: str
    error_type: Any
    message: str
    center: Point
    pcb_trace_id: str
    source_trace_id: str
    pcb_component_ids: Any
    pcb_port_ids: Any
