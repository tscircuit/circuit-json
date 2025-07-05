import { test, expect } from "bun:test"
import { schematic_table } from "../src/schematic/schematic_table"

test("schematic_table parse", () => {
  const table = schematic_table.parse({
    type: "schematic_table",
    schematic_table_id: "table1",
    position: { x: 0, y: 0 },
    rows: [
      [{ text: "A1" }, { text: "B1" }],
      [{ text: "A2" }, { text: "B2" }],
    ],
    column_widths: [5, 5],
    row_heights: [2, 2],
  })
  expect(table.type).toBe("schematic_table")
  expect(table.rows.length).toBe(2)
  expect(table.rows[0]!.length).toBe(2)
  expect(table.rows[0]![0]!.text).toBe("A1")
  expect(table.schematic_table_id).toBeString()
})
