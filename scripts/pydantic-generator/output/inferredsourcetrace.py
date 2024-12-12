from typing import Any
from pydantic import BaseModel

class InferredSourceTrace(BaseModel):
    type: str
    source_trace_id: Any
    connected_source_port_ids: Any
    connected_source_net_ids: Any
    subcircuit_connectivity_map_key: Any
