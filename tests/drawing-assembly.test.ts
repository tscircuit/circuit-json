import { expect, test } from "bun:test"
import {
  any_circuit_element,
  drawing_assembly_stage,
  drawing_part_label,
  drawing_page_note,
  drawing_part_view,
  drawing_explosion_view,
  drawing_dimension_line,
} from "../src"
test("assembly drawing records round-trip through the public union and reject invalid scalar configuration", () => {
  const stage = {
    type: "drawing_assembly_stage" as const,
    drawing_assembly_stage_id: "rotor",
    name: "Rotor",
    source_component_ids: ["cap", "bearing"],
    includes_stage_ids: ["encoder"],
  }
  const pose = {
    moves: [
      { includes_stage_ids: ["rotor"], translation: { x: 0, y: 0, z: 40 } },
    ],
    factor: 0.5,
    show_trails: true,
  }
  const view = {
    type: "drawing_explosion_view" as const,
    drawing_explosion_view_id: "v",
    drawing_page_id: "p",
    drawing_assembly_stage_id: "rotor",
    ...pose,
    direction: "isometric" as const,
    center: { x: 0, y: 0 },
    width: 90,
    height: 80,
  }
  const label = {
    type: "drawing_part_label" as const,
    drawing_part_label_id: "label",
    drawing_explosion_view_id: "v",
    source_component_ids: ["cap"],
    anchor: { x: 0, y: 0, z: 2 },
    label_position: { x: 60, y: 30 },
    text: "Cap <A>",
  }
  const note = {
    type: "drawing_page_note" as const,
    drawing_page_note_id: "note",
    drawing_page_id: "p",
    text: "Seat rotor",
    position: { x: 0, y: 40 },
    font_size: 3,
  }
  for (const r of [stage, view, label, note])
    expect(any_circuit_element.parse(r)).toEqual(r)
  expect(
    drawing_assembly_stage.safeParse({
      ...stage,
      source_component_ids: undefined,
      includes_stage_ids: undefined,
    }).success,
  ).toBe(false)
  expect(
    drawing_assembly_stage.safeParse({ ...stage, source_component_ids: [] })
      .success,
  ).toBe(false)
  expect(
    drawing_assembly_stage.safeParse({ ...stage, pcb_board_ids: [" "] })
      .success,
  ).toBe(false)
  for (const factor of [-1, 1.01, NaN, Infinity])
    expect(drawing_explosion_view.safeParse({ ...view, factor }).success).toBe(
      false,
    )
  expect(drawing_explosion_view.safeParse({ ...view, moves: [] }).success).toBe(
    false,
  )
  expect(
    drawing_explosion_view.safeParse({
      ...view,
      moves: [{ translation: { x: 0, y: 0, z: 1 } }],
    }).success,
  ).toBe(false)
  expect(
    drawing_explosion_view.safeParse({
      ...view,
      moves: [
        {
          includes_stage_ids: ["rotor"],
          translation: { x: 0, y: Infinity, z: 1 },
        },
      ],
    }).success,
  ).toBe(false)
  expect(
    drawing_explosion_view.safeParse({ ...view, source_component_ids: ["cap"] })
      .success,
  ).toBe(false)
  expect(
    drawing_explosion_view.safeParse({ ...view, source_group_id: "g" }).success,
  ).toBe(false)
  expect(drawing_part_label.safeParse({ ...label, text: " " }).success).toBe(
    false,
  )
  expect(drawing_page_note.safeParse({ ...note, font_size: 0 }).success).toBe(
    false,
  )
  for (const field of ["moves", "drawing_assembly_stage_id"]) {
    expect(
      drawing_explosion_view.safeParse({ ...view, [field]: undefined }).success,
    ).toBe(false)
    expect(
      drawing_explosion_view.safeParse({ ...view, [field]: " " }).success,
    ).toBe(false)
  }
  expect(
    drawing_part_view.safeParse({
      ...view,
      type: "drawing_part_view",
      drawing_part_view_id: "v",
    }).success,
  ).toBe(false)
  const line = {
    type: "drawing_dimension_line" as const,
    drawing_dimension_line_id: "d",
    drawing_explosion_view_id: "v",
    start: { x: 0, y: 0 },
    end: { x: 5, y: 0 },
    text: "5 mm",
  }
  expect(any_circuit_element.parse(line)).toEqual(line)
  for (const [schema, annotation] of [
    [drawing_part_label, label],
    [drawing_dimension_line, line],
  ] as const) {
    expect(
      schema.safeParse({ ...annotation, drawing_explosion_view_id: undefined })
        .success,
    ).toBe(false)
    expect(
      schema.safeParse({ ...annotation, drawing_part_view_id: "v" }).success,
    ).toBe(false)
  }
  expect(
    any_circuit_element.safeParse({
      type: "drawing_explosion",
      drawing_explosion_id: "old",
      ...pose,
    }).success,
  ).toBe(false)
  expect(
    drawing_explosion_view.safeParse({ ...view, drawing_explosion_id: "old" })
      .success,
  ).toBe(false)
  expect(
    drawing_explosion_view.parse({ ...view, factor: 0, show_trails: false }),
  ).toMatchObject({ factor: 0, show_trails: false })
  // Record schemas deliberately leave graph/reference validation to document consumers.
  expect(
    drawing_assembly_stage.parse({ ...stage, includes_stage_ids: ["rotor"] }),
  ).toBeDefined()
})
