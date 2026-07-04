import { test, expect } from "bun:test"
import { pcb_silkscreen_text } from "../src/pcb/pcb_silkscreen_text"

test("pcb_silkscreen_text carries an optional keep_upright flag", () => {
  const base = {
    type: "pcb_silkscreen_text" as const,
    pcb_component_id: "pcb_component_0",
    text: "R1",
    layer: "top" as const,
    ccw_rotation: 180,
  }

  const withFlag = pcb_silkscreen_text.parse({ ...base, keep_upright: true })
  expect(withFlag.keep_upright).toBe(true)

  // Absent behaves like the sibling is_mirrored flag: undefined (falsy), so a
  // renderer honors the raw ccw_rotation unless keep_upright is explicitly set.
  const withoutFlag = pcb_silkscreen_text.parse(base)
  expect(withoutFlag.keep_upright).toBeUndefined()
})
