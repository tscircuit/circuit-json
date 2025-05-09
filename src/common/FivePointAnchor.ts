import { z } from "zod"

export type FivePointAnchor = "center" | "left" | "right" | "top" | "bottom"

export const fivePointAnchor = z.enum([
  "center",
  "left",
  "right",
  "top",
  "bottom",
])
