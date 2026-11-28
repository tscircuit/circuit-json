import { z } from "zod"
import { distance, type Distance } from "src/units"
import { getZodPrefixedIdWithDefault } from "src/common"
import {
  layer_ref,
  type LayerRef,
  visible_layer,
} from "src/pcb/properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"

const ipc_4761_via_type = z.enum([
  "tented",
  "tented_and_covered",
  "plugged",
  "plugged_and_covered",
  "filled",
  "filled_and_covered",
  "filled_and_capped",
])

const hole_tolerance = distance.pipe(z.number().finite().nonnegative())

export const pcb_via = z
  .object({
    type: z.literal("pcb_via"),
    pcb_via_id: getZodPrefixedIdWithDefault("pcb_via"),
    pcb_group_id: z.string().optional(),
    pcb_panel_id: z.string().optional(),
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
    /** PCB ports belonging to this via, including layer ports and aliases. */
    pcb_port_ids: z.array(z.string()).optional(),
    pcb_trace_id: z.string().optional(),
    source_trace_id: z.string().optional(),
    source_net_id: z.string().min(1).optional(),
    net_is_assignable: z.boolean().optional(),
    net_assigned: z.boolean().optional(),
    /** @deprecated Use tented_on_top and tented_on_bottom instead. */
    is_tented: z.boolean().optional(),
    tented_on_top: z.boolean().optional(),
    tented_on_bottom: z.boolean().optional(),
    ipc_4761_via_type_top: ipc_4761_via_type.optional(),
    ipc_4761_via_type_bottom: ipc_4761_via_type.optional(),
    drill_method: z.enum(["mechanical", "laser"]).optional(),
    hole_diameter_tolerance: z
      .object({ plus: hole_tolerance, minus: hole_tolerance })
      .optional(),
    backdrill: z
      .object({
        from_side: visible_layer,
        must_not_cut_layer: layer_ref,
        max_stub_length: distance.optional(),
        hole_diameter: distance.optional(),
      })
      .optional(),
  })
  .superRefine((via, ctx) => {
    for (const side of ["top", "bottom"] as const) {
      const protectionField = `ipc_4761_via_type_${side}` as const
      const tentingField = `tented_on_${side}` as const
      if (via[protectionField] !== undefined && via[tentingField] === false) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [protectionField],
          message: `${protectionField} requires ${tentingField} to be true or omitted`,
        })
      }
    }
  })
  .transform(({ is_tented, ...via }) => {
    if (is_tented !== undefined) {
      if (is_tented || via.ipc_4761_via_type_top === undefined) {
        via.tented_on_top ??= is_tented
      }
      if (is_tented || via.ipc_4761_via_type_bottom === undefined) {
        via.tented_on_bottom ??= is_tented
      }
    }
    return via
  })
  .describe("Defines a via on the PCB")

export type PcbViaInput = z.input<typeof pcb_via>
type InferredPcbVia = z.infer<typeof pcb_via>

/** Via protection types I through VII, in order. */
export type Ipc4761ViaType =
  | "tented"
  | "tented_and_covered"
  | "plugged"
  | "plugged_and_covered"
  | "filled"
  | "filled_and_covered"
  | "filled_and_capped"

/**
 * Defines a via on the PCB
 */
export interface PcbVia {
  type: "pcb_via"
  pcb_via_id: string
  pcb_group_id?: string
  /** Owning manufacturing panel for copper connecting its child boards. */
  pcb_panel_id?: string
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
  /** PCB ports belonging to this via, including layer ports and aliases. */
  pcb_port_ids?: string[]
  pcb_trace_id?: string
  source_trace_id?: string
  source_net_id?: string
  net_is_assignable?: boolean
  net_assigned?: boolean
  tented_on_top?: boolean
  tented_on_bottom?: boolean
  /** Top-side IPC-4761 protection. Requires tented_on_top to be true or omitted. */
  ipc_4761_via_type_top?: Ipc4761ViaType
  /** Bottom-side IPC-4761 protection. Requires tented_on_bottom to be true or omitted. */
  ipc_4761_via_type_bottom?: Ipc4761ViaType
  /** Process used to form the primary via hole. */
  drill_method?: "mechanical" | "laser"
  /** Allowed deviations from the finished hole_diameter. */
  hole_diameter_tolerance?: {
    /** Nonnegative oversize allowance, in millimeters. */
    plus: Distance
    /** Nonnegative undersize allowance, in millimeters. */
    minus: Distance
  }
  /** Backdrill operation for removing unused barrel plating. */
  backdrill?: {
    /** Board surface where the backdrill starts. */
    from_side: "top" | "bottom"
    /** First layer that the backdrill must leave intact. */
    must_not_cut_layer: LayerRef
    /** Maximum length of the remaining via stub, in millimeters. */
    max_stub_length?: Distance
    /** Backdrill hole diameter, in millimeters. */
    hole_diameter?: Distance
  }
}

/**
 * @deprecated use PcbVia
 */
export type PCBVia = PcbVia

expectTypesMatch<PcbVia, InferredPcbVia>(true)
