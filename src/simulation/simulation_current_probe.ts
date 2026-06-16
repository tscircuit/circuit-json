import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const simulation_current_probe = z
  .object({
    type: z.literal("simulation_current_probe"),
    simulation_current_probe_id: getZodPrefixedIdWithDefault(
      "simulation_current_probe",
    ),
    source_component_id: z.string().optional(),
    name: z.string().optional(),
    target_source_port_id: z.string(),
    subcircuit_id: z.string().optional(),
    color: z.string().optional(),
  })
  .describe(
    "Defines a port-based current probe for simulation. Current is positive when entering the selected target_source_port_id.",
  )

export type SimulationCurrentProbeInput = z.input<
  typeof simulation_current_probe
>
type InferredSimulationCurrentProbe = z.infer<typeof simulation_current_probe>

/**
 * Defines a port-based current probe for simulation.
 *
 * Current is positive when entering the selected target_source_port_id.
 */
export interface SimulationCurrentProbe {
  type: "simulation_current_probe"
  simulation_current_probe_id: string
  source_component_id?: string
  name?: string
  target_source_port_id: string
  subcircuit_id?: string
  color?: string
}

expectTypesMatch<SimulationCurrentProbe, InferredSimulationCurrentProbe>(true)
