from typing import Any
from pydantic import BaseModel

class SourceGroup(BaseModel):
    type: str
    name: str
    source_group_id: Any
