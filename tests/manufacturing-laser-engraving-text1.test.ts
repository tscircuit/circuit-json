import { expect, test } from "bun:test"
import {
  any_circuit_element,
  manufacturing_laser_engraving_text,
  type CircuitJson,
  type ManufacturingLaserEngravingText,
} from "../src"

const engraving: ManufacturingLaserEngravingText = {
  type: "manufacturing_laser_engraving_text",
  manufacturing_laser_engraving_text_id: "manufacturing_laser_engraving_text_0",
  source_component_id: "source_lid",
  text: "REV B",
  font: "tscircuit2024",
  font_size: 3,
  anchor_position: { x: -16, y: 9, z: 4 },
  anchor_alignment: "top_left",
  normal: { x: 0, y: 0, z: 1 },
  x_axis: { x: 1, y: 0, z: 0 },
}

test("laser engraving text round-trips through Circuit JSON and parses distances", () => {
  const circuit: CircuitJson = [engraving]
  expect(
    any_circuit_element.parse(JSON.parse(JSON.stringify(circuit[0]))),
  ).toEqual(engraving)

  expect(
    manufacturing_laser_engraving_text.parse({
      ...engraving,
      cad_component_id: "cad_component_0",
      cad_reference_surface_id: "cad_reference_surface_0",
      name: " REV ",
      font_size: "0.125in",
      anchor_position: { x: "-16mm", y: "9mm", z: "4mm" },
      engraving_depth: "0.1mm",
      resulting_color: " #222222 ",
      subcircuit_id: "sub_1",
    }),
  ).toEqual({
    ...engraving,
    cad_component_id: "cad_component_0",
    cad_reference_surface_id: "cad_reference_surface_0",
    name: "REV",
    font_size: 3.175,
    engraving_depth: 0.1,
    resulting_color: "#222222",
    subcircuit_id: "sub_1",
  })

  // Optional fields add no defaults; font and anchor_alignment do.
  const { font, anchor_alignment, ...minimal } = engraving
  const parsed = manufacturing_laser_engraving_text.parse(minimal)
  expect(parsed.font).toBe("tscircuit2024")
  expect(parsed.anchor_alignment).toBe("center")
  for (const key of [
    "cad_component_id",
    "cad_reference_surface_id",
    "name",
    "engraving_depth",
    "resulting_color",
  ])
    expect(parsed).not.toHaveProperty(key)
})
