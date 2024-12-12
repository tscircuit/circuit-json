from typing import Any
from pydantic import BaseModel

class InferredPcbFabricationNoteText(BaseModel):
    type: str
    pcb_fabrication_note_text_id: Any
    font: Any
    font_size: Any
    pcb_component_id: Any
    text: Any
    layer: Any
    anchor_position: Any
    anchor_alignment: Any
    color: Any
