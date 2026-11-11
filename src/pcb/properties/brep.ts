import { z } from "zod"
import { distance, type Distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const point_with_bulge = z.object({
  x: distance,
  y: distance,
  bulge: z.number().optional(),
})

export interface PointWithBulge {
  x: Distance
  y: Distance
  bulge?: number
}
type InferredPointWithBulge = z.infer<typeof point_with_bulge>
expectTypesMatch<PointWithBulge, InferredPointWithBulge>(true)

export const ring = z.object({
  vertices: z.array(point_with_bulge),
})

export interface Ring {
  vertices: PointWithBulge[]
}
type InferredRing = z.infer<typeof ring>
expectTypesMatch<Ring, InferredRing>(true)

export const brep_shape = z.object({
  outer_ring: ring,
  inner_rings: z.array(ring).default([]),
})

/**
 * B-rep shape defined by an outer ring and inner rings (holes).
 */
export interface BRepShape {
  /**
   * The outer boundary of the shape. Vertices must be in clockwise order.
   */
  outer_ring: Ring
  /**
   * Inner boundaries (holes). Vertices must be in counter-clockwise order.
   */
  inner_rings: Ring[]
}
type InferredBRepShape = z.infer<typeof brep_shape>
expectTypesMatch<BRepShape, InferredBRepShape>(true)
