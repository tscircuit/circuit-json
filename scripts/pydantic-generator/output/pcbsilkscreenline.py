from typing import Any
from pydantic import BaseModel

class PCBSilkscreenLine(BaseModel):
    type: str
    pcb_silkscreen_line_id: str
    pcb_component_id: str
    stroke_width: Any
    x1: Any
    y1: Any
    x2: Any
    y2: Any
    layer: Any
