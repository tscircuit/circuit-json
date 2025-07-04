import { test, expect } from "bun:test"
import { pcb_group } from "../src/pcb/pcb_group"

// Test autorouter_configuration optional and shape

test("pcb_group.autorouter_configuration.trace_clearance parses", () => {
  const group = pcb_group.parse({
    type: "pcb_group",
    source_group_id: "g1",
    width: 10,
    height: 10,
    center: { x: 0, y: 0 },
    pcb_component_ids: [],
    autorouter_configuration: { trace_clearance: 0.2 },
  })
  expect(group.autorouter_configuration?.trace_clearance).toBe(0.2)
})

test("pcb_group.autorouter_used_string is optional", () => {
  const group = pcb_group.parse({
    type: "pcb_group",
    source_group_id: "g1",
    width: 10,
    height: 10,
    center: { x: 0, y: 0 },
    pcb_component_ids: [],
  })
  expect(group.autorouter_used_string).toBeUndefined()
})
