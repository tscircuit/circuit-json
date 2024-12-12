from typing import Any
from pydantic import BaseModel, validator

class SourceSimpleCapacitor(BaseModel):
    ftype: Any
    capacitance: float
    @validator("capacitance")
    def validate_capacitance(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        return SIUnitConverter.convert_to_base_unit(v)
