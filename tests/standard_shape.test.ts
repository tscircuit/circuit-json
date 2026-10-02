import { expect, test } from "bun:test"
import { z } from "zod"
import {
  circle_shape,
  rect_shape,
  standard_shape,
  type StandardShape,
  type StandardShapeInput,
} from "src"

test("standard shapes normalize geometry without PCB record fields", () => {
  const inputs: StandardShapeInput[] = [
    { shape: "circle", x: "-2mm", y: "3mm", radius: "0.5mm" },
    { shape: "rect", x: 2, y: 3, width: "1in", height: "5mm" },
    {
      shape: "rotated_rect",
      x: 2,
      y: 3,
      width: "1in",
      height: "5mm",
      ccw_rotation: `${Math.PI / 2}rad`,
    },
    {
      shape: "polygon",
      points: [
        { x: "0mm", y: "0mm" },
        { x: "2mm", y: "0mm" },
        { x: "1mm", y: "1mm" },
      ],
    },
  ]
  const shapes: StandardShape[] = inputs.map((input) =>
    standard_shape.parse(input),
  )
  expect(shapes).toEqual([
    { shape: "circle", x: -2, y: 3, radius: 0.5 },
    { shape: "rect", x: 2, y: 3, width: 25.4, height: 5 },
    {
      shape: "rotated_rect",
      x: 2,
      y: 3,
      width: 25.4,
      height: 5,
      ccw_rotation: 90,
    },
    {
      shape: "polygon",
      points: [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 1, y: 1 },
      ],
    },
  ])
})

test("elements select supported shapes and add metadata without duplicating geometry", () => {
  const region_fields = { region_id: z.string() }
  const region = z.discriminatedUnion("shape", [
    circle_shape.extend(region_fields),
    rect_shape.extend(region_fields),
  ])
  const circle = {
    region_id: "region_1",
    shape: "circle",
    x: 2,
    y: 3,
    radius: 0.5,
  } satisfies z.input<typeof region>
  const rect = {
    region_id: "region_2",
    shape: "rect",
    x: 2,
    y: 3,
    width: 4,
    height: 5,
  } satisfies z.input<typeof region>
  expect(region.parse(circle)).toEqual(circle)
  expect(region.parse(rect)).toEqual(rect)
  for (const input of [
    { ...circle, region_id: undefined },
    { ...circle, width: 4 },
    { ...rect, radius: 0.5 },
    { ...rect, shape: "rotated_rect", ccw_rotation: 90 },
    {
      region_id: "region_3",
      shape: "polygon",
      points: [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 1, y: 1 },
      ],
    },
  ]) {
    expect(region.safeParse(input).success).toBe(false)
  }
})
