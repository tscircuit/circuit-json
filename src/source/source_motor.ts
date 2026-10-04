import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_motor = source_component_base.extend({
  ftype: z.literal("motor"),
})

export type SourceMotorInput = z.input<typeof source_motor>
type InferredSourceMotor = z.infer<typeof source_motor>

/** Defines a motor component. */
export interface SourceMotor extends SourceComponentBase {
  ftype: "motor"
}

expectTypesMatch<SourceMotor, InferredSourceMotor>(true)
