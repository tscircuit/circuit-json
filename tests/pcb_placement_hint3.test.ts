import { test, expect } from "bun:test"
import { any_circuit_element } from "src/any_circuit_element"

test("any_circuit_element includes pcb_placement_hint", () => {
  const data = {
    type: "pcb_placement_hint",
    pcb_placement_hint_id: "pcb_placement_hint_1",
    pcb_component_id: "pcb_component_1",
    target_pcb_port_id: "pcb_port_5",
  }

  expect(() => any_circuit_element.parse(data)).not.toThrow()
})
