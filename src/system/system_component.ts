import { z } from "zod"
import {
  getZodPrefixedIdWithDefault,
  point,
  size,
  type Point,
  type Size,
} from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const system_component = z
  .object({
    type: z.literal("system_component"),
    system_component_id: getZodPrefixedIdWithDefault("system_component"),
    system_diagram_id: z.string().optional(),
    schematic_component_ids: z.array(z.string()).optional(),
    center: point,
    size,
    label: z.string().optional(),
    description: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a component block in a system diagram")

/**
 * Defines a component block in a system diagram
 */
export interface SystemComponent {
  type: "system_component"
  system_component_id: string
  system_diagram_id?: string
  schematic_component_ids?: string[]
  center: Point
  size: Size
  label?: string
  description?: string
  subcircuit_id?: string
}

export type SystemComponentInput = z.input<typeof system_component>
type InferredSystemComponent = z.infer<typeof system_component>

expectTypesMatch<SystemComponent, InferredSystemComponent>(true)
