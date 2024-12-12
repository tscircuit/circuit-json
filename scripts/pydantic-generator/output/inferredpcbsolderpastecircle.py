from typing import Any
from pydantic import BaseModel, validator

class InferredPcbSolderPasteCircle(BaseModel):
    type: str
    shape: Any
    pcb_solder_paste_id: Any
    x: float
    y: float
    radius: Any
    layer: Any
    pcb_component_id: Any
    pcb_smtpad_id: Any
    @validator("radius")
    def validate_radius(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        return SIUnitConverter.convert_to_base_unit(v)
