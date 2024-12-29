import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_transistor = source_component_base.extend({
  ftype: z.literal("simple_transistor"),
  transistor_type: z.enum(["npn", "pnp"]),
})

export type SourceSimpleTransistorInput = z.input<
  typeof source_simple_transistor
>
type InferredSourceSimpleTransistor = z.infer<typeof source_simple_transistor>

/**
 * Defines a simple transistor component
 * This is a three-pin semiconductor device (emitter, base, collector)
 * Pin configuration is handled by the schematic port system
 */

export interface SourceSimpleTransistor extends SourceComponentBase {
  ftype: "simple_transistor"
  transistor_type: "npn" | "pnp"
}

expectTypesMatch<SourceSimpleTransistor, InferredSourceSimpleTransistor>(true)
