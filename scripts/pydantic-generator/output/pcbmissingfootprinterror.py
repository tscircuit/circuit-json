from typing import Any
from pydantic import BaseModel

class PCBMissingFootprintError(BaseModel):
    type: str
    pcb_missing_footprint_error_id: str
    error_type: Any
    source_component_id: str
    message: str
