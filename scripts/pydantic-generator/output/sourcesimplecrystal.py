from typing import Any
from pydantic import BaseModel, validator

class SourceSimpleCrystal(BaseModel):
    ftype: Any
    frequency: float
    load_capacitance: float
    @validator("frequency")
    def validate_frequency(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        return SIUnitConverter.convert_to_base_unit(v)
