import { z } from "zod"
import { distance } from "../units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const point3 = z.object({
  x: distance,
  y: distance,
  z: distance,
})

export const position3 = point3

type InferredPoint3 = z.infer<typeof point3>

export interface Point3 {
  x: number
  y: number
  z: number
}

expectTypesMatch<Point3, InferredPoint3>(true)
