import { z } from "zod"
import { ninePointAnchor, point3, type Point3 } from "../common"
import { rotation, length, type Rotation, type Length } from "../units"
import { layer_ref, type LayerRef } from "src/pcb"
import { expectTypesMatch } from "src/utils/expect-types-match"

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
    subcircuit_id: z.string().optional(),

    // These are all ways to generate/load the 3d model
    footprinter_string: z.string().optional(),
    model_obj_url: z.string().optional(),
    model_stl_url: z.string().optional(),
    model_3mf_url: z.string().optional(),
    model_gltf_url: z.string().optional(),
    model_glb_url: z.string().optional(),
    model_step_url: z.string().optional(),
    model_wrl_url: z.string().optional(),
    model_unit_to_mm_scale_factor: z.number().optional(),
    model_jscad: z.any().optional(),
    show_as_translucent_model: z.boolean().optional(),
    anchor_alignment: z
      .enum([...ninePointAnchor.options, "xy_center_z_board"] as const)
      .optional()
      .default("center"),
  })
  .describe("Defines a component on the PCB")

export type CadComponentInput = z.input<typeof cad_component>
type InferredCadComponent = z.infer<typeof cad_component>

export type CadComponentAnchorAlignment = NonNullable<
  InferredCadComponent["anchor_alignment"]
>

export interface CadComponent {
  type: "cad_component"
  cad_component_id: string
  pcb_component_id: string
  source_component_id: string
  position: Point3
  rotation?: Point3
  size?: Point3
  layer?: LayerRef
  subcircuit_id?: string
  footprinter_string?: string
  model_obj_url?: string
  model_stl_url?: string
  model_3mf_url?: string
  model_gltf_url?: string
  model_glb_url?: string
  model_step_url?: string
  model_wrl_url?: string
  model_unit_to_mm_scale_factor?: number
  model_jscad?: any
  show_as_translucent_model?: boolean
  anchor_alignment: CadComponentAnchorAlignment
}

expectTypesMatch<CadComponent, InferredCadComponent>(true)
