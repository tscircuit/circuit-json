from typing import Any
from pydantic import BaseModel, validator

class InferredPcbSilkscreenPill(BaseModel):
    type: str
    pcb_silkscreen_pill_id: Any
    pcb_component_id: Any
    center: Any
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
