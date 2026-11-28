import { expect, test } from "bun:test"
import { pcb_via, type PcbViaInput } from "../src/pcb/pcb_via"

const baseVia = {
  type: "pcb_via",
  x: 1,
  y: 2,
  layers: ["top", "inner1", "inner2"],
} satisfies PcbViaInput

test.each([
  ["empty layers", { layers: [] }],
  ["duplicate layers", { layers: ["top", { name: "top" }] }],
  ["an unlisted drill endpoint", { topmost_drill_layer: "inner3" }],
  ["a drill endpoint inside the span", { bottommost_drill_layer: "inner1" }],
  [
    "reversed drill endpoints",
    { topmost_drill_layer: "inner2", bottommost_drill_layer: "top" },
  ],
  ["through_hole true on a blind span", { through_hole: true }],
  [
    "through_hole false on a full span",
    { layers: ["top", "bottom"], through_hole: false },
  ],
  ["from_layer outside the span", { from_layer: "bottom" }],
  ["to_layer outside the span", { to_layer: "bottom" }],
] satisfies [string, Partial<PcbViaInput>][])(
  "pcb_via rejects %s",
  (_, fields) => {
    expect(pcb_via.safeParse({ ...baseVia, ...fields }).success).toBe(false)
  },
)
