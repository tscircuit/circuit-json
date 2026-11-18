# Laser-engraved text on a part surface

Text laser engraved onto an assembly part is two records, split the way
Circuit JSON already splits source and output:

- `source_laser_engraving_text` says what is engraved and how. It
  is the manufacturing step, with no geometry.
- `cad_laser_engraving_text` is the 3D output: where that text sits on the
  part, as a resolved world-space frame.

Together they are the Circuit JSON counterpart of the
`<manufacturing.laserengraving.text />` props element. The props namespace
`manufacturing` does not become a Circuit JSON prefix: the step is a `source_`
record and its output is a `cad_` record.

```json
[
  {
    "type": "source_laser_engraving_text",
    "source_laser_engraving_text_id": "source_laser_engraving_text_0",
    "source_component_id": "source_lid",
    "text": "REV B",
    "engraving_depth": 0.1
  },
  {
    "type": "cad_laser_engraving_text",
    "cad_laser_engraving_text_id": "cad_laser_engraving_text_0",
    "source_laser_engraving_text_id": "source_laser_engraving_text_0",
    "source_component_id": "source_lid",
    "cad_component_id": "cad_component_lid",
    "text": "REV B",
    "font": "tscircuit2024",
    "font_size": 3,
    "anchor_position": { "x": -27, "y": 17, "z": 8 },
    "anchor_alignment": "top_left",
    "normal_direction": { "x": 0, "y": 0, "z": 1 },
    "x_axis_direction": { "x": 1, "y": 0, "z": 0 }
  }
]
```

This is `REV B`, 3 mm tall and engraved 0.1 mm deep, on the top of a lid whose
top face is at Z=8 mm. The text hangs from its top-left corner at the anchor
and reads toward +X.

## Why a cad record is needed

`cad_component` has no texture or image field. A part's appearance comes from
its model file, its JSCAD material colors, or the single `color` override, so
there is nothing on the part to attach a mark to. A viewer needs a record that
says where the text is, and `cad_laser_engraving_text` is that record. It
follows `cad_reference_surface`: the producer resolves the surface and the
placement once, and a renderer draws the text from the record alone.

## `source_laser_engraving_text`

| Field | Meaning |
| --- | --- |
| `source_component_id` | The part that is engraved. Required. |
| `name` | Optional name of the engraving, unique within the part. |
| `text` | The text to engrave. Must not be blank. |
| `engraving_depth` | Depth of material removed, in mm. Optional; no depth is assumed. |

## `cad_laser_engraving_text`

| Field | Meaning |
| --- | --- |
| `source_laser_engraving_text_id` | The engraving this geometry draws. Required. |
| `source_component_id` | The part that is engraved. Required. |
| `cad_component_id` | The CAD geometry the text sits on. Optional, for a part with no CAD component. |
| `cad_reference_surface_id` | The named reference surface the text was placed on, when there is one. Informational; the frame is already resolved. |
| `text` | The text as drawn, on a single line. Must not be blank. |
| `font` | `"tscircuit2024"`, the default. |
| `font_size` | Text height in mm, with the same metrics as PCB text in that font. Required. |
| `anchor_position` | Resolved anchor point on the surface. Required. |
| `anchor_alignment` | The point of the text's bounds that sits at the anchor. Defaults to `"center"`. |
| `normal_direction` | Outward unit normal of the engraved surface. Required. |
| `x_axis_direction` | Unit direction the text reads along. Required. |
| `color` | Color the engraved area is drawn in. Optional; a renderer derives one from the part. |

Distances accept unit strings such as `"3mm"` and parse to millimeters.
`text` appears in both records so that each can be read on its own: the source
record by a manufacturing export, the cad record by a renderer.

## Coordinate contract

- The frame is in right-handed circuit world: +X right, +Y top, +Z above.
- `anchor_position` is an absolute point in millimeters after assembly placement.
- `normal_direction` and `x_axis_direction` are finite, dimensionless unit
  directions, perpendicular to each other within a numerical tolerance of 1e-6.
- The text lies in the plane through `anchor_position` perpendicular to
  `normal_direction`. It reads along `x_axis_direction`, and its up direction
  is `normal_direction × x_axis_direction`, so it reads correctly when seen
  from the side `normal_direction` points to.
- Rotation on the surface is not a separate field. The producer applies it to
  `x_axis_direction`: text turned 90° clockwise on a top face has
  `x_axis_direction` along -Y.
- `anchor_alignment` refers to the extents of the engraved strokes. A
  `top_left` anchor is the top-left corner of the ink.

The producer applies the part's resolved transform once, as it does for
reference surfaces. Model-only position offsets do not move the text.

## Behavior in consumers

- **Explosions.** The text belongs to its component's surface. When an
  explosion moves `cad_component_id`, the text moves by the same offset. It is
  not listed in explosion stages or moves.
- **Rendering.** A renderer draws the glyphs on the surface in `color`. When
  that is omitted it picks a color that contrasts with the part. Depth is a
  manufacturing fact on the source record; a renderer may draw the text flat.
- **Manufacturing output.** An exporter reads the source records for what to
  engrave, and can project the cad records that share a `normal_direction`
  into that surface's 2D frame.

## Left out for now

- Engraved images. This proposal starts with text.
- Text style (filled or outlined letters) and raster settings from the props.
- Curved surfaces. The text is planar.

## Open questions

- **Where the drawn color lives.** The props `resultingColor` maps to
  `cad_laser_engraving_text.color`. It could instead sit on the source record
  as a property of the engraving.
- **A dedicated record or a generic one.** `cad_laser_engraving_text` names the
  process, like `pcb_silkscreen_text` and `pcb_copper_text` name their layer.
  The alternative is a process-neutral `cad_surface_text` that other marking
  processes reuse.
- **Direction names.** This record uses `normal_direction` and
  `x_axis_direction`. `cad_reference_surface`, which is already released,
  calls the same two directions `normal` and `x_axis`.
