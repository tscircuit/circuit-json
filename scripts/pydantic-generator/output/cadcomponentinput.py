from typing import Any
from pydantic import BaseModel

class CadComponentInput(BaseModel):
    type: str
    cad_component_id: Any
    pcb_component_id: Any
    source_component_id: Any
    position: Any
    rotation: Any
    size: Any
    layer: Any
    footprinter_string: Any
    model_obj_url: Any
    model_stl_url: Any
    model_3mf_url: Any
    model_jscad: Any
