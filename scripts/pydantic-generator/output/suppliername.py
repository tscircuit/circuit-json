from pydantic import BaseModel, validator

class SupplierName(BaseModel):
    length: float
    @validator("length")
    def validate_length(cls, v):
        from .templates.unit_conversion import SIUnitConverter
        if isinstance(v, (int, float)):
            return float(v)
        return SIUnitConverter.convert_to_base_unit(v)
