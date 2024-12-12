from typing import Point, Any
from pydantic import BaseModel, validator

class PcbSilkscreenCircle(BaseModel):
    type: str
    pcb_silkscreen_circle_id: str
    pcb_component_id: str
    center: Point
    radius: Any
    layer: Any
    @validator("radius")
    def validate_radius(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        return SIUnitConverter.convert_to_base_unit(v)
