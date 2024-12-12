from typing import Any
from pydantic import BaseModel

class InferredPcbPlacementError(BaseModel):
    type: str
    pcb_placement_error_id: Any
    message: Any
