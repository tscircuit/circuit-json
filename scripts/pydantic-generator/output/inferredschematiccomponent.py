from typing import Any
from pydantic import BaseModel

class InferredSchematicComponent(BaseModel):
    type: str
    rotation: Any
    size: Any
    center: Any
    source_component_id: Any
    schematic_component_id: Any
    pin_spacing: Any
    pin_styles: Any
    box_width: Any
    symbol_name: Any
    port_arrangement: Any
    port_labels: Any
    symbol_display_value: Any
