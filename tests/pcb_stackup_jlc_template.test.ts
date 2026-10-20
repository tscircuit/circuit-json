import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_stackup,
  type PcbCircuitElement,
  type PcbStackup,
} from "src"
import { jlc_stackup } from "./fixtures/jlc04161h-3313-stackup"

test("JLCPCB stackup parses through any_circuit_element with resolved numbers", () => {
  const parsed = any_circuit_element.parse(jlc_stackup)
  if (parsed.type !== "pcb_stackup") throw new Error("Expected pcb_stackup")
  const stackup: PcbStackup = parsed
  const element: PcbCircuitElement = stackup
  expect(element.pcb_stackup_id).toMatch(/^pcb_stackup_/)
  expect(element).toMatchObject({
    fabricator: "jlcpcb",
    stackup_template_code: "JLC04161H-3313",
    fabricator_template_id: "6381a6960c0a46dba4daf70c97bd5dce",
    nominal_board_thickness: 1.6,
    plated_hole_copper_thickness: 0.025,
    layers: [
      {
        layer_type: "copper",
        layer: "top",
        thickness: 0.035,
        conductivity: 5.8e7,
      },
      {
        layer_type: "dielectric",
        dielectric_type: "prepreg",
        material_name: "3313 RC57%",
        thickness: 0.0994,
        relative_permittivity: 4.1,
      },
      {
        layer_type: "copper",
        layer: "inner1",
        thickness: 0.0152,
        conductivity: 5.8e7,
      },
      {
        layer_type: "dielectric",
        dielectric_type: "core",
        material_name: "NP-155F",
        thickness: 1.265,
        relative_permittivity: 4.42,
      },
      {
        layer_type: "copper",
        layer: "inner2",
        thickness: 0.0152,
        conductivity: 5.8e7,
      },
      {
        layer_type: "dielectric",
        dielectric_type: "prepreg",
        material_name: "3313 RC57%",
        thickness: 0.0994,
        relative_permittivity: 4.1,
      },
      {
        layer_type: "copper",
        layer: "bottom",
        thickness: 0.035,
        conductivity: 5.8e7,
      },
    ],
  })
  expect(pcb_stackup.parse(stackup)).toEqual(stackup)
})
