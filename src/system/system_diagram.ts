import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const system_diagram = z
  .object({
    type: z.literal("system_diagram"),
    system_diagram_id: getZodPrefixedIdWithDefault("system_diagram"),
    name: z.string().optional(),
    description: z.string().optional(),
    width: length.optional(),
    height: length.optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a system block diagram")

/**
 * Defines a system block diagram
 */
export interface SystemDiagram {
  type: "system_diagram"
  system_diagram_id: string
  name?: string
  description?: string
  width?: Length
  height?: Length
  subcircuit_id?: string
}

export type SystemDiagramInput = z.input<typeof system_diagram>
type InferredSystemDiagram = z.infer<typeof system_diagram>

expectTypesMatch<SystemDiagram, InferredSystemDiagram>(true)
