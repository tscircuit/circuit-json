from typing import Any
from pydantic import BaseModel

class SchematicTextInput(BaseModel):
    type: str
    anchor: Any
    rotation: Any
    text: Any
    color: Any
    schematic_component_id: Any
    schematic_text_id: Any
    position: Any
