from typing import Any
from pydantic import BaseModel

class PcbTraceErrorInput(BaseModel):
    type: str
    pcb_trace_error_id: Any
    error_type: Any
    message: Any
    center: Any
    pcb_trace_id: Any
    source_trace_id: Any
    pcb_component_ids: Any
    pcb_port_ids: Any
