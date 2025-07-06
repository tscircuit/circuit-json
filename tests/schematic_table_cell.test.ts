import { test, expect } from "bun:test"
import { schematic_table_cell } from "../src/schematic/schematic_table_cell"

test("schematic_table_cell parse", () => {
  const cell = schematic_table_cell.parse({
    type: "schematic_table_cell",
    schematic_table_id: "table1",
    row_index: 0,
    column_index: 0,
    text: "A1",
  })
  expect(cell.type).toBe("schematic_table_cell")
  expect(cell.text).toBe("A1")
  expect(cell.schematic_table_cell_id).toBeString()
})
