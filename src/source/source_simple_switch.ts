import { z } from "zod";
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base";
import { expectTypesMatch } from "src/utils/expect-types-match";

export const source_simple_switch = source_component_base.extend({
  ftype: z.literal("simple_switch"),
})
export type SourceSimpleSwitchInput = z.input<typeof source_simple_switch>;
type InferredSourceSimpleSwitch = z.infer<typeof source_simple_switch>;

/**
 * Defines a simple switch component
 */
export interface SourceSimpleSwitch extends SourceComponentBase {
  ftype: "simple_switch";
}

expectTypesMatch<SourceSimpleSwitch, InferredSourceSimpleSwitch>(true);
