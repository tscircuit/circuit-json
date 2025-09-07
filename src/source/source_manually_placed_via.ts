import { z } from "zod"
import { distance, type Distance } from "src/units"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_manually_placed_via = z
  .object({
    type: z.literal("source_manually_placed_via"),
    source_manually_placed_via_id: z.string(),
    source_group_id: z.string(),
    source_net_id: z.string(),
    layers: z.array(layer_ref),
    subcircuit_id: z.string().optional(),
    source_trace_id: z.string().optional(),
  })
  .describe("Defines a via that is manually placed in the source domain")

export type SourceManuallyPlacedViaInput = z.input<
  typeof source_manually_placed_via
>
type InferredSourceManuallyPlacedVia = z.infer<
  typeof source_manually_placed_via
>

/**
 * Defines a via that is manually placed in the source domain
 */
export interface SourceManuallyPlacedVia {
  type: "source_manually_placed_via"
  source_manually_placed_via_id: string
  source_group_id: string
  source_net_id: string
  layers: LayerRef[]
  subcircuit_id?: string
  source_trace_id?: string
}

expectTypesMatch<SourceManuallyPlacedVia, InferredSourceManuallyPlacedVia>(true)
