from typing import Any
from pydantic import BaseModel

class SchematicDebugRect(BaseModel):
    type: str
    label: str
    shape: Any
    center: Any
    size: Any
