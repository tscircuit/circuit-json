from typing import Any
from pydantic import BaseModel

class PcbSilkscreenOvalInput(BaseModel):
    type: str
    pcb_silkscreen_oval_id: Any
    pcb_component_id: Any
    center: Any
    radius_x: Any
    radius_y: Any
    layer: Any
