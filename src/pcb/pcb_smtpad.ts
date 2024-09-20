import { z } from "zod"
import { distance, type Distance, getZodPrefixedIdWithDefault } from "src/units"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_smtpad = z
  .union([
    z.object({
      pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
      type: z.literal("pcb_smtpad"),
      shape: z.literal("circle"),
      x: distance,
      y: distance,
      radius: z.number(),
      layer: layer_ref,
      port_hints: z.array(z.string()).optional(),
      pcb_component_id: z.string().optional(),
      pcb_port_id: z.string().optional(),
    }),
    z.object({
      pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
      type: z.literal("pcb_smtpad"),
      shape: z.literal("rect"),
      x: distance,
      y: distance,
      width: z.number(),
      height: z.number(),
      layer: layer_ref,
      port_hints: z.array(z.string()).optional(),
      pcb_component_id: z.string().optional(),
      pcb_port_id: z.string().optional(),
    }),
  ])
  .describe("Defines an SMT pad on the PCB")

export type PCBSMTPadInput = z.input<typeof pcb_smtpad>
type InferredPCBSMTPad = z.infer<typeof pcb_smtpad>

/**
 * Defines an SMT pad on the PCB
 */
export interface PcbSmtPad {
  pcb_smtpad_id: string
  type: "pcb_smtpad"
  shape: "circle" | "rect"
  x: Distance
  y: Distance
  radius?: number
  width?: number
  height?: number
  layer: LayerRef
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
}

/**
 * @deprecated use PcbSmtPad
 */
export type PCBSMTPad = PcbSmtPad

expectTypesMatch<PcbSmtPad, InferredPCBSMTPad>(true)
