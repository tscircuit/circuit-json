from typing import Any
from pydantic import BaseModel

class InferredSchematicError(BaseModel):
    message: Any
    type: str
    error_type: Any
    schematic_error_id: Any
