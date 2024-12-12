from typing import Any
from pydantic import BaseModel

class InferredSchematicLine(BaseModel):
    type: str
    schematic_component_id: Any
    x1: Any
    x2: Any
    y1: Any
    y2: Any
