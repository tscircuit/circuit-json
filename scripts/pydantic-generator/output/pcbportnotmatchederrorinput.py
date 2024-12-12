from typing import Any
from pydantic import BaseModel

class PcbPortNotMatchedErrorInput(BaseModel):
    type: str
    pcb_error_id: Any
    message: Any
    pcb_component_ids: Any
