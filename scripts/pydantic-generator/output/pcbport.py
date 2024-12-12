from typing import Any
from pydantic import BaseModel

class PCBPort(BaseModel):
    type: str
    pcb_port_id: str
    source_port_id: str
    pcb_component_id: str
    x: float
    y: float
    layers: Any
