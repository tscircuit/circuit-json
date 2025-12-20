import { expect, test } from "bun:test"
import { pcb_panel } from "src/pcb/pcb_panel"
import { any_circuit_element } from "src/any_circuit_element"

test("pcb_panel parses and defaults covered_with_solder_mask", () => {
  const panelData = {
    type: "pcb_panel" as const,
    pcb_panel_id: "pcb_panel_1",
    width: "100mm",
    height: "200mm",
    center: { x: 0, y: 0 },
  }

  const parsed = pcb_panel.parse(panelData)

  expect(parsed.covered_with_solder_mask).toBe(true)
})

test("any_circuit_element includes pcb_panel", () => {
  const panelData = {
    type: "pcb_panel" as const,
    pcb_panel_id: "pcb_panel_1",
    width: "100mm",
    height: "200mm",
    center: { x: 0, y: 0 },
    covered_with_solder_mask: false,
  }

  expect(() => any_circuit_element.parse(panelData)).not.toThrow()
})
