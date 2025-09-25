import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pin_attributes = z.object({
  rats_nest_color: z.string().optional(),
})

export type PinAttributesInput = z.input<typeof pin_attributes>
type InferredPinAttributes = z.infer<typeof pin_attributes>

export interface PinAttributes {
  rats_nest_color?: string
}

expectTypesMatch<PinAttributes, InferredPinAttributes>(true)
