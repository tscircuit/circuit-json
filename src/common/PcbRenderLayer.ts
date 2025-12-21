import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export type PcbRenderLayer =
  | "top_silkscreen"
  | "bottom_silkscreen"
  | "top_copper"
  | "bottom_copper"
  | "top_soldermask"
  | "bottom_soldermask"
  | "top_fabrication"
  | "bottom_fabrication"

export const pcbRenderLayer = z.enum([
  "top_silkscreen",
  "bottom_silkscreen",
  "top_copper",
  "bottom_copper",
  "top_soldermask",
  "bottom_soldermask",
  "top_fabrication",
  "bottom_fabrication",
])

type InferredPcbRenderLayer = z.infer<typeof pcbRenderLayer>

expectTypesMatch<PcbRenderLayer, InferredPcbRenderLayer>(true)
