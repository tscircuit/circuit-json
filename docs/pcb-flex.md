# PCB bends and stiffeners

`pcb_bend` and `pcb_stiffener` describe physical features on a flat PCB. They do
not select a rendering mode or store a folded copy of the layout. A viewer can
render the same Circuit JSON flat or folded at runtime.

## Bend

```json
{
  "type": "pcb_bend",
  "pcb_bend_id": "pcb_bend_1",
  "pcb_board_id": "pcb_board_1",
  "name": "B1",
  "start": { "x": 0, "y": -10 },
  "end": { "x": 0, "y": 10 },
  "bend_angle": 90,
  "bend_radius": 3,
  "bend_side": "right"
}
```

`start` and `end` are the centerline of a finite-width bend zone. Coordinates are
millimeters relative to the referenced board's center, with axes aligned to the
flat PCB top view (+x right, +y up). Parent-group placement and rotation must be
resolved into this frame before serialization. `pcb_group_id` and `subcircuit_id`
are optional ownership metadata and do not introduce additional transforms.
These conventions apply to the two new elements; existing elements retain their
current coordinate semantics.

`bend_side` selects the moving side looking from `start` to `end` in that top
view. Positive `bend_angle` folds that side toward the local top face; negative
angles fold it toward the bottom. Angles are signed degrees, with zero meaning
flat. `bend_radius` is measured at the neutral surface, not the inside surface.
The developed bend-zone width is `bend_radius * abs(bend_angle * pi / 180)` and
is centered on the line. The remaining portion on the opposite side stays fixed
for an isolated bend.

The viewer may ignore the fold when rendering flat, without changing the target
angle in the record. Multiple bends require a consistent connected-region
transform model, independent of JSON array order. Board-level checks and the
folding algorithm are downstream responsibilities.

## Stiffener

```json
{
  "type": "pcb_stiffener",
  "pcb_stiffener_id": "pcb_stiffener_1",
  "pcb_board_id": "pcb_board_1",
  "name": "S1",
  "shape": "rect",
  "center": { "x": 24, "y": 0 },
  "rotation": 0,
  "width": 12,
  "height": 20,
  "layer": "bottom",
  "material": "fr4",
  "thickness": 0.4,
  "adhesive_thickness": 0.05
}
```

A rectangle is centered at `center` in the same board-relative frame as a bend.
`rotation` is counterclockwise degrees in the flat top view; omission means zero
but is preserved as omitted by the parser. Width and height are measured before
rotation. `layer` is the attachment face (`top` or `bottom`). Material is `fr4`,
`polyimide`, `stainless_steel`, or `aluminum`. Stiffeners add mechanical material,
not copper layers or regional rigid-flex stackups.

`thickness` excludes board and adhesive thickness. `adhesive_thickness` is
optional; omission means unspecified, not zero.

A polygon replaces `center`, `rotation`, `width`, and `height` with `outline`:

```json
{
  "type": "pcb_stiffener",
  "pcb_stiffener_id": "pcb_stiffener_2",
  "pcb_board_id": "pcb_board_1",
  "shape": "polygon",
  "outline": [
    { "x": 19, "y": -4 },
    { "x": 29, "y": -4 },
    { "x": 29, "y": 2 },
    { "x": 27, "y": 4 },
    { "x": 19, "y": 4 }
  ],
  "layer": "bottom",
  "material": "fr4",
  "thickness": 0.4
}
```

Polygon vertices are implicitly closed and already include all placement and
rotation, relative to the board center. Either winding is accepted. Polygon
`center`/`rotation`/`width`/`height` and rectangle `outline` are rejected to avoid
conflicting geometry. Simple-polygon validity, board containment, and overlap
with bend zones require downstream geometry checks.

## Runtime CAD behavior

The stored PCB components, traces, pads, and outline remain flat. Stored
`cad_component.position` and `rotation` also retain their flat pose. A folded
viewer derives a transform at the component's mounting position and composes it
with the flat CAD pose, preserving model offsets, height, and bottom-side
orientation. Board/assembly placement is applied in the appropriate enclosing
frame. The CAD model moves and rotates as a rigid object; it is not itself bent.

Board and copper geometry are curved through the bend zones. Stiffeners follow
the attached portion as rigid geometry. Components and stiffeners intersecting
bend zones require downstream validation. Rendering does not overwrite Circuit
JSON, allowing simultaneous flat/folded views and avoiding cumulative transforms.

This change defines elements only. Viewer options, saved fold-state preferences,
CAD transforms, fabrication exports, and changes to board material enums are
outside its scope.

## Parsing and compatibility

Schemas and corresponding input/output types are exported from the package root,
and both elements participate in `any_circuit_element` and `PcbCircuitElement`.
Input distances accept numbers or existing unit strings and normalize to mm;
angles use the existing rotation parser and normalize to degrees. Output types
use numeric geometry. Angles are not clamped or wrapped.

Primary IDs are generated with the normal element prefix if omitted. Board ID,
bend geometry, and stiffener shape/geometry/material/face/thickness are required.
There are no aliases or implicit material/angle/radius/thickness defaults.
Endpoints must be finite and distinct after normalization. Radii and material
and rectangle dimensions must be finite and positive. Adhesive thickness can
be zero. Polygon outlines need at least three finite points and nonzero signed
area. Unknown keys follow the repository's usual Zod stripping behavior.

Existing records and their semantics are unchanged. Board-reference existence
and manufacturing constraints are not checked by an individual element parser.
