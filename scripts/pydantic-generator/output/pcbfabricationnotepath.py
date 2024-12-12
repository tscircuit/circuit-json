from typing import Any, List, Point
from pydantic import BaseModel

class PCBFabricationNotePath(BaseModel):
    type: str
    pcb_fabrication_note_path_id: str
    pcb_component_id: str
    layer: Any
    route: List[Point]
    stroke_width: Any
    color: str
