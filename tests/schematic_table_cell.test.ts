import { expect, test } from "bun:test"
import { schematic_table_cell } from "../src/schematic/schematic_table_cell"

test("schematic_table_cell parse", () => {
  const cell = schematic_table_cell.parse({
    type: "schematic_table_cell",
    schematic_table_id: "table1",
    start_row_index: 0,
    end_row_index: 0,
    start_column_index: 0,
    end_column_index: 0,
    text: "A1",
    center: { x: 1, y: 1 },
    width: 10,
    height: 5,
  })
  expect(cell.type).toBe("schematic_table_cell")
  expect(cell.text).toBe("A1")
  expect(cell.schematic_table_cell_id).toBeString()
  expect(cell.width).toBe(10)
  expect(cell.height).toBe(5)
  expect(cell.center).toEqual({ x: 1, y: 1 })
})
