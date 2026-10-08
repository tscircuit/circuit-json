import { z } from "zod"
import { layer_ref, type LayerRef } from "../pcb/properties/layer_ref"
import { expectTypesMatch } from "../utils/expect-types-match"

const contact_position = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
  layer: layer_ref,
})

/** Reference conductor at a return-current terminal, in PCB millimeters. */
export const return_current_contact = z
  .discriminatedUnion("contact_type", [
    contact_position.extend({
      contact_type: z.literal("pcb_port"),
      pcb_port_id: z.string().min(1),
    }),
    contact_position.extend({
      contact_type: z.literal("pcb_via"),
      pcb_via_id: z.string().min(1),
    }),
    contact_position.extend({
      contact_type: z.literal("pcb_copper_pour"),
      pcb_copper_pour_id: z.string().min(1),
    }),
  ])
  .describe("Identifies the reference conductor at a return-current contact")

export interface ReturnCurrentContactBase {
  x: number
  y: number
  layer: LayerRef
}

export interface ReturnCurrentPortContact extends ReturnCurrentContactBase {
  contact_type: "pcb_port"
  pcb_port_id: string
}

export interface ReturnCurrentViaContact extends ReturnCurrentContactBase {
  contact_type: "pcb_via"
  pcb_via_id: string
}

export interface ReturnCurrentCopperPourContact
  extends ReturnCurrentContactBase {
  contact_type: "pcb_copper_pour"
  pcb_copper_pour_id: string
}

export type ReturnCurrentContact =
  | ReturnCurrentPortContact
  | ReturnCurrentViaContact
  | ReturnCurrentCopperPourContact

export type ReturnCurrentContactInput = z.input<typeof return_current_contact>
expectTypesMatch<ReturnCurrentContact, z.infer<typeof return_current_contact>>(
  true,
)
