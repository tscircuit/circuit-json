import { test, expect } from "bun:test"
import { pcb_via_clearance_error } from "../src/pcb/pcb_via_clearance_error"
import { any_circuit_element } from "../src/any_circuit_element"

test("pcb_via_clearance_error parses", () => {
  const error = pcb_via_clearance_error.parse({
    type: "pcb_via_clearance_error",
    message: "vias too close",
    pcb_via_ids: ["via_1", "via_2"],
    minimum_clearance: "0.2mm",
    actual_clearance: "0.1mm",
    pcb_center: {
      x: 12.5,
      y: -3.4,
    },
  })

  expect(error.pcb_error_id).toBeDefined()
  expect(error.pcb_error_id.startsWith("pcb_error")).toBe(true)
  expect(error.minimum_clearance).toBeCloseTo(0.2)
  expect(error.actual_clearance).toBeCloseTo(0.1)
  expect(error.pcb_center).toEqual({ x: 12.5, y: -3.4 })
})

test("any_circuit_element includes pcb_via_clearance_error", () => {
  const parsed = any_circuit_element.parse({
    type: "pcb_via_clearance_error",
    message: "vias too close",
    pcb_via_ids: ["via_1", "via_2"],
  })

  expect(parsed.type).toBe("pcb_via_clearance_error")
})
