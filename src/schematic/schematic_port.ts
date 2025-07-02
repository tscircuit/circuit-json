import { z } from "zod"
import { point, type Point } from "../common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export interface SchematicPort {
  type: "schematic_port"
  schematic_port_id: string
  source_port_id: string
  schematic_component_id?: string
  center: Point
  facing_direction?: "up" | "down" | "left" | "right"
  distance_from_component_edge?: number
  side_of_component?: "top" | "bottom" | "left" | "right"
  true_ccw_index?: number
  pin_number?: number
  display_pin_label?: string
  subcircuit_id?: string
  is_connected?: boolean
}

export const schematic_port = z
  .object({
    type: z.literal("schematic_port"),
    schematic_port_id: z.string(),
    source_port_id: z.string(),
    schematic_component_id: z.string().optional(),
    center: point,
    facing_direction: z.enum(["up", "down", "left", "right"]).optional(),
    distance_from_component_edge: z.number().optional(),
    side_of_component: z.enum(["top", "bottom", "left", "right"]).optional(),
    true_ccw_index: z.number().optional(),
    pin_number: z.number().optional(),
    display_pin_label: z.string().optional(),
    subcircuit_id: z.string().optional(),
    is_connected: z.boolean().optional(),
  })
  .describe("Defines a port on a schematic component")

export type SchematicPortInput = z.input<typeof schematic_port>
type InferredSchematicPort = z.infer<typeof schematic_port>

expectTypesMatch<SchematicPort, InferredSchematicPort>(true)
