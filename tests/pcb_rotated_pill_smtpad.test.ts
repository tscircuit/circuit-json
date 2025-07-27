import { expect, test } from "bun:test"
import { pcb_smtpad, type PcbSmtPadRotatedPill } from "../src/pcb/pcb_smtpad"

test("parse rotated pill smt pad", () => {
  const pad = pcb_smtpad.parse({
    type: "pcb_smtpad",
    shape: "rotated_pill",
    x: 0,
    y: 0,
    width: 1,
    height: 2,
    radius: 0.5,
    ccw_rotation: 90,
    layer: "top",
  })
  expect(pad.shape).toBe("rotated_pill")
  expect((pad as PcbSmtPadRotatedPill).ccw_rotation).toBe(90)
})
