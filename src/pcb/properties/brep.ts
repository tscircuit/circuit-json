import { z } from "zod"
import { distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const point_with_bulge = z.object({
  x: distance,
  y: distance,
  bulge: z.number().optional(),
})

export interface PointWithBulge {
  x: number
  y: number
  bulge?: number
}
type InferredPointWithBulge = z.infer<typeof point_with_bulge>
expectTypesMatch<PointWithBulge, InferredPointWithBulge>(true)

export const ring = z.object({
  cwVertices: z.array(point_with_bulge),
})

export interface Ring {
  cwVertices: PointWithBulge[]
}
type InferredRing = z.infer<typeof ring>
expectTypesMatch<Ring, InferredRing>(true)

export const brep_shape = z.object({
  outerRing: ring,
  innerRings: z.array(ring),
})

export interface BRepShape {
  outerRing: Ring
  innerRings: Ring[]
}
type InferredBRepShape = z.infer<typeof brep_shape>
expectTypesMatch<BRepShape, InferredBRepShape>(true)
