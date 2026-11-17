import { expect, test } from "bun:test"
import { any_circuit_element, cad_sticker, type CadSticker } from "../src"

const sticker: CadSticker = {
  type: "cad_sticker",
  cad_sticker_id: "cad_sticker_1",
  source_component_id: "source_label",
  center: { x: 0, y: 0, z: 54 },
  normal: { x: 0, y: 0, z: 1 },
  x_axis: { x: 1, y: 0, z: 0 },
  width: 30,
  height: 16,
}

test("sticker frames keep rotation on the surface and reject invalid frames and sizes", () => {
  // A sticker on a side wall, turned a quarter turn on that wall.
  const s = Math.SQRT1_2
  const wall = {
    ...sticker,
    normal: { x: 0, y: -1, z: 0 },
    x_axis: { x: 0, y: 0, z: 1 },
  }
  expect(any_circuit_element.parse(wall)).toEqual(wall)
  const tilted = {
    ...sticker,
    normal: { x: s, y: 0, z: s },
    x_axis: { x: 0, y: 1, z: 0 },
  }
  expect(cad_sticker.parse(tilted)).toEqual(tilted)

  for (const invalid of [
    { ...sticker, normal: { x: 0, y: 0, z: 2 } },
    { ...sticker, x_axis: { x: 0, y: 0, z: 1 } },
    { ...sticker, x_axis: { x: s, y: 0, z: s } },
    { ...sticker, center: { x: 0, y: 0, z: Infinity } },
    { ...sticker, width: 0 },
    { ...sticker, height: -1 },
    { ...sticker, width: undefined },
    { ...sticker, thickness: 0 },
    { ...sticker, image_url: "" },
    { ...sticker, background_color: " " },
    { ...sticker, cad_sticker_id: "" },
    { ...sticker, source_component_id: "" },
    { ...sticker, applied_to_source_component_id: "" },
  ]) {
    expect(cad_sticker.safeParse(invalid).success).toBe(false)
  }
})
