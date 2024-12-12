from typing import Any
from pydantic import BaseModel

class SourceSimpleBattery(BaseModel):
    ftype: Any
    capacity: float
