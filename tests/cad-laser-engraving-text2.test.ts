import { expect, test } from "bun:test"
import {
  any_circuit_element,
  cad_laser_engraving_text,
  type CadLaserEngravingText,
} from "../src"

const engraving: CadLaserEngravingText = {
  type: "cad_laser_engraving_text",
  cad_laser_engraving_text_id: "cad_laser_engraving_text_0",
  source_manufacturing_laser_engraving_text_id:
    "source_manufacturing_laser_engraving_text_0",
  source_component_id: "source_lid",
  text: "SN 0001",
  font: "tscircuit2024",
  font_size: 2.5,
  anchor_position: { x: 0, y: -25, z: 6 },
  anchor_alignment: "center",
  normal: { x: 0, y: -1, z: 0 },
  x_axis: { x: 1, y: 0, z: 0 },
}

test("laser engraving frames keep tilted and rotated directions as authored", () => {
  // Text on a wall facing -Y, reading along +X: up is normal cross x_axis = +Z.
  expect(any_circuit_element.parse(engraving)).toEqual(engraving)

  const s = Math.SQRT1_2
  const tilted = {
    ...engraving,
    normal: { x: s, y: 0, z: s },
    x_axis: { x: 0, y: 1, z: 0 },
  }
  expect(any_circuit_element.parse(tilted)).toEqual(tilted)

  // Rotation on the surface is carried by x_axis, not by a separate angle.
  const rotated = {
    ...engraving,
    normal: { x: 0, y: 0, z: 1 },
    x_axis: { x: s, y: s, z: 0 },
  }
  expect(cad_laser_engraving_text.parse(rotated)).toEqual(rotated)

  // Rigid transforms leave small errors in unit directions.
  expect(
    cad_laser_engraving_text.safeParse({
      ...tilted,
      normal: { x: 0.70710677, y: 0, z: 0.70710677 },
    }).success,
  ).toBe(true)
})
