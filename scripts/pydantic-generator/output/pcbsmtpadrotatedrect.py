from typing import Any
from pydantic import BaseModel, validator

class PcbSmtPadRotatedRect(BaseModel):
    type: str
    shape: Any
    pcb_smtpad_id: str
    x: float
    y: float
    width: float
    height: float
    ccw_rotation: Any
    layer: Any
    port_hints: Any
    pcb_component_id: str
    pcb_port_id: str
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
