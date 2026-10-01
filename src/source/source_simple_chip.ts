import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_chip = source_component_base.extend({
  ftype: z.literal("simple_chip"),
  /** Firmware execution environment; omitted means unspecified. */
  firmware_rtos: z.enum(["nortos", "freertos"]).optional(),
  /** Requested low-frequency clock source, independent of package pin mapping. */
  firmware_lf_clock_source: z
    .enum(["internal_rc", "external_crystal"])
    .optional(),
})

export type SourceSimpleChipInput = z.input<typeof source_simple_chip>
type InferredSourceSimpleChip = z.infer<typeof source_simple_chip>

/**
 * Defines a simple integrated circuit component
 */
export interface SourceSimpleChip extends SourceComponentBase {
  ftype: "simple_chip"
  firmware_rtos?: "nortos" | "freertos"
  firmware_lf_clock_source?: "internal_rc" | "external_crystal"
}

expectTypesMatch<SourceSimpleChip, InferredSourceSimpleChip>(true)
