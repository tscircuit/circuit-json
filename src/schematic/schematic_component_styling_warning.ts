import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const schematic_component_styling_warning = z
  .object({
    type: z.literal("schematic_component_styling_warning"),
    schematic_component_styling_warning_id: getZodPrefixedIdWithDefault(
      "schematic_component_styling_warning",
    ),
    warning_type: z
      .literal("schematic_component_styling_warning")
      .default("schematic_component_styling_warning"),
    message: z.string(),
    schematic_component_id: z.string(),
    styling_issue_type: z.string(),
    schematic_port_ids: z.array(z.string()).optional(),
    source_component_id: z.string().optional(),
    schematic_sheet_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Warning emitted when a schematic component has a visual styling issue",
  )

export type SchematicComponentStylingWarningInput = z.input<
  typeof schematic_component_styling_warning
>
type InferredSchematicComponentStylingWarning = z.infer<
  typeof schematic_component_styling_warning
>

/** Warning emitted when a schematic component has a visual styling issue */
export interface SchematicComponentStylingWarning {
  type: "schematic_component_styling_warning"
  schematic_component_styling_warning_id: string
  warning_type: "schematic_component_styling_warning"
  message: string
  schematic_component_id: string
  styling_issue_type: string
  schematic_port_ids?: string[]
  source_component_id?: string
  schematic_sheet_id?: string
  subcircuit_id?: string
}

expectTypesMatch<
  SchematicComponentStylingWarning,
  InferredSchematicComponentStylingWarning
>(true)
