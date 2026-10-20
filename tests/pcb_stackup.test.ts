import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_stackup,
  type PcbCircuitElement,
  type PcbStackup,
  type PcbStackupInput,
} from "src"

const jlc_stackup = {
  type: "pcb_stackup",
  pcb_board_id: "pcb_board_1",
  fabricator: "jlcpcb",
  stackup_template_code: "JLC04161H-3313",
  fabricator_template_id: "6381a6960c0a46dba4daf70c97bd5dce",
  nominal_board_thickness: "1.6mm",
  plated_hole_copper_thickness: "0.025mm",
  layers: [
    {
      layer_type: "copper",
      layer: "top",
      thickness: "0.035mm",
      conductivity: 5.8e7,
    },
    {
      layer_type: "dielectric",
      dielectric_type: "prepreg",
      material_name: "3313 RC57%",
      thickness: "0.0994mm",
      relative_permittivity: 4.1,
    },
    {
      layer_type: "copper",
      layer: "inner1",
      thickness: "0.0152mm",
      conductivity: 5.8e7,
    },
    {
      layer_type: "dielectric",
      dielectric_type: "core",
      material_name: "NP-155F",
      thickness: "1.265mm",
      relative_permittivity: 4.42,
    },
    {
      layer_type: "copper",
      layer: "inner2",
      thickness: "0.0152mm",
      conductivity: 5.8e7,
    },
    {
      layer_type: "dielectric",
      dielectric_type: "prepreg",
      material_name: "3313 RC57%",
      thickness: "0.0994mm",
      relative_permittivity: 4.1,
    },
    {
      layer_type: "copper",
      layer: "bottom",
      thickness: "0.035mm",
      conductivity: 5.8e7,
    },
  ],
} satisfies PcbStackupInput

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

test("stackup rejects an unknown layer type", () => {
  expect(
    pcb_stackup.safeParse({
      ...jlc_stackup,
      layers: [{ layer_type: "silkscreen", thickness: "0.035mm" }],
    }).success,
  ).toBe(false)
})

test("stackup retains optional soldermask and material properties", () => {
  const stackup = pcb_stackup.parse({
    type: "pcb_stackup",
    pcb_board_id: "pcb_board_1",
    layers: [
      {
        layer_type: "soldermask",
        thickness: "0.02mm",
        relative_permittivity: 3.5,
        color: "green",
      },
      {
        layer_type: "copper",
        layer: "top",
        thickness: "0.035mm",
        copper_weight_oz: 1,
        surface_roughness: "0.001mm",
      },
      {
        layer_type: "dielectric",
        thickness: "1mm",
        loss_tangent: 0.02,
        relative_permittivity_frequency: 1e9,
      },
    ],
  })
  expect(stackup.layers).toMatchObject([
    { thickness: 0.02, relative_permittivity: 3.5, color: "green" },
    { thickness: 0.035, copper_weight_oz: 1, surface_roughness: 0.001 },
    { thickness: 1, loss_tangent: 0.02, relative_permittivity_frequency: 1e9 },
  ])
  expect(stackup.layers[1]).not.toHaveProperty("conductivity")
})

test("stackup rejects non-positive copper conductivity", () => {
  for (const conductivity of [0, -1, Infinity, NaN]) {
    expect(
      pcb_stackup.safeParse({
        ...jlc_stackup,
        layers: [
          {
            layer_type: "copper",
            layer: "top",
            thickness: "0.035mm",
            conductivity,
          },
        ],
      }).success,
    ).toBe(false)
  }
})
