import { test, expect } from "bun:test"
import { pcb_group } from "../src/pcb/pcb_group"

// Test autorouter_configuration optional and shape

test("pcb_group.autorouter_configuration.trace_clearance parses", () => {
  const group = pcb_group.parse({
    type: "pcb_group",
    source_group_id: "g1",
    center: { x: 0, y: 0 },
    width: 10,
    height: 10,
    pcb_component_ids: [],
    autorouter_configuration: { trace_clearance: 0.2 },
  })
  expect(group.autorouter_configuration?.trace_clearance).toBe(0.2)
})

test("pcb_group.autorouter_used_string is optional", () => {
  const group = pcb_group.parse({
    type: "pcb_group",
    source_group_id: "g1",
    center: { x: 0, y: 0 },
    width: 10,
    height: 10,
    pcb_component_ids: [],
  })
  expect(group.autorouter_used_string).toBeUndefined()
})

test("pcb_group.layout_mode is optional string", () => {
  const group = pcb_group.parse({
    type: "pcb_group",
    source_group_id: "g1",
    center: { x: 0, y: 0 },
    width: 10,
    height: 10,
    pcb_component_ids: [],
    layout_mode: "manual",
  })
  expect(group.layout_mode).toBe("manual")

  const withoutLayoutMode = pcb_group.parse({
    type: "pcb_group",
    source_group_id: "g1",
    center: { x: 0, y: 0 },
    pcb_component_ids: [],
  })
  expect(withoutLayoutMode.layout_mode).toBeUndefined()
})

test("pcb_group allows width and height to be omitted when outline is provided", () => {
  const group = pcb_group.parse({
    type: "pcb_group",
    source_group_id: "g1",
    center: { x: 0, y: 0 },
    outline: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ],
    pcb_component_ids: [],
  })

  expect(group.width).toBeUndefined()
  expect(group.height).toBeUndefined()
  expect(group.outline?.length).toBe(4)
})
