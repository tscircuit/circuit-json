import { z } from "zod"
import { layer_ref, type LayerRef } from "../pcb/properties/layer_ref"
import { expectTypesMatch } from "../utils/expect-types-match"

export const simulation_terminal_port = z
  .object({
    signal_pcb_port_id: z.string().min(1),
    reference_pcb_port_id: z.string().min(1).optional(),
    reference_layer: layer_ref,
    resistance: z.number().finite().positive(),
  })
  .describe(
    "A two-terminal return-current excitation port with resistance in ohms",
  )

export interface SimulationTerminalPort {
  signal_pcb_port_id: string
  reference_pcb_port_id?: string
  reference_layer: LayerRef
  resistance: number
}

export type SimulationTerminalPortInput = z.input<
  typeof simulation_terminal_port
>
expectTypesMatch<
  SimulationTerminalPort,
  z.infer<typeof simulation_terminal_port>
>(true)
