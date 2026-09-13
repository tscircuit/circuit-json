import { expect, test } from "bun:test"
import { schematic_graphic } from "../src"

test("schematic_graphic normalizes optional layout bounds", () => {
  const graphicInput = {
    type: "schematic_graphic",
    asset: {
      project_relative_path: "assets/system-block-diagram.svg",
      url: "https://example.com/system-block-diagram.svg",
      mimetype: "image/svg+xml",
    },
  } as const

  const graphic = schematic_graphic.parse({
    ...graphicInput,
    center: { x: "1cm", y: "2cm" },
    width: "25mm",
    height: "2.5cm",
    keep_aspect_ratio: false,
  })

  expect(graphic.center).toEqual({ x: 10, y: 20 })
  expect(graphic.width).toBe(25)
  expect(graphic.height).toBe(25)
  expect(graphic.keep_aspect_ratio).toBe(false)
  expect(
    schematic_graphic.safeParse({ ...graphicInput, width: 0 }).success,
  ).toBe(false)
  expect(
    schematic_graphic.safeParse({ ...graphicInput, height: "-1mm" }).success,
  ).toBe(false)
  expect(
    schematic_graphic.safeParse({
      ...graphicInput,
      width: Number.POSITIVE_INFINITY,
    }).success,
  ).toBe(false)
})
