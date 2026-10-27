import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_fabrication_note_path } from "../src/pcb/pcb_fabrication_note_path"
import { pcb_fabrication_note_text } from "../src/pcb/pcb_fabrication_note_text"

test("fabrication polarity metadata survives parsing without changing legacy notes", () => {
  const common = { pcb_component_id: "component", layer: "top" }
  const cases = [
    {
      schema: pcb_fabrication_note_path,
      note: {
        ...common,
        type: "pcb_fabrication_note_path",
        route: [
          { x: 0, y: 0 },
          { x: 0, y: 1 },
        ],
        stroke_width: 0.1,
      },
    },
    {
      schema: pcb_fabrication_note_text,
      note: { ...common, type: "pcb_fabrication_note_text", text: "K" },
    },
  ]
  for (const { schema, note } of cases) {
    for (const is_polarity_marking of [true, false, undefined]) {
      const parsed = schema.parse({ ...note, is_polarity_marking })
      if (is_polarity_marking === undefined) {
        expect(parsed.is_polarity_marking).toBeUndefined()
      } else {
        expect(parsed.is_polarity_marking).toBe(is_polarity_marking)
      }
      expect(schema.parse(JSON.parse(JSON.stringify(parsed)))).toEqual(parsed)
      expect(
        any_circuit_element.parse(JSON.parse(JSON.stringify(parsed))),
      ).toEqual(parsed)
    }
    expect(schema.parse(note).is_polarity_marking).toBeUndefined()
    expect(
      schema.safeParse({ ...note, is_polarity_marking: "true" }).success,
    ).toBe(false)
  }
})
