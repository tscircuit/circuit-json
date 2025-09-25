import { getZodPrefixedIdWithDefault } from "src/common"
import { type LayerRef, layer_ref } from "src/pcb/properties/layer_ref"
import { type Distance, distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const pcb_port = z
  .object({
    type: z.literal("pcb_port"),
    pcb_port_id: getZodPrefixedIdWithDefault("pcb_port"),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    source_port_id: z.string(),
    pcb_component_id: z.string(),
    x: distance,
    y: distance,
    layers: z.array(layer_ref),
    is_board_pinout: z.boolean().optional(),
  })
  .describe("Defines a port on the PCB")

export type PcbPortInput = z.input<typeof pcb_port>
type InferredPcbPort = z.infer<typeof pcb_port>

/**
 * Defines a port on the PCB
 */
export interface PcbPort {
  type: "pcb_port"
  pcb_port_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  source_port_id: string
  pcb_component_id: string
  x: Distance
  y: Distance
  layers: LayerRef[]
  is_board_pinout?: boolean
}

/**
 * @deprecated use PcbPort
 */
export type PCBPort = PcbPort

/**
 * @deprecated use PcbPortInput
 */
export type PCBPortInput = PcbPortInput

expectTypesMatch<PcbPort, InferredPcbPort>(true)
