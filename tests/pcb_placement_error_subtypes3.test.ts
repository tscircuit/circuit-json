import { test, expect } from "bun:test"
import { pcb_placement_error } from "src/pcb/pcb_placement_error"

test("pcb_placement_error parses decoupling_trace_too_long error", () => {
  const data = {
    type: "pcb_placement_error",
    pcb_placement_error_id: "pcb_placement_error_3",
    error_type: "decoupling_trace_too_long",
    message: "Decoupling trace for C1 is 12mm, max allowed is 5mm",
    pcb_component_id: "pcb_component_1",
  }

  const parsed = pcb_placement_error.parse(data)

  expect(parsed.error_type).toBe("decoupling_trace_too_long")
})
