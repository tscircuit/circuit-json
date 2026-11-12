# Exploded assembly drawings

Drawing configurations describe static presentation, independently of the existing ordered `cad_explosion_stage` / `cad_explosion_move` playback API. `drawing_assembly_stage` composes named sets of source components and PCB substrates; `drawing_explosion` describes simultaneous translations from assembled placement. Neither modifies source placement or runs CAD playback stages.

```ts
const records = [
  { type: "drawing_assembly_stage", drawing_assembly_stage_id: "rotor", name: "rotor",
    source_component_ids: ["cap", "encoder_magnet", "bearing"] },
  { type: "drawing_assembly_stage", drawing_assembly_stage_id: "complete", name: "complete",
    includes_stage_ids: ["stationary", "rotor"] },
  { type: "drawing_explosion", drawing_explosion_id: "join", factor: 1, show_trails: true,
    moves: [{ includes_stage_ids: ["rotor"], translation: { x: 0, y: 0, z: 40 } }] },
  { type: "drawing_explosion_view", drawing_explosion_view_id: "join_view", drawing_page_id: "sheet",
    drawing_assembly_stage_id: "complete", drawing_explosion_id: "join",
    direction: "isometric", center: { x: 0, y: 0 }, width: 130, height: 140 },
]
```

The enclosing document supplies the source components, `stationary` stage and `sheet` page. All translations are CAD-world millimetres (+Z up), relative to original assembled placement. Omitted factor is 1; factor 0 restores the assembled pose. Targets may include parts, boards, or nested stages. A populated PCB stage explicitly includes its `pcb_board_id` and fitted components. Repeated stage membership deduplicates; separate moves must not overlap. Stage inclusion is not an insertion sequence or implicit accumulation from previous stages.

Record schemas validate IDs, nonempty selections, finite coordinates and scalar ranges. Document consumers must reject duplicate record IDs, missing references, nesting cycles, overlapping expanded move targets, and selected geometry unavailable from the scene resolver. `drawing_explosion_view` requires both `drawing_assembly_stage_id` and `drawing_explosion_id`, rejects legacy source selectors, and shares direction, page layout, scale, hidden-edge and section controls with `drawing_part_view`. An ordinary part view may select a stage but rejects `drawing_explosion_id`; it always shows assembled geometry. Migrate the earlier unreleased exploded-part-view spelling to the new record type and ID. Existing assembled views retain their behavior.

Both `drawing_part_label` and `drawing_dimension_line` require exactly one parent reference: `drawing_part_view_id` or `drawing_explosion_view_id`. Consumers must validate that the referenced ID belongs to the matching view type. Dimensions remain preformatted paper primitives.

`drawing_part_label` attaches plain text to a target selection. `anchor` is an assembled CAD-world point; it follows that selection's explosion translation. `label_position` stays in page-centered paper mm (+X right, +Y up). Label targets must be visible in their view and share the same translation. `drawing_page_note` places plain text at a page-centered left baseline; its positive `font_size` is paper mm (default 2.7). No embedded image, model geometry or generated drawing output belongs in these records.

Rendering, label collision avoidance and mechanical insertion-path validation are separate concerns. These offsets describe a drawing pose, not verified assembly motion. TSX selector resolution and emission are follow-up core work; props and renderer changes accompany this schema proposal.
