# CAD reference surfaces

`cad_reference_surface` records preserve named assembly mounting frames for
optional visualization. Each record belongs to a `source_component_id`, including
parts with no CAD component or with multiple CAD models. Names are unique within
the owning source component; the circuit producer checks that relationship.

For a lamp with a 12 mm base and an 80 mm stem, `STEM.shade` is at world Z=92 mm:

```json
{
  "type": "cad_reference_surface",
  "cad_reference_surface_id": "cad_reference_surface_stem_shade",
  "source_component_id": "source_stem",
  "name": "shade",
  "shape": "rect",
  "center": { "x": 0, "y": 0, "z": 92 },
  "normal": { "x": 0, "y": 0, "z": 1 },
  "x_axis": { "x": 1, "y": 0, "z": 0 },
  "width": 14,
  "height": 14
}
```

The shade's mating `stem` record uses its own source component ID, the same
resolved center, and the opposite normal `{ "x": 0, "y": 0, "z": -1 }`.
Its in-plane X direction remains `{ "x": 1, "y": 0, "z": 0 }`.

## Coordinate and dimension contract

- The frame is in right-handed circuit world: +X right, +Y top, +Z above.
- `center` is an absolute point in millimeters after assembly placement.
- `normal` and `x_axis` are finite, dimensionless unit directions, perpendicular
  to each other within a numerical tolerance of 1e-6. Direction fields accept
  numeric components; unit strings are reserved for positions and dimensions.
- The second in-plane axis is `normal × x_axis`, making the frame right-handed.
  Width follows `x_axis`; height follows that second tangent.
- Width and height are optional, positive, finite distances supplied together.
  Parsing supports unit strings such as `"14mm"` and produces numeric millimeters.
  Omitting both adds no default size; a renderer chooses its diagnostic display
  size independently of the mounting frame.

The circuit producer applies the part's resolved transform once: translation and
rotation to the center, rotation to the direction vectors. Model-only position
offsets do not move the part's reference frames. Renderers consume the stored
world frame directly, using their existing circuit-world to scene conversion.

## Rendering

These records add reference information without adding solid material or
electrical connectivity. A renderer can expose an opt-in setting such as
`showReferenceSurfaces` to draw translucent rectangles, normal arrows, and labels
derived from the owner and surface name. That setting controls display; the
records remain available in Circuit JSON independently of visibility. Reference
records do not require a CAD model to be present or loaded.
