import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_failed_to_create_component_error = z
  .object({
    type: z.literal("source_failed_to_create_component_error"),
    source_failed_to_create_component_error_id: getZodPrefixedIdWithDefault(
      "source_failed_to_create_component_error",
    ),
    component_name: z.string().optional(),
    subcircuit_id: z.string().optional(),
    parent_source_component_id: z.string().optional(),
    source_component_id: z.string(),
    message: z.string(),
    pcb_center: z
      .object({
        x: z.number().optional(),
        y: z.number().optional(),
      })
      .optional(),
    schematic_center: z
      .object({
        x: z.number().optional(),
        y: z.number().optional(),
      })
      .optional(),
  })
  .describe("Error emitted when a component fails to be constructed")

export type SourceFailedToCreateComponentErrorInput = z.input<
  typeof source_failed_to_create_component_error
>
type InferredSourceFailedToCreateComponentError = z.infer<
  typeof source_failed_to_create_component_error
>

/**
 * Error emitted when a component fails to be constructed.
 * Contains details about the failure and prevents the component from being rendered.
 */
export interface SourceFailedToCreateComponentError {
  type: "source_failed_to_create_component_error"
  source_failed_to_create_component_error_id: string
  source_component_id: string
  message: string
  component_name?: string
  subcircuit_id?: string
  parent_source_component_id?: string
  pcb_center?: {
    x?: number
    y?: number
  }
  schematic_center?: {
    x?: number
    y?: number
  }
}

expectTypesMatch<
  SourceFailedToCreateComponentError,
  InferredSourceFailedToCreateComponentError
>(true)
