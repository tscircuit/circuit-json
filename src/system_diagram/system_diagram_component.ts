import { z } from "zod"
import {
  getZodPrefixedIdWithDefault,
  point,
  type Point,
  size,
  type Size,
} from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const system_diagram_component = z
  .object({
    type: z.literal("system_diagram_component"),
    system_diagram_component_id: getZodPrefixedIdWithDefault(
      "system_diagram_component",
    ),
    source_component_id: z.string().optional(),
    source_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    center: point,
    size,
    label: z.string().optional(),
    description: z.string().optional(),
    port_ids: z.array(z.string()).optional(),
    color: z.string().optional(),
  })
  .describe("Defines a component or subsystem in a system diagram")

export type SystemDiagramComponentInput = z.input<
  typeof system_diagram_component
>
type InferredSystemDiagramComponent = z.infer<typeof system_diagram_component>

/**
 * Defines a component or subsystem in a system diagram.
 */
export interface SystemDiagramComponent {
  type: "system_diagram_component"
  system_diagram_component_id: string
  source_component_id?: string
  source_group_id?: string
  subcircuit_id?: string
  center: Point
  size: Size
  label?: string
  description?: string
  port_ids?: string[]
  color?: string
}

expectTypesMatch<SystemDiagramComponent, InferredSystemDiagramComponent>(true)
