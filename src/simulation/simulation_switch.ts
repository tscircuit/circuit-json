import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { frequency, timestamp } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const simulation_switch = z
  .object({
    type: z.literal("simulation_switch"),
    simulation_switch_id: getZodPrefixedIdWithDefault("simulation_switch"),
    closes_at: timestamp.optional(),
    opens_at: timestamp.optional(),
    starts_closed: z.boolean().optional(),
    switching_frequency: frequency.optional(),
  })
  .describe("Defines a switch for simulation timing control")

export type SimulationSwitchInput = z.input<typeof simulation_switch>

type InferredSimulationSwitch = z.infer<typeof simulation_switch>

export interface SimulationSwitch {
  type: "simulation_switch"
  simulation_switch_id: string
  closes_at?: number
  opens_at?: number
  starts_closed?: boolean
  switching_frequency?: number
}

expectTypesMatch<SimulationSwitch, InferredSimulationSwitch>(true)
