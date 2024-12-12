from typing import Any
from pydantic import BaseModel, validator

class SchematicVoltageProbeInput(BaseModel):
    type: str
    schematic_voltage_probe_id: Any
    position: Any
    schematic_trace_id: Any
    voltage: Any
    @validator("voltage")
    def validate_voltage(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        return SIUnitConverter.convert_to_base_unit(v)
