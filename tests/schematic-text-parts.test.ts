import { expect, test } from "bun:test"
import { schematic_text } from "src/schematic/schematic_text"

test("schematic text preserves overlined parts and a plain-text fallback", () => {
  const text = schematic_text.parse({
    type: "schematic_text",
    schematic_text_id: "text_1",
    text: "RI/CLK",
    position: { x: 0, y: 0 },
    text_parts: [{ text: "RI", is_overlined: true }, { text: "/CLK" }],
  })
  expect(text.text_parts).toEqual([
    { text: "RI", is_overlined: true },
    { text: "/CLK" },
  ])
  expect(schematic_text.safeParse({ ...text, text_parts: [] }).success).toBe(
    false,
  )
  expect(schematic_text.parse({ ...text, text_parts: undefined }).text).toBe(
    "RI/CLK",
  )
})
