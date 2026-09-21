import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
import {
  type CadComponent,
  type CadComponentInput,
  cad_component,
} from "../src/cad/cad_component"

const standalone = {
  type: "cad_component",
  cad_component_id: "cad-housing",
  source_component_id: "source-housing",
  position: { x: 1, y: 2, z: 3 },
  model_glb_url: "https://example.com/housing.glb",
} satisfies CadComponentInput

// Verify the public parsed interface also permits an absent PCB reference.
const parsedStandalone: CadComponent = {
  ...standalone,
  anchor_alignment: "center",
  model_object_fit: "contain_within_bounds",
}

test("CAD geometry can omit its PCB component reference", () => {
  const parsed = cad_component.parse(standalone)
  expect(parsed).toEqual(parsedStandalone)
  expect(any_circuit_element.parse(standalone)).toEqual(parsedStandalone)
  expect(parsed).not.toHaveProperty("pcb_component_id")
})

test("CAD geometry preserves an existing PCB component reference", () => {
  expect(
    cad_component.parse({ ...standalone, pcb_component_id: "pcb1" }),
  ).toEqual({
    ...parsedStandalone,
    pcb_component_id: "pcb1",
  })
})

test("PCB component references remain strings when supplied", () => {
  for (const pcb_component_id of [null, 42, {}]) {
    expect(
      cad_component.safeParse({ ...standalone, pcb_component_id }).success,
    ).toBe(false)
  }
})

test("standalone CAD geometry still requires a source component", () => {
  const { source_component_id, ...withoutSource } = standalone
  expect(cad_component.safeParse(withoutSource).success).toBe(false)
})
