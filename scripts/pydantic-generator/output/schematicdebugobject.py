from typing import Any
from pydantic import BaseModel

class SchematicDebugObject(BaseModel):
    type: str
    label: str
    shape: Any
