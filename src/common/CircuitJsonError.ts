import type {
  PcbTraceError,
  PcbPlacementError,
  PcbPackingError,
  PcbPortNotMatchedError,
  PcbAutoroutingError,
  PcbFootprintOverlapError,
  PcbMissingFootprintError,
  PcbComponentOutsideBoardError,
} from "src/pcb"
import type { SchematicError } from "src/schematic"
import type { SimulationUnknownExperimentError } from "src/simulation"
import type {
  SourceDifferentialPairNotPointToPointError,
  SourcePinMustBeConnectedError,
  UnknownErrorFindingPart,
} from "src/source"

export type CircuitJsonError =
  | PcbTraceError
  | PcbPlacementError
  | PcbPackingError
  | PcbPortNotMatchedError
  | PcbAutoroutingError
  | PcbFootprintOverlapError
  | PcbMissingFootprintError
  | PcbComponentOutsideBoardError
  | SchematicError
  | UnknownErrorFindingPart
  | SimulationUnknownExperimentError
  | SourcePinMustBeConnectedError
  | SourceDifferentialPairNotPointToPointError
