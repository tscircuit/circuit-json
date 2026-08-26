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
    width: "25mm",
    height: "2.5cm",
  })

  expect(graphic.width).toBe(25)
  expect(graphic.height).toBe(25)
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
