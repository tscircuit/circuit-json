from typing import Any
from pydantic import BaseModel

class PcbPlacementErrorInput(BaseModel):
    type: str
    pcb_placement_error_id: Any
    message: Any
