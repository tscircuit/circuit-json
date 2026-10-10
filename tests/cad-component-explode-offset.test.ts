import { expect, test } from "bun:test"
import {
  type CadComponent,
  type CadComponentInput,
  cad_component,
} from "../src/cad/cad_component"

test("cad_component preserves an authored explode displacement", () => {
  const input = {
    type: "cad_component",
    cad_component_id: "cad_lid",
    source_component_id: "source_lid",
    position: { x: 0, y: 0, z: 6 },
    explode_offset: { x: "12mm", y: 0, z: "4cm" },
  } satisfies CadComponentInput

  const parsed: CadComponent = cad_component.parse(input)

  expect(parsed.position).toEqual({ x: 0, y: 0, z: 6 })
  expect(parsed.explode_offset).toEqual({ x: 12, y: 0, z: 40 })
})
