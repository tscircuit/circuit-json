import { type Asset, asset, type Point3, point3 } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const cad_fdm_enclosure = z
  .object({
    type: z.literal("cad_fdm_enclosure"),
    cad_fdm_enclosure_id: z.string(),
    source_fdm_enclosure_id: z.string(),
    name: z.string().optional(),
    position: point3,
    rotation: point3.optional(),
    size: point3.optional(),
    model_obj_url: z.string().optional(),
    model_stl_url: z.string().optional(),
    model_3mf_url: z.string().optional(),
    model_gltf_url: z.string().optional(),
    model_glb_url: z.string().optional(),
    model_step_url: z.string().optional(),
    model_wrl_url: z.string().optional(),
    model_asset: asset.optional(),
    model_unit_to_mm_scale_factor: z.number().optional(),
    model_jscad: z.any().optional(),
  })
  .describe("Defines generated CAD output for an FDM enclosure")

export type CadFdmEnclosureInput = z.input<typeof cad_fdm_enclosure>
type InferredCadFdmEnclosure = z.infer<typeof cad_fdm_enclosure>

/**
 * Defines generated CAD output for an FDM enclosure.
 */
export interface CadFdmEnclosure {
  type: "cad_fdm_enclosure"
  cad_fdm_enclosure_id: string
  source_fdm_enclosure_id: string
  name?: string
  position: Point3
  rotation?: Point3
  size?: Point3
  model_obj_url?: string
  model_stl_url?: string
  model_3mf_url?: string
  model_gltf_url?: string
  model_glb_url?: string
  model_step_url?: string
  model_wrl_url?: string
  model_asset?: Asset
  model_unit_to_mm_scale_factor?: number
  model_jscad?: any
}

expectTypesMatch<CadFdmEnclosure, InferredCadFdmEnclosure>(true)
