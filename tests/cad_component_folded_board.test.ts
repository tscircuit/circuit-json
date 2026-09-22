import { expect, test } from "bun:test"
import { cad_component } from "../src/cad/cad_component"

const cad = {
  type: "cad_component",
  cad_component_id: "cad1",
  source_component_id: "source1",
  pcb_component_id: "pcb1",
  position: { x: 3, y: 4, z: 8 },
  rotation: { x: 17, y: 90, z: -23 },
}

test("CAD folded state is optional and preserves the supplied pose", () => {
  expect(cad_component.parse(cad).is_on_folded_board).toBeUndefined()
  for (const folded of [true, false]) {
    const result = cad_component.parse({ ...cad, is_on_folded_board: folded })
    expect(result.is_on_folded_board).toBe(folded)
    expect(result.position).toEqual(cad.position)
    expect(result.rotation).toEqual(cad.rotation)
  }
  expect(
    cad_component.safeParse({ ...cad, is_on_folded_board: "true" }).success,
  ).toBe(false)
})
