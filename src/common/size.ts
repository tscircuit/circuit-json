import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const size = z.object({
  width: z.number(),
  height: z.number(),
})

export type SizeInput = z.input<typeof size>
type InferredSize = z.infer<typeof size>

export interface Size {
  width: number
  height: number
}

expectTypesMatch<Size, InferredSize>(true)
