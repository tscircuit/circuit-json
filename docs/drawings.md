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
