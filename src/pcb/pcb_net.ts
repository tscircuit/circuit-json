import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const pcb_net = z
  .object({
    type: z.literal("pcb_net"),
    pcb_net_id: getZodPrefixedIdWithDefault("pcb_net"),
    source_net_id: z.string().optional(),
    highlight_color: z.string().optional(),
  })
  .describe("Defines a net on the PCB")

export type PcbNetInput = z.input<typeof pcb_net>
type InferredPcbNet = z.infer<typeof pcb_net>

/**
 * Defines a net on the PCB
 */
export interface PcbNet {
  type: "pcb_net"
  pcb_net_id: string
  source_net_id?: string
  highlight_color?: string
}

expectTypesMatch<PcbNet, InferredPcbNet>(true)
