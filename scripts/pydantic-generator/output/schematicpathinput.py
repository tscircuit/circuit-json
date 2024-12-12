from typing import Any
from pydantic import BaseModel

class SchematicPathInput(BaseModel):
    type: str
    schematic_component_id: Any
    fill_color: Any
    is_filled: Any
    points: Any
