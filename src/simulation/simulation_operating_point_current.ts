import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { current } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export interface SimulationOperatingPointCurrent {
  type: "simulation_operating_point_current"
  simulation_operating_point_current_id: string
  simulation_experiment_id: string
  simulation_current_probe_id?: string
  current: number
  name?: string
  source_component_id?: string
  source_trace_id?: string
  color?: string
}

export const simulation_operating_point_current = z
  .object({
    type: z.literal("simulation_operating_point_current"),
    simulation_operating_point_current_id: getZodPrefixedIdWithDefault(
      "simulation_operating_point_current",
    ),
    simulation_experiment_id: z.string(),
    simulation_current_probe_id: z.string().optional(),
    current,
    name: z.string().optional(),
    source_component_id: z.string().optional(),
    source_trace_id: z.string().optional(),
    color: z.string().optional(),
  })
  .describe("Stores a current measured by a DC operating-point experiment")

export type SimulationOperatingPointCurrentInput = z.input<
  typeof simulation_operating_point_current
>

expectTypesMatch<
  SimulationOperatingPointCurrent,
  z.infer<typeof simulation_operating_point_current>
>(true)
