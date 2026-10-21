import type { PcbStackupInput } from "src"

// JLCPCB JLC04161H-3313, four-layer 1.6 mm board, ordered top to bottom.
export const jlc_stackup = {
  type: "pcb_stackup",
  pcb_board_id: "pcb_board_1",
  layers: [
    {
      layer_type: "copper",
      layer: "top",
      thickness: "0.035mm",
      electrical_conductivity_s_per_m: 5.8e7,
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
      electrical_conductivity_s_per_m: 5.8e7,
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
      electrical_conductivity_s_per_m: 5.8e7,
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
      electrical_conductivity_s_per_m: 5.8e7,
    },
  ],
} satisfies PcbStackupInput
