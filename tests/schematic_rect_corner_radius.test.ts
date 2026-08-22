import { expect, test } from "bun:test"
import { schematic_rect } from "../src/schematic/schematic_rect"

test("schematic_rect parses corner radius", () => {
  const rect = schematic_rect.parse({
    type: "schematic_rect",
    center: { x: 0, y: 0 },
    width: "4mm",
    height: "2mm",
    corner_radius: "0.5mm",
  })

  expect(rect.corner_radius).toBe(0.5)
})
