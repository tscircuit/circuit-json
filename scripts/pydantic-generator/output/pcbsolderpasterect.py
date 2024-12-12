from typing import Any
from pydantic import BaseModel, validator

class PcbSolderPasteRect(BaseModel):
    type: str
    shape: Any
    pcb_solder_paste_id: str
    x: float
    y: float
    width: float
    height: float
    layer: Any
    pcb_component_id: str
    pcb_smtpad_id: str
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
