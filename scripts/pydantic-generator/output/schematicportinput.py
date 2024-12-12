from typing import Any
from pydantic import BaseModel

class SchematicPortInput(BaseModel):
    type: str
    center: Any
    source_port_id: Any
    schematic_component_id: Any
    schematic_port_id: Any
    facing_direction: Any
    distance_from_component_edge: Any
    side_of_component: Any
    true_ccw_index: Any
    pin_number: Any
    display_pin_label: Any
