from typing import Any, List, Point
from pydantic import BaseModel

class PcbFabricationNotePathInput(BaseModel):
    type: str
    pcb_fabrication_note_path_id: Any
    pcb_component_id: Any
    layer: Any
    route: List[Point]
    stroke_width: Any
    color: Any
