import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_diode = source_component_base.extend({
  ftype: z.literal("simple_diode"),
  color: z.string().optional(),
  wavelength: z.string().optional(),
})

export type SourceSimpleDiodeInput = z.input<typeof source_simple_diode>
type InferredSourceSimpleDiode = z.infer<typeof source_simple_diode>

/**
 * Defines a simple diode component
 */
export interface SourceSimpleDiode extends SourceComponentBase {
  ftype: "simple_diode"
  color?: string
  wavelength?: string
}

expectTypesMatch<SourceSimpleDiode, InferredSourceSimpleDiode>(true)
