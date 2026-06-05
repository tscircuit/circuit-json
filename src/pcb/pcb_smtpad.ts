import { z } from "zod"
import { distance, type Distance, rotation, type Rotation } from "src/units"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

const pcb_smtpad_circle = z.object({
  type: z.literal("pcb_smtpad"),
  shape: z.literal("circle"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: distance,
  y: distance,
  radius: z.number(),
  layer: layer_ref,
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  is_covered_with_solder_mask: z.boolean().optional(),
  soldermask_margin: z.number().optional(),
})

const pcb_smtpad_rect = z.object({
  type: z.literal("pcb_smtpad"),
  shape: z.literal("rect"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: distance,
  y: distance,
  width: z.number(),
  height: z.number(),
  rect_border_radius: z.number().optional(),
  corner_radius: z.number().optional(),
  layer: layer_ref,
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  is_covered_with_solder_mask: z.boolean().optional(),
  soldermask_margin: z.number().optional(),
  soldermask_margin_left: z.number().optional(),
  soldermask_margin_top: z.number().optional(),
  soldermask_margin_right: z.number().optional(),
  soldermask_margin_bottom: z.number().optional(),
})

const pcb_smtpad_rotated_rect = z.object({
  type: z.literal("pcb_smtpad"),
  shape: z.literal("rotated_rect"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: distance,
  y: distance,
  width: z.number(),
  height: z.number(),
  rect_border_radius: z.number().optional(),
  corner_radius: z.number().optional(),
  ccw_rotation: rotation,
  layer: layer_ref,
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  is_covered_with_solder_mask: z.boolean().optional(),
  soldermask_margin: z.number().optional(),
  soldermask_margin_left: z.number().optional(),
  soldermask_margin_top: z.number().optional(),
  soldermask_margin_right: z.number().optional(),
  soldermask_margin_bottom: z.number().optional(),
})

export const pcb_smtpad_pill = z.object({
  type: z.literal("pcb_smtpad"),
  shape: z.literal("pill"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: distance,
  y: distance,
  width: z.number(),
  height: z.number(),
  radius: z.number(),
  layer: layer_ref,
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  is_covered_with_solder_mask: z.boolean().optional(),
  soldermask_margin: z.number().optional(),
})
const pcb_smtpad_rotated_pill = z.object({
  type: z.literal("pcb_smtpad"),
  shape: z.literal("rotated_pill"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: distance,
  y: distance,
  width: z.number(),
  height: z.number(),
  radius: z.number(),
  ccw_rotation: rotation,
  layer: layer_ref,
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  is_covered_with_solder_mask: z.boolean().optional(),
  soldermask_margin: z.number().optional(),
})

const pcb_smtpad_polygon = z.object({
  type: z.literal("pcb_smtpad"),
  shape: z.literal("polygon"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  points: z.array(point),
  layer: layer_ref,
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  is_covered_with_solder_mask: z.boolean().optional(),
  soldermask_margin: z.number().optional(),
})

export const pcb_smtpad = z.union([
  pcb_smtpad_circle,
  pcb_smtpad_rect,
  pcb_smtpad_rotated_rect,
  pcb_smtpad_pill,
  pcb_smtpad_rotated_pill,
  pcb_smtpad_polygon,
])

export type PCBSMTPad = z.infer<typeof pcb_smtpad>

expectTypesMatch<PCBSMTPad, PCBSMTPad>(true)
