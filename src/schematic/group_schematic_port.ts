import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/**
 * Defines a port on a schematic group boundary, for connecting subcircuits.
 */
export interface GroupSchematicPort {
  type: "group_schematic_port"
  group_schematic_port_id: string
  source_port_id: string
  schematic_group_id: string
  center: Point
  facing_direction?: "up" | "down" | "left" | "right"
  distance_from_component_edge?: number
  side_of_component?: "top" | "bottom" | "left" | "right"
  true_ccw_index?: number
  pin_number?: number
  display_pin_label?: string
  subcircuit_id?: string
  is_connected?: boolean
  has_input_arrow?: boolean
  has_output_arrow?: boolean
}

export const group_schematic_port = z
  .object({
    type: z.literal("group_schematic_port"),
    group_schematic_port_id: getZodPrefixedIdWithDefault(
      "group_schematic_port",
    ),
    source_port_id: z.string(),
    schematic_group_id: z.string(),
    center: point,
    facing_direction: z.enum(["up", "down", "left", "right"]).optional(),
    distance_from_component_edge: z.number().optional(),
    side_of_component: z.enum(["top", "bottom", "left", "right"]).optional(),
    true_ccw_index: z.number().optional(),
    pin_number: z.number().optional(),
    display_pin_label: z.string().optional(),
    subcircuit_id: z.string().optional(),
    is_connected: z.boolean().optional(),
    has_input_arrow: z.boolean().optional(),
    has_output_arrow: z.boolean().optional(),
  })
  .describe(
    "Defines a port on a schematic group boundary, for connecting subcircuits.",
  )

export type GroupSchematicPortInput = z.input<typeof group_schematic_port>
type InferredGroupSchematicPort = z.infer<typeof group_schematic_port>

expectTypesMatch<GroupSchematicPort, InferredGroupSchematicPort>(true)
