from typing import Any
from pydantic import BaseModel, validator

class PCBSMTPadInput(BaseModel):
    type: str
    shape: Any
    pcb_smtpad_id: Any
    x: float
    y: float
    radius: Any
    layer: Any
    port_hints: Any
    pcb_component_id: Any
    pcb_port_id: Any
    width: float
    height: float
    ccw_rotation: Any
    @validator("radius")
    def validate_radius(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        return SIUnitConverter.convert_to_base_unit(v)

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
