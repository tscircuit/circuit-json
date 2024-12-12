from typing import Any
from pydantic import BaseModel, validator

class SourceSimplePowerSource(BaseModel):
    ftype: Any
    voltage: float
    @validator("voltage")
    def validate_voltage(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        return SIUnitConverter.convert_to_base_unit(v)
