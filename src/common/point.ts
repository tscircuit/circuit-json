import { z } from "zod"
import { distance } from "../units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const point = z.object({
  x: distance,
  y: distance,
})

export const position = point

export type InputPoint = z.input<typeof point>
export type InputPosition = z.input<typeof position>
type InferredPoint = z.infer<typeof point>
type InferredPosition = z.infer<typeof position>

export interface Point {
  x: number
  y: number
}

export interface Position {
  x: number
  y: number
}

expectTypesMatch<Point, InferredPoint>(true)
expectTypesMatch<Position, InferredPosition>(true)
