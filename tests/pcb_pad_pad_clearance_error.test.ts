import { test, expect } from "bun:test"
import { pcb_pad_pad_clearance_error } from "../src/pcb/pcb_pad_pad_clearance_error"
import { any_circuit_element } from "../src/any_circuit_element"

test("pcb_pad_pad_clearance_error parses", () => {
  const error = pcb_pad_pad_clearance_error.parse({
    type: "pcb_pad_pad_clearance_error",
    message: "pads too close",
    pcb_pad_ids: ["pcb_smtpad_1", "pcb_smtpad_2"],
    minimum_clearance: "0.2mm",
    actual_clearance: "0.1mm",
    center: {
      x: 8.1,
      y: -2.3,
    },
  })

  expect(error.pcb_pad_pad_clearance_error_id).toBeDefined()
  expect(
    error.pcb_pad_pad_clearance_error_id.startsWith(
      "pcb_pad_pad_clearance_error",
    ),
  ).toBe(true)
  expect(error.minimum_clearance).toBeCloseTo(0.2)
  expect(error.actual_clearance).toBeCloseTo(0.1)
  expect(error.center).toEqual({ x: 8.1, y: -2.3 })
})

test("any_circuit_element includes pcb_pad_pad_clearance_error", () => {
  const parsed = any_circuit_element.parse({
    type: "pcb_pad_pad_clearance_error",
    message: "pads too close",
    pcb_pad_ids: ["pcb_smtpad_1", "pcb_smtpad_2"],
  })

  expect(parsed.type).toBe("pcb_pad_pad_clearance_error")
})
