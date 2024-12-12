from typing import Any
from pydantic import BaseModel

class UnitInfo(BaseModel):
    baseUnit: Any
    conversionFactor: float
