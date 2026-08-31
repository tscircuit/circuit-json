import { z } from "zod"

export const text_typography = {
  font_family: z.string().min(1).optional(),
  font_weight: z.enum(["normal", "bold"]).optional(),
  font_style: z.enum(["normal", "italic"]).optional(),
}

export interface TextTypography {
  font_family?: string
  font_weight?: "normal" | "bold"
  font_style?: "normal" | "italic"
}
