import type {
  SimulationAcSweepCurrentGraph,
  SimulationAcSweepCurrentGraphInput,
} from "./simulation_ac_sweep_current_graph"
import type {
  SimulationAcSweepVoltageGraph,
  SimulationAcSweepVoltageGraphInput,
} from "./simulation_ac_sweep_voltage_graph"
import type {
  SimulationDcOperatingPointCurrent,
  SimulationDcOperatingPointCurrentInput,
} from "./simulation_dc_operating_point_current"
import type {
  SimulationDcOperatingPointVoltage,
  SimulationDcOperatingPointVoltageInput,
} from "./simulation_dc_operating_point_voltage"
import type {
  SimulationDcSweepCurrentGraph,
  SimulationDcSweepCurrentGraphInput,
} from "./simulation_dc_sweep_current_graph"
import type {
  SimulationDcSweepVoltageGraph,
  SimulationDcSweepVoltageGraphInput,
} from "./simulation_dc_sweep_voltage_graph"
import type {
  SimulationTransientCurrentGraph,
  SimulationTransientCurrentGraphInput,
} from "./simulation_transient_current_graph"
import type {
  SimulationTransientVoltageGraph,
  SimulationTransientVoltageGraphInput,
} from "./simulation_transient_voltage_graph"

export type SimulationNonTransientVoltageAnalysisResult =
  | SimulationDcOperatingPointVoltage
  | SimulationDcSweepVoltageGraph
  | SimulationAcSweepVoltageGraph

export type SimulationNonTransientCurrentAnalysisResult =
  | SimulationDcOperatingPointCurrent
  | SimulationDcSweepCurrentGraph
  | SimulationAcSweepCurrentGraph

export type SimulationVoltageAnalysisResult =
  | SimulationTransientVoltageGraph
  | SimulationNonTransientVoltageAnalysisResult

export type SimulationCurrentAnalysisResult =
  | SimulationTransientCurrentGraph
  | SimulationNonTransientCurrentAnalysisResult

export type SimulationAnalysisResult =
  | SimulationVoltageAnalysisResult
  | SimulationCurrentAnalysisResult

export type SimulationNonTransientVoltageAnalysisResultInput =
  | SimulationDcOperatingPointVoltageInput
  | SimulationDcSweepVoltageGraphInput
  | SimulationAcSweepVoltageGraphInput

export type SimulationNonTransientCurrentAnalysisResultInput =
  | SimulationDcOperatingPointCurrentInput
  | SimulationDcSweepCurrentGraphInput
  | SimulationAcSweepCurrentGraphInput

export type SimulationVoltageAnalysisResultInput =
  | SimulationTransientVoltageGraphInput
  | SimulationNonTransientVoltageAnalysisResultInput

export type SimulationCurrentAnalysisResultInput =
  | SimulationTransientCurrentGraphInput
  | SimulationNonTransientCurrentAnalysisResultInput

export type SimulationAnalysisResultInput =
  | SimulationVoltageAnalysisResultInput
  | SimulationCurrentAnalysisResultInput
