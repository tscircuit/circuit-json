import { test, expect } from "bun:test"
import { schematic_net_label } from "../src/schematic/schematic_net_label"

test("schematic_net_label.is_movable defaults to undefined", () => {
  const label = schematic_net_label.parse({
    type: "schematic_net_label",
    source_net_id: "net1",
    center: { x: 0, y: 0 },
    anchor_side: "top",
    text: "NET1",
  })
  expect(label.is_movable).toBeUndefined()
})

test("schematic_net_label.is_movable can be false", () => {
  const label = schematic_net_label.parse({
    type: "schematic_net_label",
    source_net_id: "net1",
    center: { x: 0, y: 0 },
    anchor_side: "top",
    text: "NET1",
    is_movable: false,
  })
  expect(label.is_movable).toBe(false)
})
