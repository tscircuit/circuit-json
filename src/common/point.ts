import { z } from "zod"
import { distance } from "../units"

export const point = z.object({
  x: distance,
  y: distance,
})

export const position = point

export type Point = z.infer<typeof point>
export type InputPoint = z.input<typeof point>
export type InputPosition = z.input<typeof position>
export type Position = z.infer<typeof position>
