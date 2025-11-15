import { expect, test } from "bun:test"
import {
  pcb_plated_hole,
  type PcbHoleWithPadStackup,
} from "../src/pcb/pcb_plated_hole"

test("parse hole with pad stackup defaults hole offset to 0", () => {
  const hole = pcb_plated_hole.parse({
    type: "pcb_plated_hole",
    shape: "hole_with_pad_stackup",
    hole_shape: "circle",
    hole_diameter: 0.3,
    x: 1,
    y: 2,
    layers: ["top", "bottom"],
    pad_stackup: [
      {
        layer: "top",
        shape: {
          type: "rect",
          width: 0.9,
          height: 0.7,
          ccw_rotation: 15,
        },
      },
      {
        layer: "bottom",
        shape: {
          type: "polygon",
          pad_outline: [
            { x: -0.4, y: -0.3 },
            { x: 0.4, y: -0.3 },
            { x: 0, y: 0.5 },
          ],
        },
      },
    ],
  }) as PcbHoleWithPadStackup

  expect(hole.hole_offset_x).toBe(0)
  expect(hole.hole_offset_y).toBe(0)
  expect(hole.pad_stackup[0]?.shape).toEqual({
    type: "rect",
    width: 0.9,
    height: 0.7,
    ccw_rotation: 15,
  })
  expect(hole.pad_stackup[1]?.shape.type).toBe("polygon")
})

test("hole with pad stackup requires hole dimensions for non-circular holes", () => {
  expect(() =>
    pcb_plated_hole.parse({
      type: "pcb_plated_hole",
      shape: "hole_with_pad_stackup",
      hole_shape: "oval",
      x: 0,
      y: 0,
      layers: ["top"],
      pad_stackup: [
        {
          layer: "top",
          shape: {
            type: "circle",
            outer_diameter: 0.6,
          },
        },
      ],
    }),
  ).toThrow()
})

test("hole with pad stackup requires rotation for rotated pill holes", () => {
  expect(() =>
    pcb_plated_hole.parse({
      type: "pcb_plated_hole",
      shape: "hole_with_pad_stackup",
      hole_shape: "rotated_pill",
      hole_width: 0.4,
      hole_height: 0.9,
      x: 0,
      y: 0,
      layers: ["top"],
      pad_stackup: [
        {
          layer: "top",
          shape: {
            type: "pill",
            width: 0.6,
            height: 0.9,
          },
        },
      ],
    }),
  ).toThrow()

  const rotatedPillHole = pcb_plated_hole.parse({
    type: "pcb_plated_hole",
    shape: "hole_with_pad_stackup",
    hole_shape: "rotated_pill",
    hole_width: 0.4,
    hole_height: 0.9,
    hole_ccw_rotation: 45,
    x: 0,
    y: 0,
    layers: ["top"],
    pad_stackup: [
      {
        layer: "top",
        shape: {
          type: "rotated_pill",
          width: 0.6,
          height: 0.9,
          ccw_rotation: 90,
        },
      },
    ],
  }) as PcbHoleWithPadStackup

  expect(rotatedPillHole.hole_ccw_rotation).toBe(45)
})
