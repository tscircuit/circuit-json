from typing import Any
from pydantic import BaseModel

class InferredSchematicText(BaseModel):
    type: str
    anchor: Any
    rotation: Any
    text: Any
    color: Any
    schematic_component_id: Any
    schematic_text_id: Any
    position: Any
