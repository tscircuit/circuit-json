import { test, expect } from "bun:test"
import { schematic_port } from "../src/schematic/schematic_port"

test("schematic_port.is_intentionally_not_connected defaults to undefined", () => {
  const port = schematic_port.parse({
    type: "schematic_port",
    schematic_port_id: "sp1",
    source_port_id: "p1",
    center: { x: 0, y: 0 },
  })
  expect(port.is_intentionally_not_connected).toBeUndefined()
})

test("schematic_port.is_intentionally_not_connected can be true", () => {
  const port = schematic_port.parse({
    type: "schematic_port",
    schematic_port_id: "sp2",
    source_port_id: "p2",
    center: { x: 1, y: 1 },
    is_intentionally_not_connected: true,
  })
  expect(port.is_intentionally_not_connected).toBe(true)
})
