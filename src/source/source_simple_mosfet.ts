import {
  type SourceComponentBase,
  source_component_base,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_simple_mosfet = source_component_base.extend({
  ftype: z.literal("simple_mosfet"),
  channel_type: z.enum(["n", "p"]),
  mosfet_mode: z.enum(["enhancement", "depletion"]),
})

export type SourceSimpleMosfetInput = z.input<typeof source_simple_mosfet>
type InferredSourceSimpleMosfet = z.infer<typeof source_simple_mosfet>

/**
 * Defines a simple mosfet component
 * This is a three-pin semiconductor device (source, gate, drain)
 * Pin configuration is handled by the schematic port system
 */

export interface SourceSimpleMosfet extends SourceComponentBase {
  ftype: "simple_mosfet"
  channel_type: "n" | "p"
  mosfet_mode: "enhancement" | "depletion"
}

expectTypesMatch<SourceSimpleMosfet, InferredSourceSimpleMosfet>(true)
