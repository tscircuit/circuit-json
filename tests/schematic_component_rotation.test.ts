import { expect, test } from "bun:test"
import { schematic_component } from "../src/schematic/schematic_component"

const schematicComponent = {
  type: "schematic_component",
  schematic_component_id: "schematic_component_0",
  center: { x: 0, y: 0 },
  size: { width: 2, height: 1 },
  is_box_with_pins: false,
}

test("schematic components retain counterclockwise rotation metadata in degrees", () => {
  for (const ccwRotationDegrees of [0, 90, 180, 270]) {
    expect(
      schematic_component.parse({
        ...schematicComponent,
        rotation: ccwRotationDegrees,
      }),
    ).toHaveProperty("rotation", ccwRotationDegrees)
  }
})

test("schematic components without rotation remain valid", () => {
  expect(schematic_component.parse(schematicComponent)).not.toHaveProperty(
    "rotation",
  )
})
