import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { distance, type Distance } from "src/units"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"

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
