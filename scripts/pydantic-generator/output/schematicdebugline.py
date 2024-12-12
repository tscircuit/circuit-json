from typing import Any
from pydantic import BaseModel

class SchematicDebugLine(BaseModel):
    type: str
    label: str
    shape: Any
    start: Any
    end: Any
