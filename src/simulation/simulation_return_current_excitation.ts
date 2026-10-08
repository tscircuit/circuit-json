import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"
import {
  return_current_contact,
  type ReturnCurrentContact,
} from "./return_current_contact"
import {
  simulation_terminal_port,
  type SimulationTerminalPort,
} from "./simulation_terminal_port"

export const simulation_return_current_excitation = z
  .object({
    type: z.literal("simulation_return_current_excitation"),
    simulation_return_current_excitation_id: getZodPrefixedIdWithDefault(
      "simulation_return_current_excitation",
    ),
    simulation_experiment_id: z.string().min(1),
    pcb_trace_id: z.string().min(1),
    ground_source_net_id: z.string().min(1),
    current: z.number().finite(),
    return_source: return_current_contact,
    return_sink: return_current_contact,
    source_port: simulation_terminal_port.optional(),
    load_port: simulation_terminal_port.optional(),
  })
  .describe(
    "Excites a signal trace with signed current in amperes, peak for AC; return_source is near the load and return_sink near the driver for positive current",
  )

export interface SimulationReturnCurrentExcitation {
  type: "simulation_return_current_excitation"
  simulation_return_current_excitation_id: string
  simulation_experiment_id: string
  pcb_trace_id: string
  ground_source_net_id: string
  current: number
  return_source: ReturnCurrentContact
  return_sink: ReturnCurrentContact
  source_port?: SimulationTerminalPort
  load_port?: SimulationTerminalPort
}

export type SimulationReturnCurrentExcitationInput = z.input<
  typeof simulation_return_current_excitation
>
expectTypesMatch<
  SimulationReturnCurrentExcitation,
  z.infer<typeof simulation_return_current_excitation>
>(true)
