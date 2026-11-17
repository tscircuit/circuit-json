import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** One simulation.pcbtransientchannelsimulation run. Its channels, waveforms, results and eye diagrams point back to it by id. */
export interface SimulationPcbTransientChannelSimulation {
  type: "simulation_pcb_transient_channel_simulation"
  simulation_pcb_transient_channel_simulation_id: string
  name?: string
  bit_rate_bps: number
  duration_s?: number
  allow_unrouted_traces: boolean
}

export const simulation_pcb_transient_channel_simulation = z
  .object({
    type: z.literal("simulation_pcb_transient_channel_simulation"),
    simulation_pcb_transient_channel_simulation_id: getZodPrefixedIdWithDefault(
      "simulation_pcb_transient_channel_simulation",
    ),
    name: z.string().min(1).optional(),
    bit_rate_bps: z.number().finite().positive(),
    duration_s: z.number().finite().positive().optional(),
    allow_unrouted_traces: z.boolean(),
  })
  .describe("Defines a PCB transient channel simulation run")

export type SimulationPcbTransientChannelSimulationInput = z.input<
  typeof simulation_pcb_transient_channel_simulation
>
expectTypesMatch<
  SimulationPcbTransientChannelSimulation,
  z.infer<typeof simulation_pcb_transient_channel_simulation>
>(true)
