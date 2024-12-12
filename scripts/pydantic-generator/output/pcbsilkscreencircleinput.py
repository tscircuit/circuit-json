from typing import Any
from pydantic import BaseModel, validator

class PcbSilkscreenCircleInput(BaseModel):
    type: str
    pcb_silkscreen_circle_id: Any
    pcb_component_id: Any
    center: Any
    radius: Any
    layer: Any
    @validator("radius")
    def validate_radius(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        return SIUnitConverter.convert_to_base_unit(v)
