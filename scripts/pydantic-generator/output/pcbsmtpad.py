from typing import Any
from pydantic import BaseModel

class PCBSMTPad(BaseModel):
    type: str
    shape: Any
    pcb_smtpad_id: str
    x: float
    y: float
    layer: Any
    port_hints: Any
    pcb_component_id: str
    pcb_port_id: str
