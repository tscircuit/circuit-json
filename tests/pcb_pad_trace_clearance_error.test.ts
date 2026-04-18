import { test, expect } from "bun:test"
import { pcb_pad_trace_clearance_error } from "../src/pcb/pcb_pad_trace_clearance_error"
import { any_circuit_element } from "../src/any_circuit_element"

test("pcb_pad_trace_clearance_error parses", () => {
  const error = pcb_pad_trace_clearance_error.parse({
    type: "pcb_pad_trace_clearance_error",
    message: "pad and trace too close",
    pcb_pad_id: "pcb_smtpad_1",
    pcb_trace_id: "pcb_trace_1",
    minimum_clearance: "0.2mm",
    actual_clearance: "0.1mm",
    center: {
      x: 4.2,
      y: 1.5,
    },
  })

  expect(error.pcb_pad_trace_clearance_error_id).toBeDefined()
  expect(
    error.pcb_pad_trace_clearance_error_id.startsWith(
      "pcb_pad_trace_clearance_error",
    ),
  ).toBe(true)
  expect(error.minimum_clearance).toBeCloseTo(0.2)
  expect(error.actual_clearance).toBeCloseTo(0.1)
  expect(error.center).toEqual({ x: 4.2, y: 1.5 })
})

test("any_circuit_element includes pcb_pad_trace_clearance_error", () => {
  const parsed = any_circuit_element.parse({
    type: "pcb_pad_trace_clearance_error",
    message: "pad and trace too close",
    pcb_pad_id: "pcb_smtpad_1",
    pcb_trace_id: "pcb_trace_1",
  })

  expect(parsed.type).toBe("pcb_pad_trace_clearance_error")
})
