from typing import Any
from pydantic import BaseModel

class SourceLed(BaseModel):
    ftype: Any
    type: str
    source_component_id: str
    name: str
    manufacturer_part_number: str
    supplier_part_numbers: Any
    display_value: str
