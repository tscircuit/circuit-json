import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common/getZodPrefixedIdWithDefault"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_refdes_convention_warning = z
  .object({
    type: z.literal("source_refdes_convention_warning"),
    source_refdes_convention_warning_id: getZodPrefixedIdWithDefault(
      "source_refdes_convention_warning",
    ),
    warning_type: z
      .literal("source_refdes_convention_warning")
      .default("source_refdes_convention_warning"),
    message: z.string(),
    source_component_id: z.string(),
    refdes: z.string(),
    ftype: z.string(),
    expected_prefixes: z.array(z.string()),
    actual_prefix: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Warning emitted when a source component reference designator does not match the component type convention",
  )

export type SourceRefdesConventionWarningInput = z.input<
  typeof source_refdes_convention_warning
>
type InferredSourceRefdesConventionWarning = z.infer<
  typeof source_refdes_convention_warning
>

/**
 * Warning emitted when a source component reference designator does not match the component type convention
 */
export interface SourceRefdesConventionWarning {
  type: "source_refdes_convention_warning"
  source_refdes_convention_warning_id: string
  warning_type: "source_refdes_convention_warning"
  message: string
  source_component_id: string
  refdes: string
  ftype: string
  expected_prefixes: string[]
  actual_prefix?: string
  subcircuit_id?: string
}

expectTypesMatch<
  SourceRefdesConventionWarning,
  InferredSourceRefdesConventionWarning
>(true)
