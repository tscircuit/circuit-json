import { test, expect } from "bun:test"
import { pcb_group } from "../src/pcb/pcb_group"

test("pcb_group with anchor_position and anchor_alignment", () => {
  const group = pcb_group.parse({
    type: "pcb_group",
    source_group_id: "g1",
    width: 10,
    height: 10,
    center: { x: 0, y: 0 },
    pcb_component_ids: [],
    anchor_position: { x: 5, y: 5 },
    anchor_alignment: "top_left",
  })

  expect(group.anchor_position).toEqual({ x: 5, y: 5 })
  expect(group.anchor_alignment).toBe("top_left")
})
