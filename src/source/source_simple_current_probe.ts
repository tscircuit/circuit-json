import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_current_probe = source_component_base.extend({
  ftype: z.literal("simple_current_probe"),
})

export type SourceSimpleCurrentProbeInput = z.input<
  typeof source_simple_current_probe
>
type InferredSourceSimpleCurrentProbe = z.infer<
  typeof source_simple_current_probe
>

/**
 * Defines a simple current probe component for simulation and measurement
 */
export interface SourceSimpleCurrentProbe extends SourceComponentBase {
  ftype: "simple_current_probe"
}

expectTypesMatch<SourceSimpleCurrentProbe, InferredSourceSimpleCurrentProbe>(
  true,
)
