from typing import Any
from pydantic import BaseModel

class PcbRouteHint(BaseModel):
    x: float
    y: float
    via: Any
    via_to_layer: Any
