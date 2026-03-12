import { test, expect } from "bun:test"
import { pcb_courtyard_overlap_error } from "src/pcb/pcb_courtyard_overlap_error"
import { any_circuit_element } from "src/any_circuit_element"

test("pcb_courtyard_overlap_error parses", () => {
  const errorData = {
    type: "pcb_courtyard_overlap_error",
    message: "courtyard of U1 overlaps with courtyard of U2",
    pcb_component_ids: ["pcb_component_1", "pcb_component_2"],
  }

  const parsed = pcb_courtyard_overlap_error.parse(errorData)

  expect(parsed.type).toBe("pcb_courtyard_overlap_error")
  expect(parsed.error_type).toBe("pcb_courtyard_overlap_error")
  expect(parsed.message).toContain("U1")
  expect(parsed.pcb_component_ids).toEqual([
    "pcb_component_1",
    "pcb_component_2",
  ])
  expect(parsed.pcb_error_id).toBeTruthy()
})

test("pcb_courtyard_overlap_error auto-generates pcb_error_id", () => {
  const parsed = pcb_courtyard_overlap_error.parse({
    type: "pcb_courtyard_overlap_error",
    message: "courtyard overlap",
    pcb_component_ids: ["pcb_component_1", "pcb_component_2"],
  })

  expect(parsed.pcb_error_id).toMatch(/^pcb_error_/)
})

test("any_circuit_element includes pcb_courtyard_overlap_error", () => {
  const errorData = {
    type: "pcb_courtyard_overlap_error",
    message: "courtyard of U1 overlaps with courtyard of U2",
    pcb_component_ids: ["pcb_component_1", "pcb_component_2"],
  }

  expect(() => any_circuit_element.parse(errorData)).not.toThrow()
})
