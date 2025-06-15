import { test, expect } from "bun:test"
import { schematic_box } from "../src/schematic/schematic_box"

test("schematic_box.schematic_component_id is optional", () => {
  const boxWithId = schematic_box.parse({
    type: "schematic_box",
    schematic_component_id: "box1",
    width: 10,
    height: 5,
    x: 0,
    y: 0,
  })
  expect(boxWithId.schematic_component_id).toBe("box1")

  const boxWithoutId = schematic_box.parse({
    type: "schematic_box",
    width: 5,
    height: 5,
    x: 1,
    y: 1,
  })
  expect(boxWithoutId.schematic_component_id).toBeUndefined()
})
