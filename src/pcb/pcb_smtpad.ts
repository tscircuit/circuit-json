import { z } from "zod"
import { distance, type Distance } from "src/units"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

const pcb_smtpad_circle = z.object({
  type: z.literal("pcb_smtpad"),
  shape: z.literal("circle"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  x: distance,
  y: distance,
  radius: z.number(),
  layer: layer_ref,
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  no_solder_paste: z.boolean().optional(),
})

const pcb_smtpad_rect = z.object({
  type: z.literal("pcb_smtpad"),
  shape: z.literal("rect"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  x: distance,
  y: distance,
  width: z.number(),
  height: z.number(),
  layer: layer_ref,
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  no_solder_paste: z.boolean().optional(),
})

export const pcb_smtpad = z
  .union([pcb_smtpad_circle, pcb_smtpad_rect])
  .describe("Defines an SMT pad on the PCB")

export type PCBSMTPadInput = z.input<typeof pcb_smtpad>
type PCBSMTPadCircle = z.infer<typeof pcb_smtpad_circle>
type PCBSMTPadRect = z.infer<typeof pcb_smtpad_rect>

/**
 * Defines an SMT pad on the PCB
 */
export interface PcbSmtPadCircle {
  type: "pcb_smtpad"
  shape: "circle"
  pcb_smtpad_id: string
  x: Distance
  y: Distance
  radius: number
  layer: LayerRef
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  no_solder_paste?: boolean
}

/**
 * Defines an SMT pad on the PCB
 */
export interface PcbSmtPadRect {
  type: "pcb_smtpad"
  shape: "rect"
  pcb_smtpad_id: string
  x: Distance
  y: Distance
  width: number
  height: number
  layer: LayerRef
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  no_solder_paste?: boolean
}

export type PcbSmtPad = PcbSmtPadCircle | PcbSmtPadRect

/**
 * @deprecated use PcbSmtPad
 */
export type PCBSMTPad = PcbSmtPad

expectTypesMatch<PcbSmtPadCircle, PCBSMTPadCircle>(true)
expectTypesMatch<PcbSmtPadRect, PCBSMTPadRect>(true)
