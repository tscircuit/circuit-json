import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_component_inside_silkscreen_warning } from "../src/pcb/pcb_component_inside_silkscreen_warning"

const warningInput = {
  type: "pcb_component_inside_silkscreen_warning" as const,
  message: "PCB component R1 is inside the silkscreen bounds of U1",
  pcb_component_ids: ["pcb_component_r1", "pcb_component_u1"] as [
    string,
    string,
  ],
  pcb_board_id: "pcb_board_0",
  subcircuit_id: "subcircuit_0",
}

test("pcb_component_inside_silkscreen_warning parses", () => {
  const warning = pcb_component_inside_silkscreen_warning.parse(warningInput)

  expect(warning.pcb_component_inside_silkscreen_warning_id).toStartWith(
    "pcb_component_inside_silkscreen_warning_",
  )
  expect(warning.warning_type).toBe("pcb_component_inside_silkscreen_warning")
  expect(warning.pcb_component_ids).toEqual([
    "pcb_component_r1",
    "pcb_component_u1",
  ])
})

test("any_circuit_element includes pcb_component_inside_silkscreen_warning", () => {
  const parsed = any_circuit_element.parse(warningInput)

  expect(parsed.type).toBe("pcb_component_inside_silkscreen_warning")
})
