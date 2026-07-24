import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { duration_ms, ms } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { simulation_dc_sweep_unit } from "./simulation_units"

export const experiment_type = z.union([
  z.literal("spice_dc_sweep"),
  z.literal("spice_dc_operating_point"),
  z.literal("spice_transient_analysis"),
  z.literal("spice_ac_analysis"),
])

export type ExperimentType = z.infer<typeof experiment_type>

export const spice_simulation_options = z
  .object({
    method: z.enum(["trap", "gear"]).optional(),
    reltol: z.union([z.number(), z.string()]).optional(),
    abstol: z.union([z.number(), z.string()]).optional(),
    vntol: z.union([z.number(), z.string()]).optional(),
  })
  .describe("SPICE solver options for a simulation experiment")

export interface SpiceSimulationOptions {
  method?: "trap" | "gear"
  reltol?: number | string
  abstol?: number | string
  vntol?: number | string
}

export interface SimulationExperiment {
  type: "simulation_experiment"
  simulation_experiment_id: string
  name: string
  experiment_type: ExperimentType
  time_per_step?: number // ms
  start_time_ms?: number // ms
  end_time_ms?: number // ms
  spice_options?: SpiceSimulationOptions
  dc_sweep_voltage_source_id?: string
  dc_sweep_current_source_id?: string
  dc_sweep_start?: number
  dc_sweep_stop?: number
  dc_sweep_step?: number
  dc_sweep_unit?: "V" | "A"
  ac_sweep_type?: "linear" | "decade" | "octave"
  ac_samples_per_interval?: number
  ac_sample_count?: number
  ac_start_frequency_hz?: number
  ac_stop_frequency_hz?: number
}

export const simulation_experiment = z
  .object({
    type: z.literal("simulation_experiment"),
    simulation_experiment_id: getZodPrefixedIdWithDefault(
      "simulation_experiment",
    ),
    name: z.string(),
    experiment_type,
    time_per_step: duration_ms.optional(),
    start_time_ms: ms.optional(),
    end_time_ms: ms.optional(),
    spice_options: spice_simulation_options.optional(),
    dc_sweep_voltage_source_id: z.string().optional(),
    dc_sweep_current_source_id: z.string().optional(),
    dc_sweep_start: z.number().optional(),
    dc_sweep_stop: z.number().optional(),
    dc_sweep_step: z
      .number()
      .refine((dcSweepStep) => dcSweepStep !== 0)
      .optional(),
    dc_sweep_unit: simulation_dc_sweep_unit.optional(),
    ac_sweep_type: z.enum(["linear", "decade", "octave"]).optional(),
    ac_samples_per_interval: z.number().int().positive().optional(),
    ac_sample_count: z.number().int().positive().optional(),
    ac_start_frequency_hz: z.number().positive().optional(),
    ac_stop_frequency_hz: z.number().positive().optional(),
  })
  .superRefine((experiment, context) => {
    if (experiment.experiment_type === "spice_dc_sweep") {
      const requiredFields = [
        "dc_sweep_start",
        "dc_sweep_stop",
        "dc_sweep_step",
        "dc_sweep_unit",
      ] as const
      for (const field of requiredFields) {
        if (experiment[field] === undefined) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: `${field} is required for a DC sweep`,
          })
        }
      }

      const hasVoltageSource =
        experiment.dc_sweep_voltage_source_id !== undefined
      const hasCurrentSource =
        experiment.dc_sweep_current_source_id !== undefined
      if (hasVoltageSource === hasCurrentSource) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dc_sweep_voltage_source_id"],
          message:
            "Exactly one DC sweep voltage or current source ID is required",
        })
      }
    }

    if (experiment.experiment_type === "spice_ac_analysis") {
      if (experiment.ac_sweep_type === undefined) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ac_sweep_type"],
          message: "ac_sweep_type is required for an AC analysis",
        })
      }
      if (experiment.ac_start_frequency_hz === undefined) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ac_start_frequency_hz"],
          message: "ac_start_frequency_hz is required for an AC analysis",
        })
      }
      if (experiment.ac_stop_frequency_hz === undefined) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ac_stop_frequency_hz"],
          message: "ac_stop_frequency_hz is required for an AC analysis",
        })
      }
      if (
        experiment.ac_sweep_type === "linear" &&
        experiment.ac_sample_count === undefined
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ac_sample_count"],
          message: "ac_sample_count is required for a linear AC analysis",
        })
      }
      if (
        (experiment.ac_sweep_type === "decade" ||
          experiment.ac_sweep_type === "octave") &&
        experiment.ac_samples_per_interval === undefined
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ac_samples_per_interval"],
          message:
            "ac_samples_per_interval is required for decade and octave AC analyses",
        })
      }
    }
  })
  .describe("Defines a simulation experiment configuration")

export type SimulationExperimentInput = z.input<typeof simulation_experiment>
type InferredSimulationExperiment = z.infer<typeof simulation_experiment>

expectTypesMatch<SimulationExperiment, InferredSimulationExperiment>(true)
