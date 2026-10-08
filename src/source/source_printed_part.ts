import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_printed_part = source_component_base.extend({
  ftype: z.literal("printedpart"),
  material: z.enum(["pla", "petg", "nylon"]).optional(),
  color: z.string().trim().min(1).optional(),
})

export type SourcePrintedPartInput = z.input<typeof source_printed_part>
type InferredSourcePrintedPart = z.infer<typeof source_printed_part>

/** Defines a 3D-printed part in an assembly. */
export interface SourcePrintedPart extends SourceComponentBase {
  ftype: "printedpart"
  /** Printable material, when specified by the author. */
  material?: "pla" | "petg" | "nylon"
  /** Author-specified print color; also carried on the CAD geometry. */
  color?: string
}

expectTypesMatch<SourcePrintedPart, InferredSourcePrintedPart>(true)
