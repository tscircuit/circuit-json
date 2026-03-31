import { test, expect } from "bun:test"
import { pcb_placement_error } from "src/pcb/pcb_placement_error"

test("pcb_placement_error defaults to pcb_placement_error type", () => {
  const data = {
    type: "pcb_placement_error",
    pcb_placement_error_id: "pcb_placement_error_4",
    message: "Generic placement error",
  }

  const parsed = pcb_placement_error.parse(data)

  expect(parsed.error_type).toBe("pcb_placement_error")
})
