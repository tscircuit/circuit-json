from typing import Any
from pydantic import BaseModel

class SchematicComponent(BaseModel):
    type: str
    rotation: float
    size: Any
    center: Any
    source_component_id: str
    schematic_component_id: str
    pin_spacing: float
    pin_styles: Any
    box_width: float
    symbol_name: str
    port_arrangement: Any
    port_labels: Any
    symbol_display_value: str
