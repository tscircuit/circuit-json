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

`drawing_dimension` describes one measurement in one `drawing_part_view_id`.
`measurement` distinguishes an actual model-defined edge from an explicitly
requested inferred view extent. There is no manually authored numeric label or
text override. Arrowheads, extension lines, text layout, and generated images
remain exporter concerns.

### Model-defined edges

For `measurement: "edge"` (the default), `cad_named_edge_id` is required and
references one `cad_named_edge` belonging to a CAD component. A model definition
must actually author that named straight edge and its endpoints, for example
`outer_top` on the end profile of a rectangular tube. Names are stable across
parameter changes and independent of mesh vertex ordering. An arbitrary string
such as `overall_width` does not request a bounding-box measurement.

`cad_named_edge` endpoints are finite, distinct absolute points in right-handed
CAD world XYZ, in numeric mm: +X right, +Y top, +Z above. The model producer owns
its semantic geometry definition. The record stores an analytic line, rather
than a tessellation index, and does not add solid material. Inferring the view
bounds and publishing them as fabricated named edges is not permitted.

Modelprinter can author edges in model-local coordinates. A producer such as
core must resolve the selector to a model-defined edge and transform both
endpoints as **points**, applying the same scale, rotation, and translation as
the owning CAD model exactly once. Consumers must not reapply that transform.
Names must be unique within their CAD component. IDs are document-wide unique.

```ts
// outer_top is an actual named edge from the model's 40 × 25 × 2 mm tube profile.
const edge = {
  type: "cad_named_edge",
  cad_named_edge_id: "edge_tube_outer_top",
  cad_component_id: "cad_tube",
  name: "outer_top",
  start: { x: -20, y: 12.5, z: 0 },
  end: { x: 20, y: 12.5, z: 0 },
}
const edgeDimension = {
  type: "drawing_dimension",
  drawing_dimension_id: "dimension_tube_top",
  drawing_part_view_id: "tube_end_view",
  measurement: "edge",
  cad_named_edge_id: "edge_tube_outer_top",
  orientation: "horizontal",
  offset: 8,
}
```

The corresponding authoring intent is
`<assembly.drawing.dimension edgeRef=".tube > .outer_top"
orientation="horizontal" offset="8mm" />` nested within a part view. Props
preserve the selector. Eventual core support resolves the actual named edge on
the selected model and emits its ID. Circuit JSON consumers do not parse TSX
selectors or interpret arbitrary edge names as measurement requests.

### Explicit view extent presets

`measurement: "view_width"` and `"view_height"` request the inferred extent of
that part view's selected rendered geometry along its camera right/up model
axes. Presets use only the part-view reference: `cad_named_edge_id` is forbidden,
and no synthetic edge record is generated. These measurements are model mm,
not the width or height of the paper viewport or its fitted raster image.

```ts
const widthDimension = {
  type: "drawing_dimension",
  drawing_dimension_id: "dimension_tube_envelope_width",
  drawing_part_view_id: "tube_end_view",
  measurement: "view_width",
  offset: -8,
}
```

The TSX equivalents are `<assembly.drawing.dimension widthOfView />` and
`<assembly.drawing.dimension heightOfView />`. A producer maps these explicit
requests to `view_width`/`view_height`, instead of inventing named edges.
View-width orientation normalizes to `horizontal`, view-height to `vertical`.
Omitting orientation or supplying the matching orientation is accepted. A
conflicting explicit orientation is rejected.

### Values, placement, and validation

For edges, orientations are `aligned` (default), `horizontal`, or `vertical`.
Aligned labels show true 3D endpoint distance, including in an isometric view.
Horizontal/vertical labels show the absolute component along the camera's
right/up model axes. Presets measure the rendered selection's camera-axis
extent. Neither path measures pixels or paper mm: values remain model mm when
a viewport fits or changes scale. Measurement does not constrain model geometry.

`offset` is signed finite **paper-space** mm, default 8. Its sign follows the
left normal of the projected dimension line in paper coordinates, +X right and
+Y up. Aligned edge dimensions preserve authored start/end order. Horizontal and
vertical dimensions normalize increasing paper X and Y respectively: positive
horizontal is above, positive vertical is left. Negative offsets choose the
other side. `precision` is integer decimal places 0–6, default 1. Parsing
materializes `measurement`, canonical `orientation`, `offset`, and `precision`.

Schema validation rejects blank IDs/names, nonfinite points or offsets,
coincident edge endpoints, invalid measurement/orientation/precision, missing
edge references for edge mode, and edge references on view presets. Names/IDs
trim outer whitespace. Unknown fields are stripped by the existing object
schema convention, including unsupported numeric/text overrides. These are new
additive records, with no aliases or migrations. Angular, radius, diameter,
tolerance, and GD&T annotations remain future extensions.

Document consumers validate the referenced view and, in edge mode, the edge and
its owning CAD model. The edge must be defined by a model in the selected
geometry. Duplicate names within an owner, duplicate IDs, missing references,
and zero projected measurements are document errors. Those checks require
model/document context. Section clipping and annotation placement remain
renderer responsibilities.

The initial line/extension-line conventions follow common
[aligned dimension](https://help.autodesk.com/cloudhelp/2027/ENG/AutoCAD-Core/files/GUID-D7C05A85-8985-4576-B22C-5A795DD5B179.htm)
and [linear dimension](https://github.com/FreeCAD/FreeCAD-documentation/blob/main/wiki/TechDraw_LengthDimension.md)
concepts. The proposal does not claim complete drafting-standard compliance.

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
