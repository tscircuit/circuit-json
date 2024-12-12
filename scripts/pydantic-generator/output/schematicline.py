from pydantic import BaseModel

class SchematicLine(BaseModel):
    type: str
    schematic_component_id: str
    x1: float
    x2: float
    y1: float
    y2: float
