import { expect, test } from "bun:test"
import { schematic_component } from "../src/schematic/schematic_component"

test("schematic_component still accepts legacy port_arrangement", () => {
  const parsed = schematic_component.parse({
    type: "schematic_component",
    schematic_component_id: "schem_comp_legacy",
    size: { width: 10, height: 10 },
    center: { x: 0, y: 0 },
    is_box_with_pins: true,
    port_arrangement: {
      left_side: {
        pins: [1, 2, 3],
      },
    },
  })

  expect(parsed.port_arrangement).toBeDefined()
})
