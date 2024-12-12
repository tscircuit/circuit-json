from typing import Any
from pydantic import BaseModel, validator

class PcbRouteHints(BaseModel):
    length: float
    __@unscopables@116: Any
    @validator("length")
    def validate_length(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        return SIUnitConverter.convert_to_base_unit(v)
