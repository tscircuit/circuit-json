import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import {
  type SourceComponentBase,
  source_component_base,
} from "./base/source_component_base"

export const source_simple_fuse = source_component_base.extend({
  ftype: z.literal("simple_fuse"),

  current_rating_amps: z
    .number()
    .describe("Nominal current in amps the fuse is rated for"),

  voltage_rating_volts: z
    .number()
    .describe("Voltage rating in volts, e.g. ±5V would be 5"),
})

export interface SourceSimpleFuse extends SourceComponentBase {
  ftype: "simple_fuse"
  current_rating_amps: number
  voltage_rating_volts: number
}

export type SourceSimpleFuseInput = z.input<typeof source_simple_fuse>
type InferredSourceSimpleFuse = z.infer<typeof source_simple_fuse>

expectTypesMatch<SourceSimpleFuse, InferredSourceSimpleFuse>(true)
