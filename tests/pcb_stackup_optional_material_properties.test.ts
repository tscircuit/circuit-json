import { expect, test } from "bun:test"
import { pcb_stackup } from "src"

test("stackup retains optional material properties and accepts zero losses", () => {
  for (const loss_tangent of [0.02, 0]) {
    const rms_surface_roughness = loss_tangent === 0 ? 0 : "0.001mm"
    const parsed = pcb_stackup.parse({
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
          rms_surface_roughness,
        },
        {
          layer_type: "dielectric",
          thickness: "1.5mm",
          loss_tangent,
          dielectric_properties_frequency_hz: 1e9,
        },
      ],
    })

    expect(parsed).toMatchObject({
      plated_hole_copper_thickness: 0.018,
      layers: [
        {
          layer_type: "soldermask",
          thickness: 0.02,
          relative_permittivity: 3.3,
        },
        {
          layer_type: "copper",
          thickness: 0.035,
          rms_surface_roughness: loss_tangent === 0 ? 0 : 0.001,
        },
        {
          layer_type: "dielectric",
          thickness: 1.5,
          loss_tangent,
          dielectric_properties_frequency_hz: 1e9,
        },
      ],
    })
    const copper = parsed.layers[1]
    if (copper?.layer_type !== "copper") throw new Error("Expected copper")
    expect(copper.electrical_conductivity_s_per_m).toBeUndefined()
  }
})
