import { z } from "zod"
import { point, type Point } from "./point"
import { distance, type Distance, rotation, type Rotation } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

const finite_distance = distance.pipe(z.number().finite())
const positive_distance = distance.pipe(z.number().finite().positive())

export const circle_shape = z
  .object({
    shape: z.literal("circle"),
    x: finite_distance,
    y: finite_distance,
    radius: positive_distance,
  })
  .strict()

export const rect_shape = z
  .object({
    shape: z.literal("rect"),
    x: finite_distance,
    y: finite_distance,
    width: positive_distance,
    height: positive_distance,
  })
  .strict()

export const rotated_rect_shape = rect_shape.extend({
  shape: z.literal("rotated_rect"),
  ccw_rotation: rotation.pipe(z.number().finite()),
})

export const polygon_shape = z
  .object({
    shape: z.literal("polygon"),
    points: z
      .array(point.extend({ x: finite_distance, y: finite_distance }))
      .min(3)
      .refine((points) => {
        const twice_area = points.reduce((sum, point, index) => {
          const next = points[(index + 1) % points.length]!
          return sum + point.x * next.y - next.x * point.y
        }, 0)
        return Number.isFinite(twice_area) && twice_area !== 0
      }, "Polygon boundary must enclose a nonzero area"),
  })
  .strict()

/** A circle centered at (x, y), with coordinates and radius in mm. */
export interface CircleShape {
  shape: "circle"
  x: Distance
  y: Distance
  radius: Distance
}

/** A rectangle centered at (x, y), with coordinates and dimensions in mm. */
export interface RectShape {
  shape: "rect"
  x: Distance
  y: Distance
  width: Distance
  height: Distance
}

/** A centered rectangle rotated counterclockwise in degrees. */
export interface RotatedRectShape extends Omit<RectShape, "shape"> {
  shape: "rotated_rect"
  ccw_rotation: Rotation
}

/** An implicitly closed boundary in mm enclosing nonzero area. */
export interface PolygonShape {
  shape: "polygon"
  points: Point[]
}

expectTypesMatch<CircleShape, z.output<typeof circle_shape>>(true)
expectTypesMatch<RectShape, z.output<typeof rect_shape>>(true)
expectTypesMatch<RotatedRectShape, z.output<typeof rotated_rect_shape>>(true)
expectTypesMatch<PolygonShape, z.output<typeof polygon_shape>>(true)

/**
 * Geometry only; the containing element defines the coordinate frame and meaning.
 * Elements can select a subset and extend each shape with their own record fields.
 */
export const standard_shape = z.discriminatedUnion("shape", [
  circle_shape,
  rect_shape,
  rotated_rect_shape,
  polygon_shape,
])

export type StandardShapeInput = z.input<typeof standard_shape>
export type StandardShape =
  | CircleShape
  | RectShape
  | RotatedRectShape
  | PolygonShape

expectTypesMatch<StandardShape, z.output<typeof standard_shape>>(true)
