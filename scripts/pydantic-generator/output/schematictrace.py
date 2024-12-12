from typing import Any
from pydantic import BaseModel

class SchematicTrace(BaseModel):
    type: str
    schematic_trace_id: str
    source_trace_id: str
    junctions: Any
    edges: Any
