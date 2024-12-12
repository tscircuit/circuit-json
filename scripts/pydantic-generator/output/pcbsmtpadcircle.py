from typing import Any
from pydantic import BaseModel, validator

class PcbSmtPadCircle(BaseModel):
    type: str
    shape: Any
    pcb_smtpad_id: str
    x: float
    y: float
    radius: float
    layer: Any
    port_hints: Any
    pcb_component_id: str
    pcb_port_id: str
    @validator("radius")
    def validate_radius(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        return SIUnitConverter.convert_to_base_unit(v)
