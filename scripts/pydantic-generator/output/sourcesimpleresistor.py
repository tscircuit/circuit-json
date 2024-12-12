from typing import Any
from pydantic import BaseModel, validator

class SourceSimpleResistor(BaseModel):
    ftype: Any
    resistance: float
    @validator("resistance")
    def validate_resistance(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        return SIUnitConverter.convert_to_base_unit(v)
