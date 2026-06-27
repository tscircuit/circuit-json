import { test, expect } from "bun:test"
import { pcb_placement_hint } from "src/pcb/pcb_placement_hint"

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
