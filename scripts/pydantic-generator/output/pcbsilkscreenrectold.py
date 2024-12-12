from typing import Point, Any
from pydantic import BaseModel, validator

class PcbSilkscreenRectOld(BaseModel):
    type: str
    pcb_silkscreen_rect_id: str
    pcb_component_id: str
    center: Point
    width: float
    height: float
    layer: Any
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
