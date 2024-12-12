from typing import Any
from pydantic import BaseModel

class SourceGroupInput(BaseModel):
    type: str
    name: str
    source_group_id: Any
