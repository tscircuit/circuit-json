from typing import Any, Point
from pydantic import BaseModel

class PCBSilkscreenText(BaseModel):
    type: str
    pcb_silkscreen_text_id: str
    font: Any
    font_size: Any
    pcb_component_id: str
    text: str
    layer: Any
    is_mirrored: bool
    anchor_position: Point
    anchor_alignment: Any
