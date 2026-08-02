import { expect, test } from "bun:test"
import { pcb_smtpad } from "../src/pcb/pcb_smtpad"

const pads = [
  { shape: "circle", radius: 0.5 },
  { shape: "rect", width: 1, height: 2 },
  { shape: "rotated_rect", width: 1, height: 2, ccw_rotation: 45 },
  { shape: "pill", width: 2, height: 1, radius: 0.5 },
  {
    shape: "rotated_pill",
    width: 2,
    height: 1,
    radius: 0.5,
    ccw_rotation: 45,
  },
  {
    shape: "polygon",
    points: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ],
  },
] as const

test("all SMT pad shapes parse solderpaste_margin", () => {
  for (const pad of pads) {
    const parsed = pcb_smtpad.parse({
      type: "pcb_smtpad",
      x: 0,
      y: 0,
      layer: "top",
      solderpaste_margin: -0.05,
      ...pad,
    })

    expect(parsed.solderpaste_margin).toBe(-0.05)
  }
})
