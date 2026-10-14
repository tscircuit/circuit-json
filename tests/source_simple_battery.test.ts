import { test, expect } from "bun:test"
import { source_simple_battery } from "../src/source/source_simple_battery"

test("source_simple_battery parses voltage", () => {
  const battery = source_simple_battery.parse({
    type: "source_component",
    ftype: "simple_battery",
    source_component_id: "B1",
    name: "B1",
    capacity: 2200,
    voltage: 3.7,
  })

  expect(battery.voltage).toBe(3.7)
})
