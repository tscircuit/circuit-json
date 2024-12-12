from typing import Any
from pydantic import BaseModel

class PCBPortInput(BaseModel):
    type: str
    pcb_port_id: Any
    source_port_id: Any
    pcb_component_id: Any
    x: float
    y: float
    layers: Any
