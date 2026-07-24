import { z } from "zod"

export type SimulationDcSweepUnit = "V" | "A"

// Units intentionally use their canonical symbols instead of enum-style names.
export const simulation_dc_sweep_unit = z.custom<SimulationDcSweepUnit>(
  (dcSweepUnit) => dcSweepUnit === "V" || dcSweepUnit === "A",
)

export type SimulationParameterUnit = "Ω" | "F" | "H" | "V" | "A"

// Units intentionally use their canonical symbols instead of enum-style names.
export const simulation_parameter_unit = z.custom<SimulationParameterUnit>(
  (parameterUnit) =>
    parameterUnit === "Ω" ||
    parameterUnit === "F" ||
    parameterUnit === "H" ||
    parameterUnit === "V" ||
    parameterUnit === "A",
)
