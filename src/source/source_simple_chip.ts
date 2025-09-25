import {
  type SourceComponentBase,
  source_component_base,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_simple_chip = source_component_base.extend({
  ftype: z.literal("simple_chip"),
})

export type SourceSimpleChipInput = z.input<typeof source_simple_chip>
type InferredSourceSimpleChip = z.infer<typeof source_simple_chip>

/**
 * Defines a simple integrated circuit component
 */
export interface SourceSimpleChip extends SourceComponentBase {
  ftype: "simple_chip"
}

expectTypesMatch<SourceSimpleChip, InferredSourceSimpleChip>(true)
