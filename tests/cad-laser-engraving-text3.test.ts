import { expect, test } from "bun:test"
import { cad_laser_engraving_text, type CadLaserEngravingText } from "../src"

const engraving: CadLaserEngravingText = {
  type: "cad_laser_engraving_text",
  cad_laser_engraving_text_id: "cad_laser_engraving_text_0",
  source_laser_engraving_text_id: "source_laser_engraving_text_0",
  source_component_id: "source_lid",
  text: "SN 0001",
  font: "tscircuit2024",
  font_size: 2.5,
  anchor_position: { x: 0, y: -25, z: 6 },
  anchor_alignment: "center",
  normal_direction: { x: 0, y: -1, z: 0 },
  x_axis_direction: { x: 1, y: 0, z: 0 },
}

test("cad laser engraving text rejects missing identity, blank text and invalid frames", () => {
  for (const overrides of [
    { cad_laser_engraving_text_id: undefined },
    { cad_laser_engraving_text_id: "" },
    { source_laser_engraving_text_id: undefined },
    { source_laser_engraving_text_id: "" },
    { source_component_id: undefined },
    { source_component_id: "" },
    { cad_component_id: "" },
    { cad_reference_surface_id: "" },
    { text: " " },
    { text: undefined },
    { font: "comic" },
    { font_size: undefined },
    { font_size: 0 },
    { font_size: "-1mm" },
    { anchor_position: undefined },
    { anchor_position: { x: 0, y: Number.POSITIVE_INFINITY, z: 0 } },
    { anchor_alignment: "middle" },
    { normal_direction: undefined },
    { normal_direction: { x: 0, y: 0, z: 2 } },
    { normal_direction: { x: 0, y: 0, z: 0 } },
    { x_axis_direction: undefined },
    { x_axis_direction: { x: 0.5, y: 0, z: 0 } },
    // Not perpendicular to the normal.
    {
      normal_direction: { x: 0, y: 0, z: 1 },
      x_axis_direction: { x: 0, y: 0, z: 1 },
    },
    { color: " " },
  ]) {
    expect(
      cad_laser_engraving_text.safeParse({
        ...engraving,
        ...overrides,
      }).success,
    ).toBe(false)
  }
})
