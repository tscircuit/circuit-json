from typing import Any
from pydantic import BaseModel

class SchematicNetLabelInput(BaseModel):
    type: str
    center: Any
    text: Any
    anchor_position: Any
    symbol_name: Any
    source_net_id: Any
    anchor_side: Any
