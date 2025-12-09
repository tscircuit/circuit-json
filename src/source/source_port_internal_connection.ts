import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export interface SourcePortInternalConnection {
  type: "source_port_internal_connection"
  source_port_internal_connection_id: string
  source_port_ids: string[]
}

export const source_port_internal_connection = z.object({
  type: z.literal("source_port_internal_connection"),
  source_port_internal_connection_id: z.string(),
  source_port_ids: z.array(z.string()),
})

type InferredSourcePortInternalConnection = z.infer<
  typeof source_port_internal_connection
>

expectTypesMatch<
  SourcePortInternalConnection,
  InferredSourcePortInternalConnection
>(true)
