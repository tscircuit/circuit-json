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
Select exactly one target: `cad_component_id` plus `edge_name`,
`width_of_view: true`, or `height_of_view: true`. There is no target enum or
implicit view-extent default. Circuit JSON stores dimension intent, not edge geometry:
STEP, glTF, and JSCAD model readers own their edge definitions, names, and
native topology. No new geometry or topology record is introduced for dimensions.
Numeric labels, arrowheads, extension lines, and text layout are exporter output.

### Model-reader edge targets

To dimension a model edge, supply both `cad_component_id` and `edge_name`. The CAD ID selects the owning model. `edge_name` is an opaque name
published by that model's reader and must match it exactly. The schema rejects
blank names but preserves the supplied string, including outer whitespace.
Circuit JSON does not invent names, define endpoint coordinates, or interpret
edge names as bounding-box measurement requests.

```ts
const edgeDimension = {
  type: "drawing_dimension",
  drawing_dimension_id: "dimension_tube_top",
  drawing_part_view_id: "tube_end_view",
  cad_component_id: "cad_tube",
  edge_name: "outer_top", // A name actually supplied by the model reader.
  orientation: "horizontal",
  offset: 8,
}
```

The authoring intent is
`<assembly.drawing.dimension edgeRef=".tube > .outer_top"
orientation="horizontal" offset="8mm" />` nested within a part view. Eventual
core support resolves the owning model selector and reader-defined edge name,
then emits `cad_component_id` plus `edge_name`. The selector does not become
edge geometry in Circuit JSON. The reader must expose the selected feature;
an arbitrary name such as `overall_width` does not infer any measurement.

A consumer resolves the actual edge through the STEP/glTF/JSCAD reader and uses
the same units and model placement as the rendered geometry. It must not assume
that a mesh vertex index or source-local point is already a world-space edge.
Reader adapters are responsible for converting native model units to mm and
applying model/world transforms consistently, exactly once. The reader supplies
the native edge geometry, which may be an open line, curved path, or closed
profile. The schema does not define or restrict that geometry. The first exporter
supports horizontal/vertical extents of native paths, including curved or closed
profiles. Aligned dimensions support straight open edges and reject unsupported
geometry rather than silently measuring an endpoint chord. Radius, diameter,
and angular annotation modes remain follow-up work.

### Explicit view extent presets

`width_of_view: true` and `height_of_view: true` infer the selected rendered
geometry's extent along the camera's right/up model axes. These modes use only
the part-view reference: `cad_component_id` and `edge_name` are both forbidden.
They do not request a model edge, manufacture an edge name, or duplicate model
geometry in Circuit JSON. Values are model mm, not paper viewport dimensions
or fitted raster-image size.

```ts
const widthDimension = {
  type: "drawing_dimension",
  drawing_dimension_id: "dimension_tube_envelope_width",
  drawing_part_view_id: "tube_end_view",
  width_of_view: true,
  offset: -8,
}
```

The TSX equivalents are `<assembly.drawing.dimension widthOfView />` and
`<assembly.drawing.dimension heightOfView />`. Core maps these explicit boolean
flags directly to `width_of_view` and `height_of_view`. View-width orientation normalizes to
`horizontal`, view-height to `vertical`. Omission or the matching explicit
orientation is accepted; conflicting orientation is rejected. False flags do not
select a target and are omitted from the parsed result. Both true flags, a flag
plus any edge-target field, or an incomplete CAD component/edge-name pair are
errors. Omitting all targets is an error; no target is inferred by default.

### Values, placement, and validation

For edges, orientation is `aligned` (default), `horizontal`, or `vertical`.
Aligned labels request true 3D straight-edge distance, including in an isometric
view. Horizontal/vertical labels request native edge extents along camera right/up
axes, using all sampled points or equivalent analytic geometry. Consumers reject
unsupported curved aligned measurements rather than substitute an endpoint chord.
View presets measure the selected rendered geometry after its transforms and
section cuts. Neither path measures paper mm or pixels, so values do not change
with viewport fit, physical page scale, or raster resolution. Measurement does
not constrain or modify the model.

`offset` is signed finite **paper-space** mm, default 8. Its sign follows the
left normal of the projected dimension line in paper coordinates, +X right and
+Y up. Aligned edge dimensions preserve the reader's start/end order.
Horizontal/vertical dimensions normalize increasing paper X/Y respectively:
positive horizontal is above, positive vertical is left. Negative offsets
choose the other side. `precision` is integer decimal places 0–6, default 1.
Parsing materializes canonical `orientation`, `offset`, and `precision`;
edge targets remain absent for view presets and false view flags are omitted.

Record parsing rejects blank IDs/names, nonfinite offsets, invalid orientation
or precision, nonboolean flags, missing either edge-target field, multiple
selected targets, and no selected target. Unknown fields are stripped under the
existing object-schema convention, including unsupported numeric/text overrides.
The record is new and additive; no aliases or migration are provided.

Document consumers resolve the view and, for an edge measurement, its owning
CAD model and reader-defined edge. The owner must belong to the view's selected
geometry. Missing or ambiguous model features and zero projected measurements
are errors. Those checks require document/model-reader context and cannot be
performed by individual-record validation. Model-reader feature naming and
topology are not defined by this schema proposal. Native model-reader integration
and core TSX emission remain follow-up work.

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
