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

## Associated linear dimensions

`drawing_dimension` associates one `drawing_part_view_id` with one
`cad_named_edge_id`. This is drawing intent, not exporter output: arrowheads,
extension lines, text layout, and generated images remain renderer concerns.
No manually authored measurement value or text override is stored. The label is
derived from the associated segment so it changes with the model geometry.

`cad_named_edge` describes an authored analytic reference segment or measurement
datum with a stable semantic name (for example `overall_width`). It belongs to
one `cad_component_id` and has finite, distinct `start` and `end` points in
right-handed CAD world XYZ, in numeric mm: +X right, +Y top, +Z above. It adds no
solid material and does not depend on mesh vertex/edge ordering. A named segment
can describe a real sharp feature edge or an explicitly authored nominal-envelope
datum; it does not claim to be final B-rep topology.

Modelprinter can author those references in model-local coordinates. A producer
such as core must transform both endpoints as **points**, applying the same model
scale, rotation, and translation as the owning CAD model exactly once. Consumers
receive world points and must not reapply that transform. Names must be unique
within their CAD component; IDs must be unique across the document.

```ts
// The referenced CAD model and part view are existing document records.
// This is the lower outer edge of a 40 × 25 × 2 mm rectangular tube end section.
const edge = {
  type: "cad_named_edge",
  cad_named_edge_id: "edge_tube_width",
  cad_component_id: "cad_tube",
  name: "overall_width",
  start: { x: -20, y: -12.5, z: 0 },
  end: { x: 20, y: -12.5, z: 0 },
}
const dimension = {
  type: "drawing_dimension",
  drawing_dimension_id: "dimension_tube_width",
  drawing_part_view_id: "tube_end_view",
  cad_named_edge_id: "edge_tube_width",
  orientation: "horizontal",
  offset: -8,
  precision: 1,
}
```

The corresponding authoring intent is a nested
`<assembly.drawing.dimension edgeRef="overall_width" orientation="horizontal"
offset="-8mm" precision={1} />` within a part view of the tube. Props preserve
the semantic edge name; eventual core support resolves it to an edge ID on the
view's selected CAD part. Renderers do not parse TSX selectors or mesh names.

Dimension orientations are `aligned` (default), `horizontal`, or `vertical`.
Aligned labels show the true 3D distance between endpoints, including in an
isometric view. Horizontal/vertical labels show the absolute component along
the camera's right/up model axes. They never measure raster pixels or paper mm.
Labels therefore remain in model mm when a viewport fits or changes scale.
Orientation does not change or constrain model geometry.

`offset` is signed finite **paper-space** mm, default 8. Its sign follows the
left normal of the projected dimension line in paper coordinates (+X right,
+Y up). Aligned dimensions preserve authored start/end order. Horizontal and
vertical dimensions normalize endpoint order to increasing paper X and Y,
respectively: positive horizontal is above, positive vertical is left. Negative
offset selects the other side. `precision` is decimal places, integer 0–6,
default 1; 0 and 6 are both accepted. Defaults are materialized when parsing.

Schema validation rejects blank IDs/names, nonfinite points or offsets,
coincident endpoints, invalid orientations, and invalid precision. Names/IDs
trim outer whitespace. Unknown fields are stripped under the existing object
schema convention, including unsupported measurement/text overrides. These are
new additive records; there are no aliases or migrations. Angular, radius,
diameter, tolerance, and GD&T annotations remain future extensions.

Document consumers must validate that dimension view and edge IDs resolve, the
edge's CAD owner exists and belongs to the view's selected geometry, and no
projected dimension is degenerate. Duplicate edge names within an owner and
duplicate IDs are document errors. Those checks require document/scene context
and do not belong to individual-record parsing. Section clipping and annotation
placement also remain renderer responsibilities.

The initial line/extension-line conventions follow common
[aligned dimension](https://help.autodesk.com/cloudhelp/2027/ENG/AutoCAD-Core/files/GUID-D7C05A85-8985-4576-B22C-5A795DD5B179.htm)
and [linear dimension](https://github.com/FreeCAD/FreeCAD-documentation/blob/main/wiki/TechDraw_LengthDimension.md)
concepts; the proposal does not claim complete drafting-standard compliance.

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
