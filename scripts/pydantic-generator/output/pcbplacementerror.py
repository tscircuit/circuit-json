from pydantic import BaseModel

class PCBPlacementError(BaseModel):
    type: str
    pcb_placement_error_id: str
    message: str
