import { test, expect } from "bun:test"
import { pcb_placement_error } from "src/pcb/pcb_placement_error"

test("pcb_placement_error parses distance_exceeded error", () => {
  const data = {
    type: "pcb_placement_error",
    pcb_placement_error_id: "pcb_placement_error_1",
    error_type: "distance_exceeded",
    message: "C1 is 8mm from U1.VCC, max allowed is 5mm",
    pcb_component_id: "pcb_component_1",
    pcb_placement_hint_id: "pcb_placement_hint_1",
    actual_distance: 0.008,
    max_distance: 0.005,
  }

  const parsed = pcb_placement_error.parse(data)

  expect(parsed.error_type).toBe("distance_exceeded")
  expect(parsed.pcb_component_id).toBe("pcb_component_1")
  expect(parsed.pcb_placement_hint_id).toBe("pcb_placement_hint_1")
  expect(parsed.actual_distance).toBeCloseTo(0.008)
  expect(parsed.max_distance).toBeCloseTo(0.005)
})
