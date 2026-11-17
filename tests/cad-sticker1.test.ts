import { expect, test } from "bun:test"
import {
  any_circuit_element,
  cad_sticker,
  type CadSticker,
  type CircuitJson,
} from "../src"

const sticker: CadSticker = {
  type: "cad_sticker",
  cad_sticker_id: "cad_sticker_1",
  source_component_id: "source_label",
  applied_to_source_component_id: "source_lid",
  center: { x: 0, y: 0, z: 54 },
  normal: { x: 0, y: 0, z: 1 },
  x_axis: { x: 1, y: 0, z: 0 },
  width: 30,
  height: 16,
}

test("stickers round-trip through Circuit JSON and parse distances to millimeters", () => {
  const circuit: CircuitJson = [sticker]
  expect(
    any_circuit_element.parse(JSON.parse(JSON.stringify(circuit[0]))),
  ).toEqual(sticker)
  expect(
    cad_sticker.parse({
      ...sticker,
      center: { x: "3mm", y: "-2mm", z: "54mm" },
      width: "30mm",
      height: "0.5in",
      thickness: "0.1mm",
      image_url: "./label.svg",
      background_color: " #ffffff ",
      subcircuit_id: "sub_1",
    }),
  ).toEqual({
    ...sticker,
    center: { x: 3, y: -2, z: 54 },
    height: 12.7,
    thickness: 0.1,
    image_url: "./label.svg",
    background_color: "#ffffff",
    subcircuit_id: "sub_1",
  })
  const parsed = cad_sticker.parse(sticker)
  for (const optional of ["thickness", "image_url", "background_color"])
    expect(parsed).not.toHaveProperty(optional)
  const { applied_to_source_component_id: _, ...unowned } = sticker
  expect(cad_sticker.parse(unowned)).toEqual(unowned)
})
