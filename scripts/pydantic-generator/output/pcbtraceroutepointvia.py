from typing import Any
from pydantic import BaseModel

class PcbTraceRoutePointVia(BaseModel):
    route_type: Any
    x: float
    y: float
    from_layer: str
    to_layer: str
