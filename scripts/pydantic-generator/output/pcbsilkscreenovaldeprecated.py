from typing import Point, Any
from pydantic import BaseModel

class PcbSilkscreenOvalDeprecated(BaseModel):
    type: str
    pcb_silkscreen_oval_id: str
    pcb_component_id: str
    center: Point
    radius_x: Any
    radius_y: Any
    layer: Any
