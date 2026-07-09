import { test, expect } from "bun:test"
import { pcb_placement_error } from "src/pcb/pcb_placement_error"

test("pcb_placement_error parses wrong_pad_orientation error", () => {
  const data = {
    type: "pcb_placement_error",
    pcb_placement_error_id: "pcb_placement_error_2",
    error_type: "wrong_pad_orientation",
    message: "C1 facing pad is the farthest from target (270° rule violated)",
    pcb_component_id: "pcb_component_1",
    pcb_placement_hint_id: "pcb_placement_hint_1",
  }

  const parsed = pcb_placement_error.parse(data)

  expect(parsed.error_type).toBe("wrong_pad_orientation")
})
