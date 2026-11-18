import { expect, test } from "bun:test"
import {
  any_circuit_element,
  source_laser_engraving_text,
  type CircuitJson,
  type SourceLaserEngravingText,
} from "../src"

test("source laser engraving text records what is engraved and links to its geometry", () => {
  const engraving: SourceLaserEngravingText = {
    type: "source_laser_engraving_text",
    source_laser_engraving_text_id: "source_laser_engraving_text_0",
    source_component_id: "source_lid",
    text: "REV B",
  }
  // A source record and the cad record that draws it sit side by side.
  const circuit: CircuitJson = [
    engraving,
    {
      type: "cad_laser_engraving_text",
      cad_laser_engraving_text_id: "cad_laser_engraving_text_0",
      source_laser_engraving_text_id: engraving.source_laser_engraving_text_id,
      source_component_id: "source_lid",
      text: "REV B",
      font: "tscircuit2024",
      font_size: 3,
      anchor_position: { x: -16, y: 9, z: 4 },
      anchor_alignment: "top_left",
      normal: { x: 0, y: 0, z: 1 },
      x_axis: { x: 1, y: 0, z: 0 },
    },
  ]
  for (const element of circuit)
    expect(
      any_circuit_element.parse(JSON.parse(JSON.stringify(element))),
    ).toEqual(element)

  expect(
    source_laser_engraving_text.parse({
      ...engraving,
      name: " REV ",
      engraving_depth: "0.1mm",
      subcircuit_id: "sub_1",
    }),
  ).toEqual({
    ...engraving,
    name: "REV",
    engraving_depth: 0.1,
    subcircuit_id: "sub_1",
  })
  // Depth is a manufacturing fact: none is assumed.
  const parsed = source_laser_engraving_text.parse(engraving)
  expect(parsed).not.toHaveProperty("engraving_depth")
  expect(parsed).not.toHaveProperty("name")

  for (const overrides of [
    { source_laser_engraving_text_id: undefined },
    { source_laser_engraving_text_id: "" },
    { source_component_id: undefined },
    { source_component_id: "" },
    { name: " " },
    { text: " " },
    { text: undefined },
    { engraving_depth: 0 },
    { engraving_depth: -0.1 },
    { engraving_depth: Number.POSITIVE_INFINITY },
  ]) {
    expect(
      source_laser_engraving_text.safeParse({
        ...engraving,
        ...overrides,
      }).success,
    ).toBe(false)
  }
})
