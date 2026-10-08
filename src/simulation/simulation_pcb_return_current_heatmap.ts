import { z } from "zod"
import { getZodPrefixedIdWithDefault, type Asset } from "../common"
import { layer_ref, type LayerRef } from "../pcb/properties/layer_ref"
import { expectTypesMatch } from "../utils/expect-types-match"
import { simulation_return_current_image_asset } from "./simulation_return_current_asset"

export const simulation_pcb_return_current_heatmap = z
  .object({
    type: z.literal("simulation_pcb_return_current_heatmap"),
    simulation_pcb_return_current_heatmap_id: getZodPrefixedIdWithDefault(
      "simulation_pcb_return_current_heatmap",
    ),
    simulation_pcb_return_current_result_id: z.string().min(1),
    layer: layer_ref,
    source_net_id: z.string().min(1),
    min_x: z.number().finite(),
    min_y: z.number().finite(),
    max_x: z.number().finite(),
    max_y: z.number().finite(),
    image_asset: simulation_return_current_image_asset,
  })
  .superRefine((heatmap, context) => {
    for (const axis of ["x", "y"] as const) {
      if (heatmap[`max_${axis}`] <= heatmap[`min_${axis}`]) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: [`max_${axis}`],
          message: "Heatmap bounds must have positive width and height",
        })
      }
    }
  })
  .describe(
    "A transparent PNG/WebP current-density overlay in A/mm²; the top-left pixel maps to (min_x, max_y)",
  )

export interface SimulationPcbReturnCurrentHeatmap {
  type: "simulation_pcb_return_current_heatmap"
  simulation_pcb_return_current_heatmap_id: string
  simulation_pcb_return_current_result_id: string
  layer: LayerRef
  source_net_id: string
  min_x: number
  min_y: number
  max_x: number
  max_y: number
  image_asset: Asset
}

export type SimulationPcbReturnCurrentHeatmapInput = z.input<
  typeof simulation_pcb_return_current_heatmap
>
expectTypesMatch<
  SimulationPcbReturnCurrentHeatmap,
  z.infer<typeof simulation_pcb_return_current_heatmap>
>(true)
