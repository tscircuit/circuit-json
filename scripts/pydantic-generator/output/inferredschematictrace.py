from typing import Any
from pydantic import BaseModel

class InferredSchematicTrace(BaseModel):
    type: str
    source_trace_id: Any
    schematic_trace_id: Any
    junctions: Any
    edges: Any
