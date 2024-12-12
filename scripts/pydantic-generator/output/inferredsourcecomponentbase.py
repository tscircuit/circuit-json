from typing import Any
from pydantic import BaseModel

class InferredSourceComponentBase(BaseModel):
    type: str
    name: str
    source_component_id: Any
    ftype: Any
    manufacturer_part_number: Any
    supplier_part_numbers: Any
    display_value: Any
