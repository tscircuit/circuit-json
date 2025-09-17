import { test, expect } from "bun:test"
import { schematic_component } from "../src/schematic/schematic_component"

test("schematic_component.symbol_name accepts symbol_name string", () => {
  const sc = schematic_component.parse({
    type: "schematic_component",
    schematic_component_id: "schematic_component_2",
    source_component_id: "source_component_1",
    center: { x: 0, y: 0 },
    rotation: 0,
    size: { width: 10, height: 5 },
    symbol_name: "resistor",
  })
  expect(sc.symbol_name).toBe("resistor")
})
