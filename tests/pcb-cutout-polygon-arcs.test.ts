import { expect, test } from "bun:test"
import { any_circuit_element, pcb_cutout } from "../src"

test("a circular polygon cutout retains both clockwise semicircles", () => {
  const points = [
    { x: -2, y: 0, bulge: -1 },
    { x: 2, y: 0, bulge: -1 },
  ]
  const cutout = pcb_cutout.parse({
    type: "pcb_cutout",
    shape: "polygon",
    points,
  })

  expect(cutout).toMatchObject({ points })
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(cutout)))).toEqual(
    cutout,
  )
})
