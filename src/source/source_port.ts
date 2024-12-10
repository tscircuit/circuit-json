import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_port = z.object({
  type: z.literal("source_port"),
  pin_number: z.number().optional(),
  port_hints: z.array(z.string()).optional(),
  name: z.string(),
  source_port_id: z.string(),
  source_component_id: z.string(),
})

export type SourcePortInput = z.input<typeof source_port>
type InferredSourcePort = z.infer<typeof source_port>

/**
 * Defines a source port that can be connected to other components
 */
export interface SourcePort {
  type: "source_port"
  pin_number?: number
  port_hints?: string[]
  name: string
  source_port_id: string
  source_component_id: string
}

expectTypesMatch<SourcePort, InferredSourcePort>(true)
