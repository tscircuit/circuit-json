import { expect, test } from "bun:test"
import { source_group } from "../src/source/source_group"
import type { SchematicPortArrangementBySides } from "../src/schematic/schematic_component"

test("source_group supports schematic box alias map and pin arrangement", () => {
  const parsed = source_group.parse({
    type: "source_group",
    source_group_id: "group_1",
    schematic_box_port_alias_map: { D1: "source_port_1" },
    schematic_box_pin_arrangement: {
      left_side: {
        pins: ["D1"],
      },
    },
  })

  expect(parsed.schematic_box_port_alias_map?.D1).toBe("source_port_1")

  const arrangement = parsed.schematic_box_pin_arrangement
  if (!arrangement || !("left_side" in arrangement)) {
    throw new Error("expected left_side arrangement to exist")
  }

  const sides = arrangement as SchematicPortArrangementBySides
  expect(sides.left_side?.pins).toEqual(["D1"])
})
