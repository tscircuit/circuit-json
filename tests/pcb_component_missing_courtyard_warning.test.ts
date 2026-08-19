import { expect, test } from "bun:test"
import { any_circuit_element } from "src/any_circuit_element"
import { pcb_component_missing_courtyard_warning } from "src/pcb/pcb_component_missing_courtyard_warning"

const warningInput = {
  type: "pcb_component_missing_courtyard_warning" as const,
  message: "U1 has no courtyard",
  pcb_component_id: "pcb_component_1",
  source_component_id: "source_component_1",
  subcircuit_id: "subcircuit_1",
}

test("pcb_component_missing_courtyard_warning parses", () => {
  const warning = pcb_component_missing_courtyard_warning.parse(warningInput)

  expect(warning.pcb_component_missing_courtyard_warning_id).toStartWith(
    "pcb_component_missing_courtyard_warning",
  )
  expect(warning.warning_type).toBe("pcb_component_missing_courtyard_warning")
  expect(warning.pcb_component_id).toBe("pcb_component_1")
  expect(warning.source_component_id).toBe("source_component_1")
  expect(warning.subcircuit_id).toBe("subcircuit_1")
})

test("any_circuit_element includes pcb_component_missing_courtyard_warning", () => {
  const warning = any_circuit_element.parse(warningInput)

  expect(warning.type).toBe("pcb_component_missing_courtyard_warning")
})
