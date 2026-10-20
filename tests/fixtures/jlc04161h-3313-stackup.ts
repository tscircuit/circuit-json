import type { PcbStackupInput } from "src"

export const jlc_stackup = {
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
