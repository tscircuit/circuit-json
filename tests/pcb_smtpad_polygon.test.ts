import { expect, test } from "bun:test"
import { pcb_smtpad } from "../src/pcb/pcb_smtpad"

test("parse polygon smt pad", () => {
  const pad = pcb_smtpad.parse({
    type: "pcb_smtpad",
    shape: "polygon",
    pcb_smtpad_id: "pad1",
    points: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ],
    layer: "top",
  })
  expect(pad.shape).toBe("polygon")
  expect(pad.points.length).toBe(3)
})
