import { expect, test } from "bun:test"
import {
  manufacturing_laser_engraving_text,
  type ManufacturingLaserEngravingText,
} from "../src"

const engraving: ManufacturingLaserEngravingText = {
  type: "manufacturing_laser_engraving_text",
  manufacturing_laser_engraving_text_id: "manufacturing_laser_engraving_text_0",
  source_component_id: "source_lid",
  text: "SN 0001",
  font: "tscircuit2024",
  font_size: 2.5,
  anchor_position: { x: 0, y: -25, z: 6 },
  anchor_alignment: "center",
  normal: { x: 0, y: -1, z: 0 },
  x_axis: { x: 1, y: 0, z: 0 },
}

test("laser engraving text rejects missing identity, blank text and invalid frames", () => {
  for (const overrides of [
    { manufacturing_laser_engraving_text_id: undefined },
    { manufacturing_laser_engraving_text_id: "" },
    { source_component_id: undefined },
    { source_component_id: "" },
    { cad_component_id: "" },
    { cad_reference_surface_id: "" },
    { name: " " },
    { text: " " },
    { text: undefined },
    { font: "comic" },
    { font_size: undefined },
    { font_size: 0 },
    { font_size: "-1mm" },
    { anchor_position: undefined },
    { anchor_position: { x: 0, y: Number.POSITIVE_INFINITY, z: 0 } },
    { anchor_alignment: "middle" },
    { normal: undefined },
    { normal: { x: 0, y: 0, z: 2 } },
    { normal: { x: 0, y: 0, z: 0 } },
    { x_axis: undefined },
    { x_axis: { x: 0.5, y: 0, z: 0 } },
    // Not perpendicular to the normal.
    { normal: { x: 0, y: 0, z: 1 }, x_axis: { x: 0, y: 0, z: 1 } },
    { engraving_depth: 0 },
    { engraving_depth: -0.1 },
    { resulting_color: " " },
  ]) {
    expect(
      manufacturing_laser_engraving_text.safeParse({
        ...engraving,
        ...overrides,
      }).success,
    ).toBe(false)
  }
})
