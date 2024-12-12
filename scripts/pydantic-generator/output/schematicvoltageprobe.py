from typing import Any
from pydantic import BaseModel, validator

class SchematicVoltageProbe(BaseModel):
    type: str
    schematic_voltage_probe_id: str
    position: Any
    schematic_trace_id: str
    voltage: float
    @validator("voltage")
    def validate_voltage(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        return SIUnitConverter.convert_to_base_unit(v)
