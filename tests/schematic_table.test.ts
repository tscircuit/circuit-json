import { test, expect } from "bun:test"
import { schematic_table } from "../src/schematic/schematic_table"

test("schematic_table parse", () => {
  const table = schematic_table.parse({
    type: "schematic_table",
    schematic_table_id: "table1",
    position: { x: 0, y: 0 },
    schematic_table_cell_ids: [
      ["cell1", "cell2"],
      ["cell3", "cell4"],
    ],
    column_widths: [5, 5],
    row_heights: [2, 2],
  })
  expect(table.type).toBe("schematic_table")
  expect(table.schematic_table_cell_ids.length).toBe(2)
  expect(table.schematic_table_cell_ids[0]!.length).toBe(2)
  expect(table.schematic_table_cell_ids[0]![0]).toBe("cell1")
  expect(table.schematic_table_id).toBe("table1")
})
