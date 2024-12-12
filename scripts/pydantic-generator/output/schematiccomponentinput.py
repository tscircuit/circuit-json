from typing import Any
from pydantic import BaseModel

class SchematicComponentInput(BaseModel):
    type: str
    source_component_id: Any
    center: Any
    rotation: Any
    schematic_component_id: Any
    size: Any
    pin_spacing: Any
    pin_styles: Any
    box_width: Any
    symbol_name: Any
    port_arrangement: Any
    port_labels: Any
    symbol_display_value: Any
