from typing import Any
from pydantic import BaseModel

class SourcePort(BaseModel):
    type: str
    pin_number: float
    port_hints: Any
    name: str
    source_port_id: str
    source_component_id: str
