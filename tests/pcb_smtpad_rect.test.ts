import { expect, test } from "bun:test"
import { pcb_smtpad, type PcbSmtPadRect } from "../src/pcb/pcb_smtpad"

test("parse rect smt pad with border radius", () => {
  const pad = pcb_smtpad.parse({
    type: "pcb_smtpad",
    shape: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 2,
    rect_border_radius: 0.1,
    layer: "top",
    is_covered_with_solder_mask: true,
  })
  expect(pad.shape).toBe("rect")
  expect((pad as PcbSmtPadRect).rect_border_radius).toBe(0.1)
  expect((pad as PcbSmtPadRect).is_covered_with_solder_mask).toBe(true)
})
