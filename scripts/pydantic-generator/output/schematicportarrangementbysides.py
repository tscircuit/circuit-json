from typing import Any
from pydantic import BaseModel

class SchematicPortArrangementBySides(BaseModel):
    left_side: Any
    right_side: Any
    top_side: Any
    bottom_side: Any
