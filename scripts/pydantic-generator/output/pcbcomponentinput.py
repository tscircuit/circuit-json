from typing import Any
from pydantic import BaseModel, validator

class PcbComponentInput(BaseModel):
    type: str
    pcb_component_id: Any
    source_component_id: Any
    center: Any
    layer: Any
    rotation: Any
    width: float
    height: float
    @validator("width")
    def validate_width(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        return SIUnitConverter.convert_to_base_unit(v)

    @validator("height")
    def validate_height(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        return SIUnitConverter.convert_to_base_unit(v)
