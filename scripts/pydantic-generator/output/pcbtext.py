from typing import Point, Any
from pydantic import BaseModel, validator

class PCBText(BaseModel):
    type: str
    pcb_text_id: str
    text: str
    center: Point
    layer: Any
    width: float
    height: float
    lines: float
    align: Any
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