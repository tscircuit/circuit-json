from typing import Any
from pydantic import BaseModel

class SchematicError(BaseModel):
    type: str
    schematic_error_id: str
    error_type: Any
    message: str
