import type {
  PcbTraceError,
  PcbPlacementError,
  PcbPortNotMatchedError,
  PcbAutoroutingError,
  PcbMissingFootprintError,
} from "src/pcb"
import type { SchematicError } from "src/schematic"

export type CircuitJsonError =
  | PcbTraceError
  | PcbPlacementError
  | PcbPortNotMatchedError
  | PcbAutoroutingError
  | PcbMissingFootprintError
  | SchematicError
