import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const simulation_spice_subcircuit = z
  .object({
    type: z.literal("simulation_spice_subcircuit"),
    simulation_spice_subcircuit_id: getZodPrefixedIdWithDefault(
      "simulation_spice_subcircuit",
    ),
    source_component_id: z.string(),
    spice_pin_to_source_port_map: z.record(z.string(), z.string()),
    subcircuit_source: z.string(),
  })
  .describe("Defines a custom SPICE subcircuit model for simulation")

export type SimulationSpiceSubcircuitInput = z.input<
  typeof simulation_spice_subcircuit
>
type InferredSimulationSpiceSubcircuit = z.infer<
  typeof simulation_spice_subcircuit
>

/**
 * Defines a custom SPICE subcircuit model for simulation.
 */
export interface SimulationSpiceSubcircuit {
  type: "simulation_spice_subcircuit"
  simulation_spice_subcircuit_id: string
  /**
   * Source component this SPICE subcircuit models.
   */
  source_component_id: string
  /**
   * Maps SPICE subcircuit pin names to source port ids.
   */
  spice_pin_to_source_port_map: Record<string, string>
  /**
   * Full SPICE subcircuit source text.
   */
  subcircuit_source: string
}

expectTypesMatch<SimulationSpiceSubcircuit, InferredSimulationSpiceSubcircuit>(
  true,
)
