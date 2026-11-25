# Built-in footprint 3D model references

A component backed by a built-in footprint emits a `cad_component` carrying `footprinter_string` and its resolved board-world pose:

```json
{
  "type": "cad_component",
  "cad_component_id": "cad_component_0",
  "pcb_component_id": "pcb_component_0",
  "source_component_id": "source_component_0",
  "position": { "x": -20, "y": 10, "z": 0.8 },
  "rotation": { "x": 0, "y": 0, "z": 0 },
  "footprinter_string": "res0603",
  "footprinter_model_url": "https://example.com/models/res0603.step",
  "model_origin_alignment": "center_of_component_on_board_surface"
}
```

## Field precedence and separation

- `model_*_url` (`model_step_url`, `model_glb_url`, etc.) and `model_asset` describe authored external CAD models that replace procedural footprint geometry.
- `footprinter_model_url` carries an optional STEP or 3D model URL generated for `footprinter_string`. Keeping it separate from `model_step_url` and `model_asset` lets in-memory procedural renderers and offline mesh generators continue using `footprinter_string` directly, while external CAD importers reading Circuit JSON alone can fetch the prebuilt body when no authored `model_*_url` or `model_asset` is present.
- Omitting `footprinter_model_url` remains valid when a producer emits symbolic `footprinter_string` records only.

## Coordinate frame

- Built-in footprint STEP models use right-handed millimeters with `+Z` normal to the board mounting surface (`cadModelDefaultDirectionMap.step`).
- Local `(0, 0, 0)` lies at the footprint origin on the copper surface (`model_origin_alignment: "center_of_component_on_board_surface"`), placed into board-world coordinates (`+X` right, `+Y` top, `+Z` above the top board surface) by `position` and `rotation`.
