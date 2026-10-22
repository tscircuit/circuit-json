import { z } from "zod"
import {
  drawing_page_size,
  getDrawingPageDimensions,
  type DrawingPageSize,
} from "./drawing_page_size"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const drawing_page = z
  .object({
    type: z.literal("drawing_page"),
    drawing_page_id: z.string().min(1),
    name: z.string().optional(),
    display_name: z.string().optional(),
    page_size: drawing_page_size.optional(),
    orientation: z.enum(["landscape", "portrait"]).optional(),
    width: z.number().finite().positive(),
    height: z.number().finite().positive(),
  })
  .superRefine((page, ctx) => {
    if (!page.page_size) {
      if (page.orientation)
        ctx.addIssue({
          code: "custom",
          path: ["orientation"],
          message:
            "Orientation requires page_size; custom pages use explicit dimensions",
        })
      return
    }
    const expected = getDrawingPageDimensions(page.page_size, page.orientation)
    if (
      Math.abs(page.width - expected.width) > 1e-6 ||
      Math.abs(page.height - expected.height) > 1e-6
    )
      ctx.addIssue({
        code: "custom",
        path: ["page_size"],
        message: "Dimensions must match the named sheet size and orientation",
      })
  })
  .describe(
    "A paper-space drawing page containing configured part views. Dimensions are mm.",
  )

export interface DrawingPage {
  type: "drawing_page"
  drawing_page_id: string
  name?: string
  display_name?: string
  page_size?: DrawingPageSize
  orientation?: "landscape" | "portrait"
  width: number
  height: number
}
export type DrawingPageInput = z.input<typeof drawing_page>
expectTypesMatch<DrawingPage, z.infer<typeof drawing_page>>(true)
