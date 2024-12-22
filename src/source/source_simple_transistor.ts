import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { voltage, current } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_transistor = source_component_base.extend({
  ftype: z.literal("simple_transistor"),
  transistorType: z.enum(["NPN", "PNP"]),
  pinLabels: z.object({
    emitter: z.string(),
    base: z.string(),
    collector: z.string(),
  }),
  vce: voltage.optional(),
  vbe: voltage.optional(),
  ic: current.optional(),
})

export type SourceSimpleTransistorInput = z.input<
  typeof source_simple_transistor
>
type InferredSourceSimpleTransistor = z.infer<typeof source_simple_transistor>

/**
 * Defines a simple transistor component
 */

export interface SourceSimpleTransistor extends SourceComponentBase {
  ftype: "simple_transistor"
  transistorType: "NPN" | "PNP"
  pinLabels: Record<"emitter" | "base" | "collector", string>
  vce?: number
  vbe?: number
  ic?: number
}

expectTypesMatch<SourceSimpleTransistor, InferredSourceSimpleTransistor>(true)
