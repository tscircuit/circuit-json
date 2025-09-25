import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export type FivePointAnchor = "center" | "left" | "right" | "top" | "bottom"

export const fivePointAnchor = z.enum([
  "center",
  "left",
  "right",
  "top",
  "bottom",
])

type InferredFivePointAnchor = z.infer<typeof fivePointAnchor>

expectTypesMatch<FivePointAnchor, InferredFivePointAnchor>(true)
