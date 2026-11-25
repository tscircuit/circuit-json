import { expect, test } from "bun:test"
import {
  type CadComponent,
  type CadComponentInput,
  any_circuit_element,
  cad_component,
} from "../src"

const builtinResistor = {
  type: "cad_component",
  cad_component_id: "cad_component_0",
  pcb_component_id: "pcb_component_0",
  source_component_id: "source_component_0",
  position: { x: -20, y: 10, z: 0.8 },
  rotation: { x: 0, y: 0, z: 0 },
  footprinter_string: "res0603",
  model_origin_alignment: "center_of_component_on_board_surface",
} satisfies CadComponentInput

test("cad_component preserves optional footprinter_model_url without mutating model_step_url or model_asset", () => {
  const withoutUrl = cad_component.parse(builtinResistor)
  expect(withoutUrl).not.toHaveProperty("footprinter_model_url")
  expect(withoutUrl).not.toHaveProperty("model_step_url")
  expect(withoutUrl).not.toHaveProperty("model_asset")

  const withStepUrl = cad_component.parse({
    ...builtinResistor,
    footprinter_model_url: "  https://example.com/models/res0603.step  ",
  })

  const expected: CadComponent = {
    ...builtinResistor,
    footprinter_model_url: "https://example.com/models/res0603.step",
    model_object_fit: "contain_within_bounds",
    anchor_alignment: "center",
  }

  expect(withStepUrl).toEqual(expected)
  expect(
    any_circuit_element.parse(JSON.parse(JSON.stringify(withStepUrl))),
  ).toEqual(expected)
  expect(withStepUrl).not.toHaveProperty("model_step_url")
  expect(withStepUrl).not.toHaveProperty("model_asset")
})

test("cad_component.footprinter_model_url rejects blank or non-string values", () => {
  for (const footprinter_model_url of ["", "   ", null, 123, {}]) {
    expect(
      cad_component.safeParse({
        ...builtinResistor,
        footprinter_model_url,
      }).success,
    ).toBe(false)
  }
})
