import { expect, test } from "bun:test"
import { schematic_component } from "../src/schematic/schematic_component"

test("schematic_component accepts schematic_pin_arrangement with string pins", () => {
  const parsed = schematic_component.parse({
    type: "schematic_component",
    schematic_component_id: "schem_comp_1",
    size: { width: 10, height: 10 },
    center: { x: 0, y: 0 },
    is_box_with_pins: true,
    schematic_box_port_alias_map: { D1: "source_port_1" },
    schematic_pin_arrangement: {
      left_side: {
        pins: ["D1"],
      },
    },
  })

  const arrangement = parsed.schematic_pin_arrangement
  if (!arrangement || !("left_side" in arrangement)) {
    throw new Error("expected left_side pins to be present")
  }

  expect(arrangement.left_side?.pins).toEqual(["D1"])
  expect(parsed.schematic_box_port_alias_map?.D1).toBe("source_port_1")
})
