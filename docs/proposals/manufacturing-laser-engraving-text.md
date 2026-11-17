# Laser-engraved text on a part surface

`manufacturing_laser_engraving_text` records text that is laser engraved onto
one surface of an assembly part. It is the Circuit JSON counterpart of the
`<manufacturing.laserengraving.text />` props element, and the first record
with the `manufacturing_` prefix.

The record carries a resolved world-space frame, like `cad_reference_surface`.
The producer works out which surface the mark is on and where; a renderer or
exporter draws the text from the record alone.

```json
{
  "type": "manufacturing_laser_engraving_text",
  "manufacturing_laser_engraving_text_id": "manufacturing_laser_engraving_text_0",
  "source_component_id": "source_lid",
  "cad_component_id": "cad_component_lid",
  "text": "REV B",
  "font": "tscircuit2024",
  "font_size": 3,
  "anchor_position": { "x": -27, "y": 17, "z": 8 },
  "anchor_alignment": "top_left",
  "normal": { "x": 0, "y": 0, "z": 1 },
  "x_axis": { "x": 1, "y": 0, "z": 0 }
}
```

This is `REV B`, 3 mm tall, on the top of a lid whose top face is at Z=8 mm.
The text hangs from its top-left corner at the anchor and reads toward +X.

## Fields

| Field | Meaning |
| --- | --- |
| `source_component_id` | The part that is engraved. Required. |
| `cad_component_id` | The CAD geometry the mark sits on. Optional, for a part with no CAD component. |
| `cad_reference_surface_id` | The named reference surface the mark was placed on, when there is one. Informational; the frame is already resolved. |
| `name` | Optional name of the mark, unique within the part. |
| `text` | The engraved text, on a single line. Must not be blank. |
| `font` | `"tscircuit2024"`, the default. |
| `font_size` | Text height in mm, with the same metrics as PCB text in that font. Required. |
| `anchor_position` | Resolved anchor point on the surface. Required. |
| `anchor_alignment` | The point of the text's bounds that sits at the anchor. Defaults to `"center"`. |
| `normal` | Outward unit normal of the engraved surface. Required. |
| `x_axis` | Unit direction the text reads along. Required. |
| `engraving_depth` | Depth of material removed, in mm. Optional; no depth is assumed. |
| `resulting_color` | Color the engraved area ends up. Optional; a renderer derives one from the part. |

Distances accept unit strings such as `"3mm"` and parse to millimeters.

## Coordinate contract

- The frame is in right-handed circuit world: +X right, +Y top, +Z above.
- `anchor_position` is an absolute point in millimeters after assembly placement.
- `normal` and `x_axis` are finite, dimensionless unit directions, perpendicular
  to each other within a numerical tolerance of 1e-6.
- The text lies in the plane through `anchor_position` perpendicular to
  `normal`. It reads along `x_axis`, and its up direction is `normal × x_axis`,
  so it reads correctly when seen from the side `normal` points to.
- Rotation on the surface is not a separate field. The producer applies it to
  `x_axis`: text turned 90° clockwise on a top face has `x_axis` along -Y.
- `anchor_alignment` refers to the extents of the engraved strokes. A
  `top_left` anchor is the top-left corner of the ink.

The producer applies the part's resolved transform once, as it does for
reference surfaces. Model-only position offsets do not move the mark.

## Behavior in consumers

- **Explosions.** A mark belongs to its component's surface. When an explosion
  moves `cad_component_id`, the mark moves by the same offset. Marks are not
  listed in explosion stages or moves.
- **Rendering.** A renderer draws the glyphs on the surface in
  `resulting_color`. When that is omitted it picks a color that contrasts with
  the part. `engraving_depth` describes the manufactured part; a renderer may
  draw the mark flat.
- **Manufacturing output.** Because the frame is resolved, an exporter can
  project every mark that shares a `normal` into that surface's 2D frame.

## Left out for now

- Engraved images. This proposal starts with text.
- `text_style` (filled or outlined letters) and raster settings from the props.
- Curved surfaces. The mark is planar.

## Open questions

- **Prefix.** This adds `manufacturing_` beside `cad_`. The alternative is
  `cad_laser_engraving_text`, which keeps every 3D record under one prefix.
- **Direction names.** `normal` and `x_axis` match `cad_reference_surface`.
  The props call the surface direction `outwardNormal`.
