# Drawing elements proposal

`drawing` describes an engineering drawing sheet, `drawing_view` places orthographic
outline viewports on it, and `drawing_artifact` identifies generated assets.
They serialize `<assembly.drawing>` and `<assembly.drawingview>` from props.
There is no style enum: views use white occluding surfaces, black visible edges,
optional dashed hidden edges and diagonal section hatching.

All dimensions and positions are numeric mm. CAD coordinates are right-handed
with +Z up. Paper coordinates have their origin at the sheet center, +X right and
+Y up. Every view references a drawing ID; every artifact references its drawing
and optionally one view. Producers/consumers must reject duplicate IDs and dangling
references; the per-element schemas cannot enforce cross-document references.

A drawing may select a source group (including descendants) and optionally narrow
that selection to source component IDs. Without selectors the whole circuit is
selected. TSX target selectors must be resolved to these IDs by core. An optional
`model_glb_url` supplies a pre-exported scene for exactly that selected geometry;
its glTF coordinates are +Y up, with units already converted to mm. Selection is
performed before export, never by a renderer guessing names inside a GLB.

Directions are snake_case enum values. `x_positive` places the camera on the CAD
+X side looking toward the model center. X/Y views have +Z paper up; Z views have
+Y up. Isometric observes from positive X/Y/Z. TSX signed axis names map to these
canonical values (e.g. `z+` becomes `z_positive`).

Viewport center/width/height are paper-space mm. Optional scale is the model-to-paper
ratio: 0.5 means 1:2. Omission auto-fits with a margin. Explicit scale clips excess
geometry at viewport boundaries. Resolution is an exporter option, not design data.
`show_hidden_edges` defaults to false. There is no perspective projection here.

Section offset and hatch spacing are in CAD world mm. `keep_side: less` retains
coordinates <= offset; `greater` retains >= offset. Hatch spacing defaults to 1mm
in model space, measured perpendicular to 45-degree hatch strokes. Cavities stay
empty; open cut contours remain uncapped. Renderers must transform axes, offsets
and retained sides together when converting to glTF coordinates.

`drawing_artifact` is derived output, not another source of drawing intent. A sheet
SVG can contain embedded PNG views; view PNG artifacts carry `drawing_view_id`.
URLs can be data URIs or uploaded asset locations. Optional pixel dimensions are
positive integers. Regenerating artifacts replaces previous artifacts for that
sheet/view; it must not change the input drawing/view records.

No existing records change. Page dimensions, IDs, view dimensions, directions and
section retained sides are explicit; optional scale means fit, optional hidden
edges means omitted. No aliases or migration behavior are introduced.
