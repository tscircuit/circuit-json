import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const system_port = z
  .object({
    type: z.literal("system_port"),
    system_port_id: getZodPrefixedIdWithDefault("system_port"),
    system_component_id: z.string(),
    system_diagram_id: z.string().optional(),
    center: point,
    label: z.string().optional(),
    side_of_component: z.enum(["top", "bottom", "left", "right"]).optional(),
    facing_direction: z.enum(["up", "down", "left", "right"]).optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a port on a system diagram component")

/**
 * Defines a port on a system diagram component
 */
export interface SystemPort {
  type: "system_port"
  system_port_id: string
  system_component_id: string
  system_diagram_id?: string
  center: Point
  label?: string
  side_of_component?: "top" | "bottom" | "left" | "right"
  facing_direction?: "up" | "down" | "left" | "right"
  subcircuit_id?: string
}

export type SystemPortInput = z.input<typeof system_port>
type InferredSystemPort = z.infer<typeof system_port>

expectTypesMatch<SystemPort, InferredSystemPort>(true)
