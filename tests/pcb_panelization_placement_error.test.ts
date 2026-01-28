import { test, expect } from "bun:test"
import { pcb_panelization_placement_error } from "../src/pcb/pcb_panelization_placement_error"
import { any_circuit_element } from "../src/any_circuit_element"

test("pcb_panelization_placement_error parses", () => {
  const error = pcb_panelization_placement_error.parse({
    type: "pcb_panelization_placement_error",
    message: "panelized board placement failed",
    pcb_panel_id: "pcb_panel_1",
    pcb_board_id: "pcb_board_1",
  })

  expect(error.pcb_panelization_placement_error_id).toBeDefined()
  expect(
    error.pcb_panelization_placement_error_id.startsWith(
      "pcb_panelization_placement_error",
    ),
  ).toBe(true)
  expect(error.pcb_panel_id).toBe("pcb_panel_1")
  expect(error.pcb_board_id).toBe("pcb_board_1")
})

test("any_circuit_element includes pcb_panelization_placement_error", () => {
  const parsed = any_circuit_element.parse({
    type: "pcb_panelization_placement_error",
    message: "panelized board placement failed",
  })

  expect(parsed.type).toBe("pcb_panelization_placement_error")
})
