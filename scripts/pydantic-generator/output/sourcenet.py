from typing import Any
from pydantic import BaseModel

class SourceNet(BaseModel):
    type: str
    name: str
    trace_width: Any
    source_net_id: Any
    member_source_group_ids: Any
    is_power: Any
    is_ground: Any
    is_digital_signal: Any
    is_analog_signal: Any
