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
  /**
   * Drive pattern for aggressors. Aggressors are output-capable pins coupled to
   * the simulation's channels, excluding the driver pins of all channels in
   * that simulation. Accepts a non-empty string after trimming, using channel
   * pattern syntax. "0" and "1" drive quiet low and high, while "prbs7",
   * "clock", or switching bits drive transitions. The channels keep their own
   * `pattern` and `driver_disabled` settings. Absent stays absent without a
   * default for the simulation consumer to interpret.
   */
  aggressor_pattern?: string
  /**
   * Optional boolean. When true, tri-state every aggressor (high impedance) and
   * ignore `aggressor_pattern`. Every aggressor's IBIS model must support
   * disabling its output. Explicit false is preserved and leaves
   * `aggressor_pattern` in effect if supplied. Absent stays absent without a
   * default for the simulation consumer to interpret.
   */
  aggressor_disabled?: boolean
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
    aggressor_pattern: z.string().trim().min(1).optional(),
    aggressor_disabled: z.boolean().optional(),
  })
  .describe("Defines a PCB transient channel simulation run")

export type SimulationPcbTransientChannelSimulationInput = z.input<
  typeof simulation_pcb_transient_channel_simulation
>
expectTypesMatch<
  SimulationPcbTransientChannelSimulation,
  z.infer<typeof simulation_pcb_transient_channel_simulation>
>(true)
