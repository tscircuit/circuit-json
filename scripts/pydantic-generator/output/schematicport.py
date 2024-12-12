from typing import Any
from pydantic import BaseModel

class SchematicPort(BaseModel):
    type: str
    schematic_port_id: str
    source_port_id: str
    schematic_component_id: str
    center: Any
    facing_direction: Any
    distance_from_component_edge: float
    side_of_component: Any
    true_ccw_index: float
    pin_number: float
    display_pin_label: str
