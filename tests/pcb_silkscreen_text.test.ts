import { expect, test } from "bun:test"
import { pcb_silkscreen_text } from "../src"

const baseSilkscreenText = {
  type: "pcb_silkscreen_text" as const,
  pcb_silkscreen_text_id: "pcb_silkscreen_text_0",
  pcb_component_id: "pcb_component_0",
  font: "tscircuit2024" as const,
  font_size: 1,
  text: "R1",
  layer: "top" as const,
  anchor_position: { x: 0, y: 0 },
  anchor_alignment: "center" as const,
}

test("preserves silkscreen text visibility metadata", () => {
  expect(
    pcb_silkscreen_text.parse({
      ...baseSilkscreenText,
      is_visible: false,
    }).is_visible,
  ).toBe(false)
  expect(
    pcb_silkscreen_text.parse(baseSilkscreenText).is_visible,
  ).toBeUndefined()
})
