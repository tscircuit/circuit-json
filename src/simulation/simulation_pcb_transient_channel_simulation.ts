import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { ms } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** One simulation.pcbtransientchannelsimulation run. Its channels, results and eye diagrams point back to it by id. */
export interface SimulationPcbTransientChannelSimulation {
  type: "simulation_pcb_transient_channel_simulation"
  simulation_pcb_transient_channel_simulation_id: string
  name?: string
  bit_rate_bps: number
  duration_ms?: number
  allow_unrouted_traces: boolean
  /** Pattern for aggressors, the output-capable pins coupled to the selected channels outside their endpoints. Uses the channel pattern syntax. "0" and "1" drive quiet low and high, while "prbs7", "clock", or switching bits drive transitions. The selected channels (victims) keep their own `pattern` and `driver_disabled` settings. */
  aggressor_pattern?: string
  /** Tri-state every aggressor (high impedance) and ignore aggressor_pattern. Pattern "0" actively drives low. */
  aggressors_disabled?: boolean
}

export const simulation_pcb_transient_channel_simulation = z
  .object({
    type: z.literal("simulation_pcb_transient_channel_simulation"),
    simulation_pcb_transient_channel_simulation_id: getZodPrefixedIdWithDefault(
      "simulation_pcb_transient_channel_simulation",
    ),
    name: z.string().min(1).optional(),
    bit_rate_bps: z.number().finite().positive(),
    duration_ms: ms.refine((value) => value > 0).optional(),
    allow_unrouted_traces: z.boolean(),
    aggressor_pattern: z.string().min(1).optional(),
    aggressors_disabled: z.boolean().optional(),
  })
  .describe("Defines a PCB transient channel simulation run")

export type SimulationPcbTransientChannelSimulationInput = z.input<
  typeof simulation_pcb_transient_channel_simulation
>
expectTypesMatch<
  SimulationPcbTransientChannelSimulation,
  z.infer<typeof simulation_pcb_transient_channel_simulation>
>(true)
