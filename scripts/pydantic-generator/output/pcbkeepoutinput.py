from typing import Any
from pydantic import BaseModel

class PCBKeepoutInput(BaseModel):
    type: str
    center: Any
    shape: Any
    layers: Any
    pcb_keepout_id: Any
    description: str
