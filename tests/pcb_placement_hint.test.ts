import { test, expect } from "bun:test"
import { pcb_placement_hint } from "src/pcb/pcb_placement_hint"
import { any_circuit_element } from "src/any_circuit_element"

test("pcb_placement_hint parses with all fields", () => {
  const data = {
    type: "pcb_placement_hint",
    pcb_placement_hint_id: "pcb_placement_hint_1",
    pcb_component_id: "pcb_component_1",
    target_pcb_port_id: "pcb_port_5",
    facing_pcb_port_id: "pcb_port_10",
    max_distance: "2mm",
    is_satisfied: false,
    subcircuit_id: "subcircuit_1",
  }

  const parsed = pcb_placement_hint.parse(data)

  expect(parsed.type).toBe("pcb_placement_hint")
  expect(parsed.pcb_component_id).toBe("pcb_component_1")
  expect(parsed.target_pcb_port_id).toBe("pcb_port_5")
  expect(parsed.facing_pcb_port_id).toBe("pcb_port_10")
  expect(parsed.max_distance).toBeCloseTo(0.002)
  expect(parsed.is_satisfied).toBe(false)
})

test("pcb_placement_hint parses without optional fields", () => {
  const data = {
    type: "pcb_placement_hint",
    pcb_component_id: "pcb_component_1",
    target_pcb_port_id: "pcb_port_5",
  }

  const parsed = pcb_placement_hint.parse(data)

  expect(parsed.type).toBe("pcb_placement_hint")
  expect(parsed.pcb_component_id).toBe("pcb_component_1")
  expect(parsed.target_pcb_port_id).toBe("pcb_port_5")
  expect(parsed.facing_pcb_port_id).toBeUndefined()
  expect(parsed.max_distance).toBeUndefined()
  expect(parsed.is_satisfied).toBeUndefined()
})

test("any_circuit_element includes pcb_placement_hint", () => {
  const data = {
    type: "pcb_placement_hint",
    pcb_placement_hint_id: "pcb_placement_hint_1",
    pcb_component_id: "pcb_component_1",
    target_pcb_port_id: "pcb_port_5",
  }

  expect(() => any_circuit_element.parse(data)).not.toThrow()
})
