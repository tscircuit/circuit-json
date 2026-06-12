import { z } from "zod"
import { getZodPrefixedIdWithDefault, point } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const system_connection = z
  .object({
    type: z.literal("system_connection"),
    system_connection_id: getZodPrefixedIdWithDefault("system_connection"),
    system_diagram_id: z.string().optional(),
    source_system_port_id: z.string().optional(),
    target_system_port_id: z.string().optional(),
    system_port_ids: z.array(z.string()).optional(),
    path: z.array(point),
    label: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a connection between ports in a system diagram")

/**
 * Defines a connection between ports in a system diagram
 */
export interface SystemConnection {
  type: "system_connection"
  system_connection_id: string
  system_diagram_id?: string
  source_system_port_id?: string
  target_system_port_id?: string
  system_port_ids?: string[]
  path: SystemPathPoint[]
  label?: string
  subcircuit_id?: string
}

export interface SystemPathPoint {
  x: number
  y: number
}

export type SystemConnectionInput = z.input<typeof system_connection>
type InferredSystemConnection = z.infer<typeof system_connection>

expectTypesMatch<SystemConnection, InferredSystemConnection>(true)
