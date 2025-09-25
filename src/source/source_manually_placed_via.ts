import { type LayerRef, layer_ref } from "src/pcb/properties/layer_ref"
import { type Distance, distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_manually_placed_via = z
  .object({
    type: z.literal("source_manually_placed_via"),
    source_manually_placed_via_id: z.string(),
    source_group_id: z.string(),
    source_net_id: z.string(),
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
  subcircuit_id?: string
  source_trace_id?: string
}

expectTypesMatch<SourceManuallyPlacedVia, InferredSourceManuallyPlacedVia>(true)
