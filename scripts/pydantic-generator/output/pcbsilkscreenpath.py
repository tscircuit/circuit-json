from typing import Any, List, Point
from pydantic import BaseModel

class PcbSilkscreenPath(BaseModel):
    type: str
    pcb_silkscreen_path_id: str
    pcb_component_id: str
    layer: Any
    route: List[Point]
    stroke_width: Any
