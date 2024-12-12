from typing import Any, List, Point
from pydantic import BaseModel

class InferredPcbSilkscreenPath(BaseModel):
    type: str
    pcb_silkscreen_path_id: Any
    pcb_component_id: Any
    layer: Any
    route: List[Point]
    stroke_width: Any
