import { z } from "zod"
import { distance, type Distance } from "src/units"
import { getZodPrefixedIdWithDefault } from "src/common"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_via = z
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
    topmost_drill_layer: layer_ref.optional(),
    bottommost_drill_layer: layer_ref.optional(),
    through_hole: z.boolean().optional(),
    /** @deprecated */
    from_layer: layer_ref.optional(),
    /** @deprecated */
    to_layer: layer_ref.optional(),
    layers: z.array(layer_ref),
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
  topmost_drill_layer?: LayerRef
  bottommost_drill_layer?: LayerRef
  through_hole?: boolean
  /** @deprecated */
  from_layer?: LayerRef
  /** @deprecated */
  to_layer?: LayerRef
  layers: LayerRef[]
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
