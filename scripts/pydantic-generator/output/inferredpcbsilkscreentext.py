from typing import Any
from pydantic import BaseModel

class InferredPcbSilkscreenText(BaseModel):
    type: str
    pcb_silkscreen_text_id: Any
    font: Any
    font_size: Any
    pcb_component_id: Any
    text: Any
    layer: Any
    is_mirrored: Any
    anchor_position: Any
    anchor_alignment: Any
