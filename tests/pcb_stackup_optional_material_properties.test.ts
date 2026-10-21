import { expect, test } from "bun:test"
import { pcb_stackup } from "src"

test("stackup retains optional material properties", () => {
  const stackup = pcb_stackup.parse({
    type: "pcb_stackup",
    pcb_board_id: "pcb_board_1",
    plated_hole_copper_thickness: "0.018mm",
    layers: [
      {
        layer_type: "soldermask",
        thickness: "0.02mm",
        relative_permittivity: 3.3,
      },
      {
        layer_type: "copper",
        layer: "top",
        thickness: "0.035mm",
        rms_surface_roughness: "0.001mm",
      },
      {
        layer_type: "dielectric",
        thickness: "1.5mm",
        loss_tangent: 0.02,
        dielectric_properties_frequency_hz: 1e9,
      },
    ],
  })

  expect(stackup).toEqual({
    type: "pcb_stackup",
    pcb_stackup_id: expect.stringMatching(/^pcb_stackup_/),
    pcb_board_id: "pcb_board_1",
    plated_hole_copper_thickness: 0.018,
    layers: [
      { layer_type: "soldermask", thickness: 0.02, relative_permittivity: 3.3 },
      {
        layer_type: "copper",
        layer: "top",
        thickness: 0.035,
        rms_surface_roughness: 0.001,
      },
      {
        layer_type: "dielectric",
        thickness: 1.5,
        loss_tangent: 0.02,
        dielectric_properties_frequency_hz: 1e9,
      },
    ],
  })

  // Ideal smooth copper and a lossless dielectric are valid
  expect(
    pcb_stackup.safeParse({
      ...stackup,
      layers: [
        {
          layer_type: "copper",
          layer: "top",
          thickness: 0.035,
          rms_surface_roughness: 0,
        },
        { layer_type: "dielectric", thickness: 1.5, loss_tangent: 0 },
      ],
    }).success,
  ).toBe(true)
})
