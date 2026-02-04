import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export type PcbRenderLayer =
  | "top_silkscreen"
  | "bottom_silkscreen"
  | "top_copper"
  | "bottom_copper"
  | "top_soldermask"
  | "bottom_soldermask"
  | "top_fabrication_note"
  | "bottom_fabrication_note"
  | "top_user_note"
  | "bottom_user_note"
  | "top_courtyard"
  | "bottom_courtyard"
  | "inner1_copper"
  | "inner2_copper"
  | "inner3_copper"
  | "inner4_copper"
  | "inner5_copper"
  | "inner6_copper"
  | "edge_cuts"
  | "drill"

export const pcbRenderLayer = z.enum([
  "top_silkscreen",
  "bottom_silkscreen",
  "top_copper",
  "bottom_copper",
  "top_soldermask",
  "bottom_soldermask",
  "top_fabrication_note",
  "bottom_fabrication_note",
  "top_user_note",
  "bottom_user_note",
  "top_courtyard",
  "bottom_courtyard",
  "inner1_copper",
  "inner2_copper",
  "inner3_copper",
  "inner4_copper",
  "inner5_copper",
  "inner6_copper",
  "edge_cuts",
  "drill",
])

type InferredPcbRenderLayer = z.infer<typeof pcbRenderLayer>

expectTypesMatch<PcbRenderLayer, InferredPcbRenderLayer>(true)
