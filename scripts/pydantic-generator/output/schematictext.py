from typing import Any
from pydantic import BaseModel

class SchematicText(BaseModel):
    type: str
    schematic_component_id: str
    schematic_text_id: str
    text: str
    position: Any
    rotation: float
    anchor: Any
    color: str
