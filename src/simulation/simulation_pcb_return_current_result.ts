import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const simulation_pcb_return_current_result = z
  .object({
    type: z.literal("simulation_pcb_return_current_result"),
    simulation_pcb_return_current_result_id: getZodPrefixedIdWithDefault(
      "simulation_pcb_return_current_result",
    ),
    simulation_experiment_id: z.string().min(1),
    pcb_board_id: z.string().min(1),
    simulation_return_current_excitation_ids: z
      .array(z.string().min(1))
      .min(1)
      .refine(
        (ids) => new Set(ids).size === ids.length,
        "Excitation IDs must be unique",
      ),
    frequency_hz: z.number().finite().positive().optional(),
  })
  .describe(
    "A PCB return-current result at one frequency, or a frequency-independent result when frequency_hz is absent",
  )

export interface SimulationPcbReturnCurrentResult {
  type: "simulation_pcb_return_current_result"
  simulation_pcb_return_current_result_id: string
  simulation_experiment_id: string
  pcb_board_id: string
  simulation_return_current_excitation_ids: string[]
  frequency_hz?: number
}

export type SimulationPcbReturnCurrentResultInput = z.input<
  typeof simulation_pcb_return_current_result
>
expectTypesMatch<
  SimulationPcbReturnCurrentResult,
  z.infer<typeof simulation_pcb_return_current_result>
>(true)
