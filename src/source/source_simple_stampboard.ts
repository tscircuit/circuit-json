import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_stampboard = source_component_base.extend({
  ftype: z.literal("simple_stampboard"),
  leftPinCount: z.number().optional(),
  rightPinCount: z.number().optional(),
  topPinCount: z.number().optional(),
  bottomPinCount: z.number().optional(),
  leftPins: z.array(z.string()).optional(),
  rightPins: z.array(z.string()).optional(),
  topPins: z.array(z.string()).optional(),
  bottomPins: z.array(z.string()).optional(),
  pinPitch: z.number().optional(),
  innerHoles: z.boolean().optional(),
})

export type SourceSimpleStampboardInput = z.input<
  typeof source_simple_stampboard
>
type InferredSourceSimpleStampboard = z.infer<typeof source_simple_stampboard>

/**
 * Defines a simple stampboard component
 * This is a PCB component that can have pins on any side and optional inner holes
 */
export interface SourceSimpleStampboard extends SourceComponentBase {
  ftype: "simple_stampboard"
  leftPinCount?: number
  rightPinCount?: number
  topPinCount?: number
  bottomPinCount?: number
  leftPins?: string[]
  rightPins?: string[]
  topPins?: string[]
  bottomPins?: string[]
  pinPitch?: number
  innerHoles?: boolean
}

expectTypesMatch<SourceSimpleStampboard, InferredSourceSimpleStampboard>(true)
