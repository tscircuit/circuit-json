import type {
  PcbAutoroutingError,
  PcbComponentOutsideBoardError,
  PcbFootprintOverlapError,
  PcbMissingFootprintError,
  PcbPlacementError,
  PcbPortNotMatchedError,
  PcbTraceError,
} from "src/pcb"
import type { SchematicError } from "src/schematic"

export type CircuitJsonError =
  | PcbTraceError
  | PcbPlacementError
  | PcbPortNotMatchedError
  | PcbAutoroutingError
  | PcbFootprintOverlapError
  | PcbMissingFootprintError
  | PcbComponentOutsideBoardError
  | SchematicError
