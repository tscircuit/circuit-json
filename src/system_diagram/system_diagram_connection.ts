import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const system_diagram_connection = z
  .object({
    type: z.literal("system_diagram_connection"),
    system_diagram_connection_id: getZodPrefixedIdWithDefault(
      "system_diagram_connection",
    ),
    source_trace_id: z.string().optional(),
    from_system_diagram_port_id: z.string().optional(),
    to_system_diagram_port_id: z.string().optional(),
    from_system_diagram_component_id: z.string().optional(),
    to_system_diagram_component_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    points: z.array(point).optional(),
    label: z.string().optional(),
    description: z.string().optional(),
    is_bidirectional: z.boolean().optional(),
  })
  .describe("Defines a connection between system diagram ports or components")

export type SystemDiagramConnectionInput = z.input<
  typeof system_diagram_connection
>
type InferredSystemDiagramConnection = z.infer<typeof system_diagram_connection>

/**
 * Defines a connection between system diagram ports or components.
 */
export interface SystemDiagramConnection {
  type: "system_diagram_connection"
  system_diagram_connection_id: string
  source_trace_id?: string
  from_system_diagram_port_id?: string
  to_system_diagram_port_id?: string
  from_system_diagram_component_id?: string
  to_system_diagram_component_id?: string
  subcircuit_id?: string
  points?: Point[]
  label?: string
  description?: string
  is_bidirectional?: boolean
}

expectTypesMatch<SystemDiagramConnection, InferredSystemDiagramConnection>(true)
