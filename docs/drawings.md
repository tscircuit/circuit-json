# Drawing page and part-view configuration

`drawing_page` configures paper layout for `<assembly.drawing.page>`.
`drawing_part_view` configures a view of selected assembly geometry for
`<assembly.drawing.partview>`. There is no generated asset element or image URL:
Circuit JSON describes what to draw, and exporters decide how to render it.

A page has `drawing_page_id`, optional name/display_name and positive width/height
in mm. A part view has `drawing_part_view_id`, a `drawing_page_id` reference,
center/width/height in paper mm, direction, optional scale, hidden-edge visibility
and a section plane. Each part view may select `source_group_id` (including its
descendants) and/or narrow the selection to `source_component_ids`. Without either
selector the enclosing assembly's geometry is used. Core resolves TSX target
selectors to these source IDs; renderers do not resolve TSX selectors or GLB names.
Different part views on the same page can show different geometry.

## Resolved dimension lines

`drawing_dimension_line` contains the resolved strokes and text for one dimension
associated with a `drawing_part_view_id`. Core computes the model measurement,
projects and places the annotation, and formats its measured text before emitting
Circuit JSON. The drawing renderer draws the supplied result without loading a
model, resolving a feature name, or recomputing a value from the paper span.

```ts
const dimensionLine = {
  type: "drawing_dimension_line",
  drawing_dimension_line_id: "tube_outer_width",
  drawing_part_view_id: "tube_end_view",
  start: { x: -10, y: 20 },
  end: { x: 10, y: 20 },
  text: "40.0 mm",
  edge_ref_start: { x: -10, y: 10 },
  edge_ref_end: { x: 10, y: 10 },
  edge_ref_name: "outer_top",
  name: "outer-width",
}
```

All four point fields use absolute **page-centered paper mm**, +X right and +Y
up. They are not local to the part view, model coordinates, or raster pixels.
Do not apply the part view's center or model placement a second time. `start` and
`end` are required finite numeric points and must be distinct. Their authored
order is preserved, and the line may have any direction.

`text` is required, nonblank, preformatted measured text. It is preserved exactly,
including Unicode, units, tolerances, and surrounding whitespace. Its value need
not equal the paper length: the example spans 20 paper mm at 1:2 but displays the
40 mm model measurement computed by core. The renderer does not infer units,
precision, or a model-space measurement from this string or line length.

`edge_ref_start` optionally supplies the attachment point for the witness line
leading to `start`; `edge_ref_end` independently supplies the attachment leading
to `end`. Either, both, or neither may be present. A single witness attachment is
valid. Each uses the same finite paper coordinates and may coincide with its
corresponding dimension endpoint. The renderer supplies arrowheads, strokes,
and text layout using the resolved endpoints and optional attachments.

`edge_ref_name` is optional metadata identifying the model-defined feature that
core used. It must be nonblank and is preserved exactly. It does not define native
geometry, carry an owning-model reference, or participate in rendering. Omitting
it must not prevent the dimension from being drawn. Optional `name` is the stable
annotation identity, separate from the displayed measurement.

The record carries no model-measurement targets, inferred-view flags, orientation,
offset, precision, or native edge geometry. Those are resolved before emission.
STEP/glTF/JSCAD readers continue to own native geometry; it is never serialized
as endpoint geometry in this drawing record. Paper witness attachments describe
annotation strokes, not model features or topology.

Parsing validates required IDs and text, finite numeric points, distinct line
endpoints, and a nonblank optional feature name. Unknown fields are stripped
under the existing object-schema convention. There are no defaults or aliases.
The previous unreleased `drawing_dimension` record and its types are replaced;
old records are rejected by `any_circuit_element` rather than migrated.

Consumers validate document-level references and uniqueness: the part view must
exist, annotation IDs must be unique, and page placement/clipping uses the part
view's referenced page. Record validation does not constrain annotations to the
view's viewport or resolve optional metadata. Core's TSX processing and model
measurement remain upstream of this resolved drawing format.

CAD coordinates use mm, +Z up. Paper origin is page center, +X right/+Y up.
Directions use snake_case: x_positive/x_negative/y_positive/y_negative/
z_positive/z_negative/isometric. The named axis side is where the camera sits,
looking toward the selected geometry's center. X/Y views use +Z paper up; Z views
use +Y paper up. Isometric observes from positive X/Y/Z. TSX signed axis literals
map to these canonical values, e.g. z+ becomes z_positive.

Scale is model-to-paper: 0.5 means 1:2. Omit to fit with a margin. Explicit scale
clips excess geometry to the viewport. Hidden edges default to omitted; enabling
them uses dashed strokes. There is no style enum or authored image/resource field.

Sections use CAD world mm: axis, finite offset and explicit keep_side. less keeps
coordinates <= offset; greater keeps >= offset. hatch_spacing defaults to 1mm,
measured perpendicular to 45-degree hatch strokes. Cavities remain empty and open
contours remain uncapped. Renderers must transform offsets and retained sides
along with axes at coordinate boundaries (CAD to glTF: x,y,z -> x,z,-y).

IDs must be unique and part-view page references must resolve; consumers enforce
these document-level constraints. All numbers are finite. These new records have
no aliases or migration requirements. They intentionally describe configuration
only; rendered files belong to exporter output, not Circuit JSON.

## Standard references

Named sheet sizes use `iso_a0`–`iso_a4` and `ansi_a`–`ansi_e`, with `landscape` (default) or `portrait` orientation. Custom pages retain explicit width and height. Dimensions are always mm; ANSI inch dimensions are converted exactly using 25.4 mm/in (ANSI A is 279.4 × 215.9 mm in landscape).

- [ISO 5457:1999](https://www.iso.org/standard/29017.html): drawing-sheet sizes and layout.
- [ASME Y14.1](https://www.asme.org/codes-standards/find-codes-standards/drawing-sheet-size-and-format): metric and decimal-inch drawing sheets.
- [Autodesk Fusion sheet-size reference](https://help.autodesk.com/cloudhelp/ENU/Fusion-Drawing/files/DWG-REF-SHEET-SIZE.htm): interoperable ISO A0–A4 and ANSI A–E dimensions.
- [ISO 7200:2004](https://www.iso.org/standard/35446.html): title-block and document-header data fields.

These references guide sizes and metadata terminology. This proposal does not claim complete ISO/ASME template compliance or prescribe a projection method. Sheet orientation does not rotate model views.

A `drawing_page` retains resolved numeric `width`/`height` and optional `page_size`/`orientation`; supplied dimensions must match the named size. `getDrawingPageDimensions("iso_a4", "landscape")` returns `{width: 297, height: 210}`. Omitting page_size preserves custom-page compatibility; orientation without page_size is rejected.

A separate optional `drawing_page_title_block` references `drawing_page_id` and has its own `drawing_page_title_block_id`. It requires `title`; optional fields are `legal_owner`, `identification_number`, `revision_index`, `date_of_issue`, `creator`, `approval_person`, `sheet_number`, and `number_of_sheets`. No images or generated assets are stored in it. Dates are caller-authored strings. Sheet numbers/counts are positive integers; a supplied number cannot exceed its total.
