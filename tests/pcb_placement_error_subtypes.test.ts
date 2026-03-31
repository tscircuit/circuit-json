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

test("pcb_placement_error defaults to pcb_placement_error type", () => {
  const data = {
    type: "pcb_placement_error",
    pcb_placement_error_id: "pcb_placement_error_4",
    message: "Generic placement error",
  }

  const parsed = pcb_placement_error.parse(data)

  expect(parsed.error_type).toBe("pcb_placement_error")
})
