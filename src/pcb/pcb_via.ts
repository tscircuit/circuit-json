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
    is_tented: z
      .boolean()
      .optional()
      .describe(
        "Default solder mask coverage for both outer PCB faces. Per-side is_tented_top and is_tented_bottom override it, including explicit false. Omitted leaves coverage unspecified. Tenting does not fill or plug the via.",
      ),
    is_tented_top: z
      .boolean()
      .optional()
      .describe(
        "Solder mask coverage on the top PCB face. Overrides is_tented for this face, including explicit false. Omitted falls back to is_tented; if both are omitted, coverage remains unspecified.",
      ),
    is_tented_bottom: z
      .boolean()
      .optional()
      .describe(
        "Solder mask coverage on the bottom PCB face. Overrides is_tented for this face, including explicit false. Omitted falls back to is_tented; if both are omitted, coverage remains unspecified.",
      ),
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
  /**
   * Default solder mask coverage for both outer PCB faces. Per-side fields
   * override it, including explicit false. Omitted leaves coverage unspecified.
   * Tenting does not fill or plug the via or change its plated drill geometry.
   */
  is_tented?: boolean
  /**
   * Top PCB face coverage. Overrides is_tented, including explicit false.
   * Omitted falls back to is_tented; if both are omitted, coverage is unspecified.
   */
  is_tented_top?: boolean
  /**
   * Bottom PCB face coverage. Overrides is_tented, including explicit false.
   * Omitted falls back to is_tented; if both are omitted, coverage is unspecified.
   */
  is_tented_bottom?: boolean
}

/**
 * @deprecated use PcbVia
 */
export type PCBVia = PcbVia

expectTypesMatch<PcbVia, InferredPcbVia>(true)
