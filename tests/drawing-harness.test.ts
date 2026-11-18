import { expect, test } from "bun:test"
import {
  any_circuit_element,
  drawing_balloon,
  drawing_harness_view,
  drawing_table,
  drawing_table_cell,
} from "../src"

test("harness drawing records round-trip through the public union and reject invalid configuration", () => {
  const view = {
    type: "drawing_harness_view" as const,
    drawing_harness_view_id: "harness",
    drawing_page_id: "page",
    cad_cable_id: "cad_cable_1",
    center: { x: 0, y: 30 },
    width: 200,
    height: 70,
    scale: 3,
  }
  const table = {
    type: "drawing_table" as const,
    drawing_table_id: "bom",
    drawing_page_id: "page",
    anchor_position: { x: -143, y: -100 },
    anchor_alignment: "bottom_left" as const,
    column_widths: [10, 76, 14],
    row_heights: [6, 6],
  }
  const cell = {
    type: "drawing_table_cell" as const,
    drawing_table_cell_id: "bom_title",
    drawing_table_id: "bom",
    start_row_index: 0,
    end_row_index: 0,
    start_column_index: 0,
    end_column_index: 2,
    text: "PARTS LIST",
    horizontal_align: "left" as const,
    font_size: 2.2,
  }
  const balloon = {
    type: "drawing_balloon" as const,
    drawing_balloon_id: "balloon_from",
    drawing_harness_view_id: "harness",
    texts: ["3", "2"],
    harness_target: "from_connector" as const,
    anchor_position: { x: -80, y: 60 },
    anchor_alignment: "bottom_right" as const,
  }
  for (const record of [view, table, cell, balloon])
    expect(any_circuit_element.parse(record)).toEqual(record)

  for (const invalid of [
    { width: 0 },
    { scale: -1 },
    { cad_cable_id: "" },
    { center: { x: 0 } },
  ])
    expect(
      drawing_harness_view.safeParse({ ...view, ...invalid }).success,
    ).toBe(false)
  // A table's position is never implied: both anchor fields are required.
  for (const invalid of [
    { anchor_position: undefined },
    { anchor_alignment: undefined },
    { anchor_alignment: "left" },
    { anchor_position: { x: 0, y: Number.POSITIVE_INFINITY } },
    { column_widths: [] },
    { column_widths: [10, 0] },
    { row_heights: [-6] },
  ])
    expect(drawing_table.safeParse({ ...table, ...invalid }).success).toBe(
      false,
    )
  for (const invalid of [
    { text: undefined },
    { start_row_index: -1 },
    { end_column_index: 1.5 },
    { start_column_index: 2, end_column_index: 1 },
    { start_row_index: 1, end_row_index: 0 },
    { horizontal_align: "middle" },
    { font_size: 0 },
    { drawing_table_id: " " },
  ])
    expect(drawing_table_cell.safeParse({ ...cell, ...invalid }).success).toBe(
      false,
    )
  for (const invalid of [
    { texts: [] },
    { texts: ["3", " "] },
    { harness_target: "fromConnector" },
    { drawing_harness_view_id: " " },
    { anchor_position: undefined },
    { anchor_alignment: undefined },
  ])
    expect(drawing_balloon.safeParse({ ...balloon, ...invalid }).success).toBe(
      false,
    )
})
