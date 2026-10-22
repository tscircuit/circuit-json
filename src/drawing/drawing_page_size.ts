import { z } from "zod"

/** Landscape dimensions in mm. ISO A-series / ASME Y14.1 decimal-inch sheets. */
export const drawingPageSizes = {
  iso_a0: [1189, 841],
  iso_a1: [841, 594],
  iso_a2: [594, 420],
  iso_a3: [420, 297],
  iso_a4: [297, 210],
  ansi_a: [279.4, 215.9],
  ansi_b: [431.8, 279.4],
  ansi_c: [558.8, 431.8],
  ansi_d: [863.6, 558.8],
  ansi_e: [1117.6, 863.6],
} as const
export const drawing_page_size = z.enum([
  "iso_a0",
  "iso_a1",
  "iso_a2",
  "iso_a3",
  "iso_a4",
  "ansi_a",
  "ansi_b",
  "ansi_c",
  "ansi_d",
  "ansi_e",
])
export type DrawingPageSize = z.infer<typeof drawing_page_size>
export function getDrawingPageDimensions(
  size: DrawingPageSize,
  orientation: "landscape" | "portrait" = "landscape",
) {
  const [width, height] = drawingPageSizes[size]
  return orientation === "portrait"
    ? { width: height, height: width }
    : { width, height }
}
