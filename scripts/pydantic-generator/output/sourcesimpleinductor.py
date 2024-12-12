from typing import Any
from pydantic import BaseModel, validator

class SourceSimpleInductor(BaseModel):
    ftype: Any
    inductance: float
    @validator("inductance")
    def validate_inductance(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        return SIUnitConverter.convert_to_base_unit(v)
