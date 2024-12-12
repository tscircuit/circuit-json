from typing import Any
from pydantic import BaseModel

class PCBPortNotMatchedError(BaseModel):
    type: str
    pcb_error_id: str
    message: str
    pcb_component_ids: Any
