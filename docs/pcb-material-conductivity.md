# Conductor materials and layer conductivity

Declare shared conductor materials in `pcb_board.stackup.materials`, keyed by an
ID local to that board's stackup. A copper layer references one using `material_id`.
The existing `pcb_board.material` field describes the substrate (`fr4`, `fr1`, or
`flex`); it does not identify the conductor material.

```ts
import { pcb_board, getPcbLayerConductivity } from "circuit-json"

const board = pcb_board.parse({
  type: "pcb_board",
  center: { x: 0, y: 0 },
  num_layers: 2,
  stackup: {
    source: "assumed",
    materials: {
      copper: { name: "Copper", conductivity_s_per_m: 58000000 },
    },
    layers: [
      {
        type: "copper",
        layer: "top",
        material_id: "copper",
        thickness_mm: 0.035,
      },
      { type: "dielectric", material: "FR4", thickness_mm: 0.2 },
      {
        type: "copper",
        layer: "bottom",
        material_id: "copper",
        thickness_mm: 0.018,
      },
    ],
  },
})

getPcbLayerConductivity(board, "top") // 58000000 S/m
getPcbLayerConductivity(board, "bottom") // 58000000 S/m
```

This example declares assumptions, not manufacturer-approved material data.
Conductivity is a bulk electrical material property in siemens per meter (S/m).
Different trace widths, lengths, and layer thicknesses affect resistance without
changing conductivity.

For each `pcb_trace` wire route point, call
`getPcbLayerConductivity(owning_board, point.layer)`. A trace crossing a via can
inherit a different value on each copper layer. The caller selects the owning
board; material IDs never resolve against another board's stackup. The helper
checks that `num_layers` agrees with the stackup before looking up a value.

An explicit copper-layer `conductivity_s_per_m` overrides the referenced material.
Existing layers with an explicit value and no material reference continue to work.
If neither supplies conductivity, or the board has no matching stackup layer, the
result is `undefined`. The material name alone never implies a numeric value.
Material references must resolve within the same stackup, even when the layer
supplies an override.

Inheritance is resolved on lookup. Parsing preserves the declarations without
copying conductivity into each trace or layer. Consumers must use the resolved
value in their calculations. Via plating is separate conductor geometry and this
helper does not assign it a conductivity from an adjacent layer.
