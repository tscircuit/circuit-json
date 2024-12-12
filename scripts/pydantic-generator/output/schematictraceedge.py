from typing import Any
from pydantic import BaseModel

class SchematicTraceEdge(BaseModel):
    from: Any
    to: Any
    is_crossing: bool
    from_schematic_port_id: str
    to_schematic_port_id: str
