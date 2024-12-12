from typing import Any
from pydantic import BaseModel

class PcbSilkscreenLineInput(BaseModel):
    type: str
    pcb_silkscreen_line_id: Any
    pcb_component_id: Any
    stroke_width: Any
    x1: Any
    y1: Any
    x2: Any
    y2: Any
    layer: Any
