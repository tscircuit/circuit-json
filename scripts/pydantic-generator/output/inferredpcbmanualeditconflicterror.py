from typing import Any
from pydantic import BaseModel

class InferredPcbManualEditConflictError(BaseModel):
    message: Any
    type: str
    pcb_component_id: Any
    source_component_id: Any
    pcb_error_id: Any
