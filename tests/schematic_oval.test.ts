import { expect, test } from "bun:test"
import { schematic_oval } from "../src/schematic/schematic_oval"

test("schematic_oval parses styled oval geometry", () => {
  const oval = schematic_oval.parse({
    type: "schematic_oval",
    center: { x: "1mm", y: "2mm" },
    radius_x: "3mm",
    radius_y: "1.5mm",
    stroke_width: "0.2mm",
    is_filled: true,
    fill_color: "#ffffff",
  })

  expect(oval).toMatchObject({
    center: { x: 1, y: 2 },
    radius_x: 3,
    radius_y: 1.5,
    stroke_width: 0.2,
    color: "#000000",
    is_filled: true,
    fill_color: "#ffffff",
    is_dashed: false,
  })
  expect(oval.schematic_oval_id).toMatch(/^schematic_oval_/)
})
