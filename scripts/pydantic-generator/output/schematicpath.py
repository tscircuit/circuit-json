from typing import Any
from pydantic import BaseModel

class SchematicPath(BaseModel):
    type: str
    schematic_component_id: str
    fill_color: Any
    is_filled: bool
    points: Any
