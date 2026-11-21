import { expect, test } from "bun:test"
import { schematic_path } from "../src/schematic/schematic_path"

test("schematic paths preserve local geometry independently of placed points", () => {
  const local = { x: 0.374283, y: 0.07219 }
  const path = {
    type: "schematic_path",
    schematic_component_id: "schematic_component_1",
    schematic_symbol_id: "schematic_symbol_1",
    points: [{ x: local.x + 2.205, y: local.y - 2.55 }],
    symbol_local_points: [local],
  }
  const parsed = schematic_path.parse(JSON.parse(JSON.stringify(path)))
  expect(parsed.symbol_local_points).toEqual([local])
  expect(parsed.points[0]!.y + 2.55).not.toBe(local.y)
  expect(
    schematic_path.parse({ type: "schematic_path", points: path.points }),
  ).not.toHaveProperty("symbol_local_points")
  expect(
    schematic_path.safeParse({ ...path, symbol_local_points: [{ x: 0 }] })
      .success,
  ).toBe(false)
})
