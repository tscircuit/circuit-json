import { z } from "zod"
import { layer_string, type LayerRef } from "./layer_ref"

/** A copper selector. Net IDs refer to source_net records, not display names. */
export type PcbClearanceScope =
  | { type: "all" }
  | { type: "net"; net_ids: string[] }
  | { type: "layer"; layers: LayerRef[] }
  | { type: "kind"; kinds: PcbClearanceCopperKind[] }
  | { type: "component"; component_names: string[] }
  | {
      type: "property"
      property: "has_net" | "is_keepout" | "in_polygon" | "is_free"
    }
  | { type: "and" | "or"; scopes: PcbClearanceScope[] }
  | { type: "not"; scope: PcbClearanceScope }
  | { type: "unsupported"; expression: string }

export type PcbClearanceCopperKind = "trace" | "pad" | "via" | "copper_pour"

export const pcb_clearance_scope: z.ZodType<PcbClearanceScope> = z.lazy(() =>
  z.discriminatedUnion("type", [
    z.object({ type: z.literal("all") }),
    z.object({ type: z.literal("net"), net_ids: z.array(z.string()) }),
    z.object({
      type: z.literal("layer"),
      layers: z.array(layer_string).min(1),
    }),
    z.object({
      type: z.literal("kind"),
      kinds: z.array(z.enum(["trace", "pad", "via", "copper_pour"])).min(1),
    }),
    z.object({
      type: z.literal("component"),
      component_names: z.array(z.string()),
    }),
    z.object({
      type: z.literal("property"),
      property: z.enum(["has_net", "is_keepout", "in_polygon", "is_free"]),
    }),
    z.object({
      type: z.literal("and"),
      scopes: z.array(pcb_clearance_scope).min(1),
    }),
    z.object({
      type: z.literal("or"),
      scopes: z.array(pcb_clearance_scope).min(1),
    }),
    z.object({ type: z.literal("not"), scope: pcb_clearance_scope }),
    z.object({ type: z.literal("unsupported"), expression: z.string().min(1) }),
  ]),
)

/**
 * Edge-to-edge copper spacing in board/world millimeters. The first matching
 * enabled rule in ascending numeric priority wins. Match scope1/scope2 in
 * either orientation; do not take the maximum of all matching rules.
 * Evaluate layer selectors on the common copper layer being checked.
 * An unsupported expression must never be interpreted as false or ignored.
 */
export const pcb_clearance_rule = z.object({
  name: z.string().min(1),
  priority: z.number().int().positive(),
  enabled: z.boolean(),
  clearance: z.number().finite().nonnegative(),
  scope1: pcb_clearance_scope,
  scope2: pcb_clearance_scope,
  source_scope1: z.string().optional(),
  source_scope2: z.string().optional(),
})

export type PcbClearanceRule = z.infer<typeof pcb_clearance_rule>
