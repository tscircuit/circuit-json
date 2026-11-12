import { expect, test } from "bun:test"
import {
  any_circuit_element,
  drawing_page,
  drawing_page_note,
  drawing_part_label,
} from "../src"

test("drawing origins and view-relative annotation positions round-trip with scalar validation", () => {
  const page = {
    type: "drawing_page" as const,
    drawing_page_id: "p",
    width: 200,
    height: 140,
    origin: { x: 0, y: 0 },
  }
  const label = {
    type: "drawing_part_label" as const,
    drawing_part_label_id: "l",
    drawing_explosion_view_id: "v",
    source_component_ids: ["cap"],
    text: "Cap",
    anchor: { x: 0, y: 0, z: 0 },
    x_offset_from_view_center: -50,
    y_offset_from_view_center: 20,
  }
  const note = {
    type: "drawing_page_note" as const,
    drawing_page_note_id: "n",
    drawing_page_id: "p",
    drawing_explosion_view_id: "v",
    text: "Join",
    position: { x: 20 },
    y_offset_from_view_center: -30,
  }
  for (const r of [page, label, note])
    expect(any_circuit_element.parse(r)).toEqual(r)
  for (const bad of [NaN, Infinity])
    expect(
      drawing_page.safeParse({ ...page, origin: { x: bad, y: 0 } }).success,
    ).toBe(false)
  expect(
    drawing_part_label.safeParse({ ...label, label_position: { x: 0 } })
      .success,
  ).toBe(false)
  expect(
    drawing_part_label.safeParse({
      ...label,
      x_offset_from_view_center: undefined,
    }).success,
  ).toBe(false)
  expect(
    drawing_part_label.safeParse({
      ...label,
      x_offset_from_view_center: Infinity,
    }).success,
  ).toBe(false)
  expect(
    drawing_page_note.safeParse({
      ...note,
      drawing_explosion_view_id: undefined,
    }).success,
  ).toBe(false)
  expect(
    drawing_page_note.safeParse({ ...note, drawing_part_view_id: "other" })
      .success,
  ).toBe(false)
  expect(
    drawing_page_note.safeParse({ ...note, position: { x: 20, y: 0 } }).success,
  ).toBe(false)
  expect(
    drawing_page_note.safeParse({ ...note, position: undefined }).success,
  ).toBe(false)
  expect(
    drawing_page_note.parse({
      ...note,
      drawing_explosion_view_id: undefined,
      y_offset_from_view_center: undefined,
      position: { x: 20, y: 30 },
    }),
  ).toBeDefined()
})
