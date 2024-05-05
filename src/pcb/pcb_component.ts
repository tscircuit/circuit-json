import { z } from "zod"
import { point } from "../common"
import { layer_ref } from "./properties/layer_ref"
import { rotation, length } from "../units"

export const pcb_component = z
  .object({
    type: z.literal("pcb_component"),
    pcb_component_id: z.string(),
    source_component_id: z.string(),
    center: point,
    layer: layer_ref,
    rotation: rotation,
    width: length,
    height: length,
  })
  .describe("Defines a component on the PCB")

export type PCBComponentInput = z.input<typeof pcb_component>
export type PCBComponent = z.infer<typeof pcb_component>
