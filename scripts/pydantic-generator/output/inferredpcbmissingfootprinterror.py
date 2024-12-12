from typing import Any
from pydantic import BaseModel

class InferredPcbMissingFootprintError(BaseModel):
    type: str
    pcb_missing_footprint_error_id: Any
    error_type: Any
    source_component_id: Any
    message: Any
