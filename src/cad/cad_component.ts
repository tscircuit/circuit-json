import { z } from "zod"
import { point3 } from "../common"
import { rotation, length } from "../units"
import { layer_ref } from "src/pcb"

export const cad_component = z
  .object({
    type: z.literal("cad_component"),
       cad_component_id: z.string(),
       pcb_component_id: z.string(),
    source_component_id: z.string(),
    position: point3,
    rotation: point3.optional(),
    size: point3.optional(),
    layer: layer_ref.optional(),

    // These are all ways to generate/load the 3d model
    footprinter_string: z.string().optional(),
    model_obj_url: z.string().optional(),
    model_stl_url: z.string().optional(),
    model_3mf_url: z.string().optional(),
    model_jscad: z.any().optional(),
  })
  .describe("Defines a component on the PCB")

export type CadComponentInput = z.input<typeof cad_component>
export type CadComponent = z.infer<typeof cad_component>
