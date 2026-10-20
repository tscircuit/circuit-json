import { expect, test } from "bun:test"
import { pcb_stackup } from "src"

test("stackup retains optional soldermask and material properties", () => {
  const stackup = pcb_stackup.parse({
    type: "pcb_stackup",
    pcb_board_id: "pcb_board_1",
    layers: [
      {
        layer_type: "soldermask",
        thickness: "0.02mm",
        relative_permittivity: 3.5,
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
    { thickness: 0.02, relative_permittivity: 3.5 },
    { thickness: 0.035, copper_weight_oz: 1, surface_roughness: 0.001 },
    { thickness: 1, loss_tangent: 0.02, relative_permittivity_frequency: 1e9 },
  ])
  expect(stackup.layers[1]).not.toHaveProperty("conductivity")
})
