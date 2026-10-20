# PCB stackup

`pcb_stackup` records the physical construction of one `pcb_board`. Its `layers`
are ordered from top to bottom. Thickness and surface roughness values are in mm;
conductivity is in S/m; frequency is in Hz. The optional `fabricator`,
`stackup_template_code`, and `fabricator_template_id` preserve the template's
provenance.

```json
{
  "type": "pcb_stackup",
  "pcb_stackup_id": "pcb_stackup_1",
  "pcb_board_id": "pcb_board_1",
  "fabricator": "jlcpcb",
  "stackup_template_code": "JLC04161H-3313",
  "fabricator_template_id": "6381a6960c0a46dba4daf70c97bd5dce",
  "nominal_board_thickness": 1.6,
  "plated_hole_copper_thickness": 0.025,
  "layers": [
    { "layer_type": "copper", "layer": "top", "thickness": 0.035, "conductivity": 58000000 },
    { "layer_type": "dielectric", "dielectric_type": "prepreg", "material_name": "3313 RC57%", "thickness": 0.0994, "relative_permittivity": 4.1 },
    { "layer_type": "copper", "layer": "inner1", "thickness": 0.0152, "conductivity": 58000000 },
    { "layer_type": "dielectric", "dielectric_type": "core", "material_name": "NP-155F", "thickness": 1.265, "relative_permittivity": 4.42 },
    { "layer_type": "copper", "layer": "inner2", "thickness": 0.0152, "conductivity": 58000000 },
    { "layer_type": "dielectric", "dielectric_type": "prepreg", "material_name": "3313 RC57%", "thickness": 0.0994, "relative_permittivity": 4.1 },
    { "layer_type": "copper", "layer": "bottom", "thickness": 0.035, "conductivity": 58000000 }
  ]
}
```

Core resolves a supplied fabricator template code into these per-layer values
before emitting Circuit JSON. Consumers read the resolved values and do not
re-resolve the template. `nominal_board_thickness` is the fabricator's nominal
finished thickness; it need not equal the sum of the listed layer thicknesses.
`plated_hole_copper_thickness` describes via/barrel plating separately from the
copper layers. Copper conductivity is optional; consumers may use 5.8e7 S/m for
annealed copper when it is omitted. Soldermask layers can carry thickness,
relative permittivity, and color. Dielectrics can also carry loss tangent and
the frequency at which their dielectric properties are specified.
