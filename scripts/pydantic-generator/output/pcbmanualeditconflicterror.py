from pydantic import BaseModel

class PCBManualEditConflictError(BaseModel):
    type: str
    pcb_error_id: str
    message: str
    pcb_component_id: str
    source_component_id: str
