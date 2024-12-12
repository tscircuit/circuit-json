from typing import Any
from pydantic import BaseModel

class PcbRouteHintInput(BaseModel):
    x: float
    y: float
    via: Any
    via_to_layer: Any
