import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const external_footprint_load_error = z
  .object({
    type: z.literal("external_footprint_load_error"),
    external_footprint_load_error_id: getZodPrefixedIdWithDefault(
      "external_footprint_load_error",
    ),
    pcb_component_id: z.string(),
    source_component_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    footprinter_string: z.string().optional(),
    error_type: z
      .literal("external_footprint_load_error")
      .default("external_footprint_load_error"),
    message: z.string(),
  })
  .describe("Defines an error when an external footprint fails to load")

export type ExternalFootprintLoadErrorInput = z.input<
  typeof external_footprint_load_error
>
type InferredExternalFootprintLoadError = z.infer<
  typeof external_footprint_load_error
>

export interface ExternalFootprintLoadError {
  type: "external_footprint_load_error"
  external_footprint_load_error_id: string
  pcb_component_id: string
  source_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  footprinter_string?: string
  error_type: "external_footprint_load_error"
  message: string
}

expectTypesMatch<
  ExternalFootprintLoadError,
  InferredExternalFootprintLoadError
>(true)
