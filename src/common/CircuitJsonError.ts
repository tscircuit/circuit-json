import type {
  PcbTraceError,
  PcbPlacementError,
  PcbPortNotMatchedError,
  PcbAutoroutingError,
  PcbFootprintOverlapError,
  PcbMissingFootprintError,
  PcbComponentOutsideBoardError,
} from "src/pcb"
import type { SchematicError } from "src/schematic"
import type { SimulationUnknownExperimentError } from "src/simulation"
import type {
  UnknownErrorFindingPart,
  SourcePinMustBeConnectedError,
} from "src/source"

export type CircuitJsonError =
  | PcbTraceError
  | PcbPlacementError
  | PcbPortNotMatchedError
  | PcbAutoroutingError
  | PcbFootprintOverlapError
  | PcbMissingFootprintError
  | PcbComponentOutsideBoardError
  | SchematicError
  | UnknownErrorFindingPart
  | SimulationUnknownExperimentError
  | SourcePinMustBeConnectedError
