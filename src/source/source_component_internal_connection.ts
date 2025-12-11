import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export interface SourceComponentInternalConnection {
  type: "source_component_internal_connection"
  source_component_internal_connection_id: string
  source_component_id: string
  source_port_ids: string[]
  subcircuit_id?: string
}

export const source_component_internal_connection = z.object({
  type: z.literal("source_component_internal_connection"),
  source_component_internal_connection_id: z.string(),
  source_component_id: z.string(),
  source_port_ids: z.array(z.string()),
  subcircuit_id: z.string().optional(),
})

type InferredSourceComponentInternalConnection = z.infer<
  typeof source_component_internal_connection
>

expectTypesMatch<
  SourceComponentInternalConnection,
  InferredSourceComponentInternalConnection
>(true)
