import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export type NinePointAnchor =
  | "top_left"
  | "top_center"
  | "top_right"
  | "center_left"
  | "center"
  | "center_right"
  | "bottom_left"
  | "bottom_center"
  | "bottom_right"

export const ninePointAnchor = z.enum([
  "top_left",
  "top_center",
  "top_right",
  "center_left",
  "center",
  "center_right",
  "bottom_left",
  "bottom_center",
  "bottom_right",
])

type InferredNinePointAnchor = z.infer<typeof ninePointAnchor>

expectTypesMatch<NinePointAnchor, InferredNinePointAnchor>(true)
