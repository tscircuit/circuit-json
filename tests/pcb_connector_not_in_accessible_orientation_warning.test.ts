import { test, expect } from "bun:test"
import { pcb_connector_not_in_accessible_orientation_warning } from "src/pcb/pcb_connector_not_in_accessible_orientation_warning"
import { any_circuit_element } from "src/any_circuit_element"

test("pcb_connector_not_in_accessible_orientation_warning parses", () => {
  const warning = pcb_connector_not_in_accessible_orientation_warning.parse({
    type: "pcb_connector_not_in_accessible_orientation_warning",
    message:
      "Connector J1 is facing inward toward the board and should be reoriented outward",
    pcb_component_id: "pcb_component_1",
    source_component_id: "source_component_1",
    pcb_board_id: "pcb_board_1",
    facing_direction: "x-",
    recommended_facing_direction: "x+",
  })

  expect(
    warning.pcb_connector_not_in_accessible_orientation_warning_id,
  ).toBeDefined()
  expect(
    warning.pcb_connector_not_in_accessible_orientation_warning_id.startsWith(
      "pcb_connector_not_in_accessible_orientation_warning",
    ),
  ).toBe(true)
  expect(warning.facing_direction).toBe("x-")
  expect(warning.recommended_facing_direction).toBe("x+")
})

test("any_circuit_element includes pcb_connector_not_in_accessible_orientation_warning", () => {
  const parsed = any_circuit_element.parse({
    type: "pcb_connector_not_in_accessible_orientation_warning",
    message: "Connector orientation is not accessible",
    pcb_component_id: "pcb_component_1",
    facing_direction: "y+",
    recommended_facing_direction: "y-",
  })

  expect(parsed.type).toBe(
    "pcb_connector_not_in_accessible_orientation_warning",
  )
})
