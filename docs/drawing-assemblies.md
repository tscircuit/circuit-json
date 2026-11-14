# Exploded assembly drawings

Drawing configurations describe static presentation, independently of the existing ordered `cad_explosion_stage` / `cad_explosion_move` playback API. `drawing_assembly_stage` composes named sets of source components and PCB substrates; each `drawing_explosion_view` contains simultaneous translations from assembled placement in its `moves` array. Neither modifies source placement or runs CAD playback stages.

## Mapping from the authoring API

The initial authoring API was introduced in [props #1009](https://github.com/tscircuit/props/pull/1009). The follow-up [props #1010](https://github.com/tscircuit/props/pull/1010) places `moves`, `factor` and `showTrails` directly on `assembly.drawing.explosionview`. Registering the TSX elements and resolving selectors into Circuit JSON remain core work.

| TSX authoring input | Circuit JSON output |
| --- | --- |
| `assembly.drawing.page` with `anchorAlignment` | `drawing_page.anchor_alignment`, using the same nine-point enum; omitted means `center` |
| `assembly.drawing.stage` with `partRefs`, `boardRefs`, `includeStageRefs` | `drawing_assembly_stage` with resolved `source_component_ids`, `pcb_board_ids`, `includes_stage_ids` |
| `moves` with `offX`/`offY`/`offZ` on `assembly.drawing.explosionview` | `drawing_explosion_view.moves[].translation`, in normalized CAD-world mm |
| `assembly.drawing.explosionview` with `stageRef`, `factor`, `showTrails` | `drawing_explosion_view` with required `drawing_assembly_stage_id`, optional `factor` and `show_trails` |
| `assembly.drawing.partview` with `stageRef` | `drawing_part_view.drawing_assembly_stage_id`; assembled geometry without an explosion reference |
| `centerX`/`centerY` on either view | `center.x`/`center.y`, resolved relative to the page anchor; core resolves relative sibling layout first |
| `paperX`/`paperY` on `partlabel` or `note` | `label_position.x`/`.y` or `position.x`/`.y`, in paper mm relative to the page anchor |
| `xOffsetFromViewCenter`/`yOffsetFromViewCenter` | `x_offset_from_view_center`/`y_offset_from_view_center`, instead of the corresponding absolute axis |
| An annotation's enclosing view, or a note's explicit `viewRef` | Exactly one resolved `drawing_part_view_id` or `drawing_explosion_view_id`; notes also carry their `drawing_page_id` |

Absolute page notes do not require a view reference. For view-relative notes, core resolves `viewRef` when supplied, otherwise the enclosing view, and checks that it belongs to the same page. Unit strings are normalized to numeric mm before emission. The merged page API uses a named `anchorAlignment`, not a numeric `origin` point.

## Example records

```ts
const records = [
  { type: "drawing_assembly_stage", drawing_assembly_stage_id: "rotor", name: "rotor",
    source_component_ids: ["cap", "encoder_magnet", "bearing"] },
  { type: "drawing_assembly_stage", drawing_assembly_stage_id: "complete", name: "complete",
    includes_stage_ids: ["stationary", "rotor"] },
  { type: "drawing_explosion_view", drawing_explosion_view_id: "join_view", drawing_page_id: "sheet",
    drawing_assembly_stage_id: "complete", factor: 1, show_trails: true,
    moves: [{ includes_stage_ids: ["rotor"], translation: { x: 0, y: 0, z: 40 } }],
    direction: "isometric", center: { x: 0, y: 0 }, width: 130, height: 140 },
]
```

The enclosing document supplies the source components, `stationary` stage and `sheet` page. All translations are CAD-world millimetres (+Z up), relative to original assembled placement. Omitted factor is 1; factor 0 restores the assembled pose. Targets may include parts, boards, or nested stages. A populated PCB stage explicitly includes its `pcb_board_id` and fitted components. Repeated stage membership deduplicates; separate moves must not overlap. Stage inclusion is not an insertion sequence or implicit accumulation from previous stages.

Record schemas validate IDs, nonempty selections, finite coordinates and scalar ranges. Document consumers must reject duplicate record IDs, missing references, nesting cycles, overlapping expanded move targets, and selected geometry unavailable from the scene resolver. `drawing_explosion_view` requires `drawing_assembly_stage_id` and a nonempty `moves` array, rejects legacy source selectors, and shares direction, page layout, scale, hidden-edge and section controls with `drawing_part_view`. An ordinary part view may select a stage but rejects explosion settings; it always shows assembled geometry. Migrate the earlier unreleased exploded-part-view spelling to the new record type and ID. Existing assembled views retain their behavior.

Both `drawing_part_label` and `drawing_dimension_line` require exactly one parent reference: `drawing_part_view_id` or `drawing_explosion_view_id`. Consumers must validate that the referenced ID belongs to the matching view type. Dimensions remain preformatted paper primitives.

`drawing_part_label` attaches plain text to a target selection. `anchor` is an assembled CAD-world point; it follows that selection's explosion translation. `label_position` is relative to `drawing_page.anchor_alignment` in paper mm (+X right, +Y up). Each axis may instead use `x_offset_from_view_center`/`y_offset_from_view_center` to follow the enclosing view center. Label targets must be visible in their view and share the same translation. `drawing_page_note` places plain text at an anchor-relative left baseline; its positive `font_size` is paper mm (default 2.7). No embedded image, model geometry or generated drawing output belongs in these records.

Rendering, label collision avoidance and mechanical insertion-path validation are separate concerns. These offsets describe a drawing pose, not verified assembly motion. TSX selector resolution and emission are follow-up core work. The renderer implementation and fidget-counter visual examples are in [circuit-json-to-drawing #10](https://github.com/tscircuit/circuit-json-to-drawing/pull/10).

## Page anchor alignment

`drawing_page.anchor_alignment` uses the board's nine-point anchor enum: `top_left`, `top_center`, `top_right`, `center_left`, `center`, `center_right`, `bottom_left`, `bottom_center`, `bottom_right`. Omission means `center`. The selected sheet location is (0, 0) for view centers, absolute annotations and resolved dimension points. Axes always remain +X right and +Y up. Resolve the anchor from the page's final dimensions; top anchors therefore use negative Y for points inside the sheet. There is no numeric `origin` field.

For a resolved physical anchor `a` measured from the lower-left, SVG coordinates are `{ x: a.x + p.x, y: height - (a.y + p.y) }`. Consumers apply this once and check physical sheet bounds. Model coordinates and sheet-attached borders/title blocks are unaffected.

Labels and notes independently select exactly one position per axis: `label_position.x`/`position.x` or `x_offset_from_view_center`, and `.y` or `y_offset_from_view_center`. A missing axis or both modes on one axis is invalid, including explicit zero conflicts. Absolute points may contain only the selected axes, or be omitted for two offsets. Offsets are finite paper mm from the referenced view's center, not model coordinates. Mixed modes are supported.

Labels always carry one typed view reference. Notes with offsets require exactly one `drawing_part_view_id` or `drawing_explosion_view_id`; absolute notes may omit that reference. Consumers reject missing, wrong-type or cross-page referenced views. Core resolves TSX `viewRef` or an enclosing view into that ID. `drawing_dimension_line` remains resolved paper primitives relative to the page anchor.

## Migration from standalone drawing explosions

Remove each `drawing_explosion` record and copy its `moves`, `factor` and `show_trails` onto the `drawing_explosion_view` records that used it. Remove their `drawing_explosion_id` references. The standalone `DrawingExplosion` type, schema and public union entry are removed; obsolete references are rejected. `DrawingExplosionMove` is a nested value type, not a Circuit JSON element. Stage membership remains reusable, while each view can use independent offsets and factors without affecting any other view or assembled placement.
