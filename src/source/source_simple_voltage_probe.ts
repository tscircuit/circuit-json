import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_voltage_probe = source_component_base.extend({
  ftype: z.literal("simple_voltage_probe"),
})

export type SourceSimpleVoltageProbeInput = z.input<
  typeof source_simple_voltage_probe
>
type InferredSourceSimpleVoltageProbe = z.infer<
  typeof source_simple_voltage_probe
>

/**
 * Defines a simple voltage probe component for simulation and measurement
 */
export interface SourceSimpleVoltageProbe extends SourceComponentBase {
  ftype: "simple_voltage_probe"
}

expectTypesMatch<SourceSimpleVoltageProbe, InferredSourceSimpleVoltageProbe>(
  true,
)
