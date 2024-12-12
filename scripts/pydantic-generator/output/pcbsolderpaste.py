from typing import Any
from pydantic import BaseModel

class PcbSolderPaste(BaseModel):
    type: str
    shape: Any
    pcb_solder_paste_id: str
    x: float
    y: float
    layer: Any
    pcb_component_id: str
    pcb_smtpad_id: str
