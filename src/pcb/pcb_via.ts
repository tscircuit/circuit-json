import { z } from "zod"
import { distance, type Distance } from "src/units"
import { getZodPrefixedIdWithDefault } from "src/common"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { getPcbViaSpanFromLayers } from "src/utils/pcb-via-span"
import { expectTypesMatch } from "src/utils/expect-types-match"

const pcb_via_with_span = z
  .object({
    type: z.literal("pcb_via"),
    pcb_via_id: getZodPrefixedIdWithDefault("pcb_via"),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    subcircuit_connectivity_map_key: z.string().optional(),
    x: distance,
    y: distance,
    outer_diameter: distance.default("0.6mm"),
    hole_diameter: distance.default("0.25mm"),
    /** First copper layer of the physical via span. */
    from_layer: layer_ref,
    /** Last copper layer of the physical via span (inclusive). */
    to_layer: layer_ref,
    pcb_trace_id: z.string().optional(),
    source_trace_id: z.string().optional(),
    source_net_id: z.string().min(1).optional(),
    net_is_assignable: z.boolean().optional(),
    net_assigned: z.boolean().optional(),
    /** @deprecated Use tented_on_top and tented_on_bottom instead. */
    is_tented: z.boolean().optional(),
    tented_on_top: z.boolean().optional(),
    tented_on_bottom: z.boolean().optional(),
  })
  .transform(({ is_tented, ...via }) => {
    if (is_tented !== undefined) {
      via.tented_on_top ??= is_tented
      via.tented_on_bottom ??= is_tented
    }
    return via
  })
  .describe("Defines a via on the PCB")

/** Accept legacy physical layers on input, but emit only span endpoints. */
export const pcb_via = pcb_via_with_span
  .extend({
    from_layer: layer_ref.optional(),
    to_layer: layer_ref.optional(),
    layers: z
      .array(layer_ref)
      .refine(
        (layers) => new Set(layers).size >= 2,
        "A via span requires at least two distinct copper layers",
      )
      .optional(),
  })
  .transform(({ layers, ...via }) => {
    if (layers === undefined) return via
    // No board context is available here. The complete supported stack orders
    // endpoints without adding intermediate layers. Legacy physical layers take
    // precedence over deprecated endpoints, which may be logical transitions.
    return { ...via, ...getPcbViaSpanFromLayers(layers, 10) }
  })
  .pipe(pcb_via_with_span)
  .describe("Defines a via on the PCB with an inclusive physical layer span")

export type PcbViaInput = z.input<typeof pcb_via>
type InferredPcbVia = z.infer<typeof pcb_via>

/**
 * Defines a via on the PCB
 */
export interface PcbVia {
  type: "pcb_via"
  pcb_via_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  subcircuit_connectivity_map_key?: string
  x: Distance
  y: Distance
  outer_diameter: Distance
  hole_diameter: Distance
  /** First copper layer of the physical via span. */
  from_layer: LayerRef
  /** Last copper layer of the physical via span (inclusive). */
  to_layer: LayerRef
  pcb_trace_id?: string
  source_trace_id?: string
  source_net_id?: string
  net_is_assignable?: boolean
  net_assigned?: boolean
  tented_on_top?: boolean
  tented_on_bottom?: boolean
}

/**
 * @deprecated use PcbVia
 */
export type PCBVia = PcbVia

expectTypesMatch<PcbVia, InferredPcbVia>(true)
