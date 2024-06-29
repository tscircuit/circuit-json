import { z } from "zod"
import { distance } from "../units"

export const point3 = z.object({
  x: distance,
  y: distance,
  z: distance,
})

export const position3 = point3

export type Point3 = z.infer<typeof point3>
