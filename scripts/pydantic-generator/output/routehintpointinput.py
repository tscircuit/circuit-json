from typing import Any
from pydantic import BaseModel

class RouteHintPointInput(BaseModel):
    x: float
    y: float
    via: Any
    to_layer: Any
    trace_width: Any
