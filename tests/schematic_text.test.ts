import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import {
  type SchematicText,
  schematic_text,
} from "../src/schematic/schematic_text"

test("schematic_text.source_trace_id defaults to undefined", () => {
  const text = schematic_text.parse({
    type: "schematic_text",
    schematic_text_id: "schematic_text_1",
    text: "hello",
    position: { x: 0, y: 0 },
  })

  expect(text.source_trace_id).toBeUndefined()
})

test("schematic_text allows source_trace_id", () => {
  const text = schematic_text.parse({
    type: "schematic_text",
    schematic_text_id: "schematic_text_1",
    source_trace_id: "source_trace_1",
    text: "USER_LED_ANODE",
    position: { x: 0, y: 0 },
    rotation: -90,
  })

  expect(text.source_trace_id).toBe("source_trace_1")
})

test("any_circuit_element includes schematic_text with source_trace_id", () => {
  const text = any_circuit_element.parse({
    type: "schematic_text",
    schematic_text_id: "schematic_text_2",
    source_trace_id: "source_trace_2",
    text: "SPI_SCK",
    position: { x: 1, y: 2 },
  }) as SchematicText

  expect(text.source_trace_id).toBe("source_trace_2")
})

test("schematic_text supports optional display superscripts for inline net labels", () => {
  const input = {
    type: "schematic_text",
    schematic_text_id: "schematic_text_inline_gnd",
    source_trace_id: "source_trace_gnd",
    text: "GND",
    position: { x: 1, y: 2 },
  }
  for (const suffix of [undefined, "", "1", "12", "A"]) {
    const text = schematic_text.parse({ ...input, display_superscript: suffix })
    if (suffix === undefined) expect(text.display_superscript).toBeUndefined()
    else expect(text.display_superscript).toBe(suffix)
    expect(text.text).toBe("GND")
    expect(text.source_trace_id).toBe("source_trace_gnd")
    expect(any_circuit_element.parse(text)).toEqual(text)
  }
  expect(
    schematic_text.safeParse({ ...input, display_superscript: 1 }).success,
  ).toBe(false)
})
