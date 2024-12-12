from typing import Any
from pydantic import BaseModel

class SourcePortInput(BaseModel):
    type: str
    name: str
    source_component_id: Any
    port_hints: Any
    source_port_id: Any
    pin_number: Any
