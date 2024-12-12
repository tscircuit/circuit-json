from typing import Any
from pydantic import BaseModel

class SchematicLineInput(BaseModel):
    type: str
    x1: Any
    y1: Any
    x2: Any
    y2: Any
    schematic_component_id: Any
