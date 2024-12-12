from typing import Any
from pydantic import BaseModel

class PcbTraceRoutePoint(BaseModel):
    route_type: Any
    x: float
    y: float
