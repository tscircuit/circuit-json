import { expect, test } from "bun:test"
import {
  any_circuit_element,
  drawing_assembly_stage,
  drawing_explosion,
  drawing_part_label,
  drawing_page_note,
  drawing_part_view,
} from "../src"
test("assembly drawing records round-trip through the public union and reject invalid scalar configuration", () => {
  const stage = {
    type: "drawing_assembly_stage" as const,
    drawing_assembly_stage_id: "rotor",
    name: "Rotor",
    source_component_ids: ["cap", "bearing"],
    includes_stage_ids: ["encoder"],
  }
  const explosion = {
    type: "drawing_explosion" as const,
    drawing_explosion_id: "join",
    moves: [
      { includes_stage_ids: ["rotor"], translation: { x: 0, y: 0, z: 40 } },
    ],
    factor: 0.5,
    show_trails: true,
  }
  const view = {
    type: "drawing_part_view" as const,
    drawing_part_view_id: "v",
    drawing_page_id: "p",
    drawing_assembly_stage_id: "rotor",
    drawing_explosion_id: "join",
    direction: "isometric" as const,
    center: { x: 0, y: 0 },
    width: 90,
    height: 80,
  }
  const label = {
    type: "drawing_part_label" as const,
    drawing_part_label_id: "label",
    drawing_part_view_id: "v",
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
  for (const r of [stage, explosion, view, label, note])
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
    expect(drawing_explosion.safeParse({ ...explosion, factor }).success).toBe(
      false,
    )
  expect(drawing_explosion.safeParse({ ...explosion, moves: [] }).success).toBe(
    false,
  )
  expect(
    drawing_explosion.safeParse({
      ...explosion,
      moves: [{ translation: { x: 0, y: 0, z: 1 } }],
    }).success,
  ).toBe(false)
  expect(
    drawing_explosion.safeParse({
      ...explosion,
      moves: [
        {
          includes_stage_ids: ["rotor"],
          translation: { x: 0, y: Infinity, z: 1 },
        },
      ],
    }).success,
  ).toBe(false)
  expect(
    drawing_part_view.safeParse({ ...view, source_component_ids: ["cap"] })
      .success,
  ).toBe(false)
  expect(
    drawing_part_view.safeParse({ ...view, source_group_id: "g" }).success,
  ).toBe(false)
  expect(drawing_part_label.safeParse({ ...label, text: " " }).success).toBe(
    false,
  )
  expect(drawing_page_note.safeParse({ ...note, font_size: 0 }).success).toBe(
    false,
  )
  // Record schemas deliberately leave graph/reference validation to document consumers.
  expect(
    drawing_assembly_stage.parse({ ...stage, includes_stage_ids: ["rotor"] }),
  ).toBeDefined()
})
