import { z } from "zod"
import { distance } from "../units"
import { layer_ref } from "./properties/layer_ref"

export const pcb_via = z
  .object({
    type: z.literal("pcb_via"),
    x: distance,
    y: distance,
    outer_diameter: distance.default("0.6mm"),
    hole_diameter: distance.default("0.25mm"),
    /** @deprecated */
    from_layer: layer_ref.optional(),
    /** @deprecated */
    to_layer: layer_ref.optional(),
    layers: z.array(layer_ref),
  })
  .describe("Defines a via on the PCB")

export type PCBViaInput = z.input<typeof pcb_via>
export type PCBVia = z.infer<typeof pcb_via>
