import { expect, test } from "bun:test"
import { any_circuit_element, pcb_cutout } from "../src"

test("a slot path retains a major arc followed by a straight segment", () => {
  const route = [
    { x: 0, y: 0, bulge: Math.tan((3 * Math.PI) / 8) },
    { x: 2, y: 2 },
    { x: 4, y: 2 },
  ]
  const cutout = pcb_cutout.parse({
    type: "pcb_cutout",
    shape: "path",
    route,
    slot_width: 0.5,
  })

  expect(cutout).toMatchObject({ route })
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(cutout)))).toEqual(
    cutout,
  )
})
