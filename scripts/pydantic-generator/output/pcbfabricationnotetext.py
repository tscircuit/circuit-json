from typing import Any, Point
from pydantic import BaseModel

class PCBFabricationNoteText(BaseModel):
    type: str
    pcb_fabrication_note_text_id: str
    font: Any
    font_size: Any
    pcb_component_id: str
    text: str
    layer: Any
    anchor_position: Point
    anchor_alignment: Any
    color: str
