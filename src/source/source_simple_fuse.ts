import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "./base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_fuse = source_component_base.extend({
  ftype: z.literal("simple_fuse"),
  current_rating: z.union([z.number(), z.string()]),
  voltage_rating: z.union([z.number(), z.string()]).optional(),
})

export interface SourceSimpleFuse extends SourceComponentBase {
  ftype: "simple_fuse"
  current_rating: number | string
  voltage_rating?: number | string
}

export type SourceSimpleFuseInput = z.input<typeof source_simple_fuse>
type InferredSourceSimpleFuse = z.infer<typeof source_simple_fuse>

expectTypesMatch<SourceSimpleFuse, InferredSourceSimpleFuse>(true)
