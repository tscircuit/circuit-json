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

test("schematic_text allows overline ranges", () => {
  const text = schematic_text.parse({
    type: "schematic_text",
    schematic_text_id: "schematic_text_decorated",
    text: "RESET/GPIO",
    overline_ranges: [{ start_index: 0, end_index: 5 }],
    font_size: 0.18,
    position: { x: 0, y: 0 },
    rotation: 0,
    anchor: "center",
    color: "#000000",
  })

  expect(text.overline_ranges).toEqual([{ start_index: 0, end_index: 5 }])
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
