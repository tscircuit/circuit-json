import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const json_footprint_load_error = z
  .object({
    type: z.literal("json_footprint_load_error"),
    json_footprint_load_error_id: getZodPrefixedIdWithDefault(
      "json_footprint_load_error",
    ),
    pcb_component_id: z.string(),
    source_component_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    error_type: z
      .literal("json_footprint_load_error")
      .default("json_footprint_load_error"),
    message: z.string(),
    circuit_json: z.string().optional(),
  })
  .describe("Defines an error when a JSON footprint fails to load")

export type JsonFootprintLoadErrorInput = z.input<
  typeof json_footprint_load_error
>
type InferredJsonFootprintLoadError = z.infer<typeof json_footprint_load_error>

export interface JsonFootprintLoadError {
  type: "json_footprint_load_error"
  json_footprint_load_error_id: string
  pcb_component_id: string
  source_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  error_type: "json_footprint_load_error"
  message: string
  circuit_json?: string
}

expectTypesMatch<JsonFootprintLoadError, InferredJsonFootprintLoadError>(true)
