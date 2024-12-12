from typing import Any
from pydantic import BaseModel, validator

class PcbTraceRoutePointWire(BaseModel):
    route_type: Any
    x: float
    y: float
    width: float
    start_pcb_port_id: str
    end_pcb_port_id: str
    layer: Any
    @validator("width")
    def validate_width(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        return SIUnitConverter.convert_to_base_unit(v)
