import { expect, test } from "bun:test"
import { schematic_table } from "../src/schematic/schematic_table"

test("schematic_table parse", () => {
  const table = schematic_table.parse({
    type: "schematic_table",
    schematic_table_id: "table1",
    anchor_position: { x: 0, y: 0 },
    column_widths: [5, 5],
    row_heights: [2, 2],
  })
  expect(table.type).toBe("schematic_table")
  expect(table.column_widths.length).toBe(2)
  expect(table.row_heights.length).toBe(2)
  expect(table.schematic_table_id).toBe("table1")
})
