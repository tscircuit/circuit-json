import { expect, test } from "bun:test"
import { pcb_solder_paste } from "src/pcb/pcb_solder_paste"

test.each([
  ["1e-3", 0.001],
  ["-2.5e1", -25],
  [45, 45],
  ["90deg", 90],
  ["1.5707963267948966rad", 90],
])(
  "rotated rectangular paste converts %s to degrees",
  (ccw_rotation, expected) => {
    const paste = pcb_solder_paste.parse({
      type: "pcb_solder_paste",
      shape: "rotated_rect",
      x: 1,
      y: 2,
      width: 1.2,
      height: 0.6,
      ccw_rotation,
      layer: "top",
    })

    if (paste.shape !== "rotated_rect") throw new Error("Expected rotated_rect")
    expect(paste.ccw_rotation).toBe(expected)
  },
)
