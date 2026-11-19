import { expect, test } from "bun:test"
import { any_circuit_element, cad_sticker, type CadSticker } from "../src"

const sticker: CadSticker = {
  type: "cad_sticker",
  cad_sticker_id: "cad_sticker_1",
  source_component_id: "source_label",
  center: { x: 0, y: 0, z: 12 },
  normal_direction: { x: 0, y: 0, z: 1 },
  x_axis_direction: { x: 1, y: 0, z: 0 },
  width: 38.1,
  height: 19.05,
}

test("sticker corners can be rounded up to half of the shorter side", () => {
  expect(cad_sticker.parse(sticker)).not.toHaveProperty("corner_radius")
  const rounded = { ...sticker, corner_radius: 1.5875 }
  expect(any_circuit_element.parse(rounded)).toEqual(rounded)
  expect(
    cad_sticker.parse({ ...sticker, corner_radius: "0.0625in" }).corner_radius,
  ).toBeCloseTo(1.5875, 6)
  // Zero is square corners; half of the shorter side is a full stadium end.
  for (const corner_radius of [0, 9.525])
    expect(cad_sticker.parse({ ...sticker, corner_radius })).toEqual({
      ...sticker,
      corner_radius,
    })

  const tooLarge = cad_sticker.safeParse({ ...sticker, corner_radius: 9.6 })
  expect(tooLarge.success).toBe(false)
  expect(tooLarge.error?.issues).toMatchObject([
    {
      path: ["corner_radius"],
      message: "corner_radius cannot exceed half of width or height",
    },
  ])
  for (const corner_radius of [-1, Number.POSITIVE_INFINITY, "abc"])
    expect(cad_sticker.safeParse({ ...sticker, corner_radius }).success).toBe(
      false,
    )
})
