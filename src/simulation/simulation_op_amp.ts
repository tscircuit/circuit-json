import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const simulation_op_amp = z
  .object({
    type: z.literal("simulation_op_amp"),
    simulation_op_amp_id: getZodPrefixedIdWithDefault("simulation_op_amp"),
    source_component_id: z.string().optional(),
    inverting_input_source_port_id: z.string(),
    non_inverting_input_source_port_id: z.string(),
    output_source_port_id: z.string(),
    positive_supply_source_port_id: z.string(),
    negative_supply_source_port_id: z.string(),
  })
  .describe("Defines a simple ideal operational amplifier for simulation")

export type SimulationOpAmpInput = z.input<typeof simulation_op_amp>
type InferredSimulationOpAmp = z.infer<typeof simulation_op_amp>

/**
 * Defines a simple ideal operational amplifier for simulation.
 */
export interface SimulationOpAmp {
  type: "simulation_op_amp"
  simulation_op_amp_id: string
  source_component_id?: string
  inverting_input_source_port_id: string
  non_inverting_input_source_port_id: string
  output_source_port_id: string
  positive_supply_source_port_id: string
  negative_supply_source_port_id: string
}

expectTypesMatch<SimulationOpAmp, InferredSimulationOpAmp>(true)
