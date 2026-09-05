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

test("display_superscript is an optional display-only string", () => {
  const input = {
    type: "schematic_net_label",
    source_net_id: "net_gnd",
    center: { x: 0, y: 0 },
    anchor_side: "left",
    text: "GND",
  }
  for (const suffix of [undefined, "", "1", "12", "A"]) {
    const label = schematic_net_label.parse({
      ...input,
      display_superscript: suffix,
    })
    expect(label.display_superscript).toBe(suffix)
    expect(label.text).toBe("GND")
    expect(label.source_net_id).toBe("net_gnd")
  }
  expect(
    schematic_net_label.safeParse({ ...input, display_superscript: 1 }).success,
  ).toBe(false)
})
