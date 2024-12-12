from typing import Any
from pydantic import BaseModel

class SchematicDebugPoint(BaseModel):
    type: str
    label: str
    shape: Any
    center: Any
