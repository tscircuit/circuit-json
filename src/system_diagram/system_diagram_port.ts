import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const system_diagram_port = z
  .object({
    type: z.literal("system_diagram_port"),
    system_diagram_port_id: getZodPrefixedIdWithDefault("system_diagram_port"),
    system_diagram_component_id: z.string().optional(),
    source_port_id: z.string().optional(),
    source_component_id: z.string().optional(),
    source_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    center: point,
    label: z.string().optional(),
    side: z.enum(["left", "right", "top", "bottom"]).optional(),
    direction: z.enum(["input", "output", "bidirectional"]).optional(),
  })
  .describe("Defines a connection point on a system diagram component")

export type SystemDiagramPortInput = z.input<typeof system_diagram_port>
type InferredSystemDiagramPort = z.infer<typeof system_diagram_port>

/**
 * Defines a connection point on a system diagram component.
 */
export interface SystemDiagramPort {
  type: "system_diagram_port"
  system_diagram_port_id: string
  system_diagram_component_id?: string
  source_port_id?: string
  source_component_id?: string
  source_group_id?: string
  subcircuit_id?: string
  center: Point
  label?: string
  side?: "left" | "right" | "top" | "bottom"
  direction?: "input" | "output" | "bidirectional"
}

expectTypesMatch<SystemDiagramPort, InferredSystemDiagramPort>(true)
