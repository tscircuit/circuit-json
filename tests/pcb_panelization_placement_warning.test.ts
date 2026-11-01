import { test, expect } from "bun:test"
import { pcb_panelization_placement_warning } from "../src/pcb/pcb_panelization_placement_warning"
import { any_circuit_element } from "../src/any_circuit_element"

test("pcb_panelization_placement_warning parses", () => {
  const warning = pcb_panelization_placement_warning.parse({
    type: "pcb_panelization_placement_warning",
    message: "panelized board placement has minor issues",
    pcb_panel_id: "pcb_panel_1",
    pcb_board_id: "pcb_board_1",
  })

  expect(warning.pcb_panelization_placement_warning_id).toBeDefined()
  expect(
    warning.pcb_panelization_placement_warning_id.startsWith(
      "pcb_panelization_placement_warning",
    ),
  ).toBe(true)
  expect(warning.pcb_panel_id).toBe("pcb_panel_1")
  expect(warning.pcb_board_id).toBe("pcb_board_1")
})

test("any_circuit_element includes pcb_panelization_placement_warning", () => {
  const parsed = any_circuit_element.parse({
    type: "pcb_panelization_placement_warning",
    message: "panelized board placement has minor issues",
  })

  expect(parsed.type).toBe("pcb_panelization_placement_warning")
})
