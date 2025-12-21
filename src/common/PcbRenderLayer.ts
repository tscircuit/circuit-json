import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export type PcbRenderLayer =
  | "top_left"
  | "top_center"
  | "top_right"
  | "center_left"
  | "center"
  | "center_right"
  | "bottom_left"
  | "bottom_center"
  | "bottom_right"

export const pcbRenderLayer = z.enum([
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

type InferredPcbRenderLayer = z.infer<typeof pcbRenderLayer>

expectTypesMatch<PcbRenderLayer, InferredPcbRenderLayer>(true)
