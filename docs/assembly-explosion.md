# Assembly explosion playback

`cad_explosion_stage` and `cad_explosion_move` serialize an explosion program
alongside **assembled** CAD geometry. They describe a display view, not changes
to electrical or manufactured geometry. No live TSX tree is needed for playback.

Stages have a unique `order` (zero-based, contiguous). Moves have a unique,
contiguous `order` within their executing `cad_explosion_stage_id`. Producers
resolve authored precedence edges before export. Document array order has no
meaning; consumers sort by these fields. Stage names are qualified display names,
not target selectors. IDs are stable within the exported document.

A stage's `cad_component_ids` and optional `cad_reference_surface_ids` identify its movable membership,
including descendants of model-less assembly containers. A move may target a
`cad_component`, `cad_reference_surface`, or a whole `cad_explosion_stage`. A stage target expands to its
membership, **not its instructions**. This allows a previously separated stage
to move as a unit while retaining its internal displacements. Stage targeting
does not add a scheduling edge, recursively execute moves, or reset earlier poses.
A stage may target itself; explicit membership makes this non-recursive.

Example: first lift the window, then move the entire cover stage sideways:

```json
[
  { "type": "cad_explosion_stage", "cad_explosion_stage_id": "cover_stage", "name": "device.cover", "order": 0, "cad_component_ids": ["cover", "window"] },
  { "type": "cad_explosion_stage", "cad_explosion_stage_id": "park_stage", "name": "device.park", "order": 1, "cad_component_ids": ["cover", "window"] },
  { "type": "cad_explosion_move", "cad_explosion_move_id": "lift", "cad_explosion_stage_id": "cover_stage", "order": 0, "targets": [{ "type": "cad_component", "cad_component_id": "window" }], "translation": { "x": 0, "y": 0, "z": 15 } },
  { "type": "cad_explosion_move", "cad_explosion_move_id": "park", "cad_explosion_stage_id": "park_stage", "order": 0, "targets": [{ "type": "cad_explosion_stage", "cad_explosion_stage_id": "cover_stage" }], "translation": { "x": 60, "y": 0, "z": 0 } }
]
```

The referenced CAD records must also be present. After playback, the window has
moved `(60, 0, 15)` and the cover `(60, 0, 0)` relative to their assembled poses.
Multiple targets in one move share progress. Deduplicate their expanded CAD IDs
before translating, including overlap between a stage and an individual member.
Separate moves accumulate. Stage progress in `[0, 1]` advances sequential moves
in equal portions; earlier stages are complete and later stages are untouched.
Always evaluate from assembled geometry, so backwards scrubbing cannot drift.

`translation` is a finite displacement vector in right-handed circuit-world XYZ,
millimeters, +X right, +Y top, +Z above. Producers resolve local assembly frames
before export; consumers must not rotate the vector by the CAD model rotation.
Movement starts at the current displaced position. Reference-surface centers follow explicit surface targets, with unchanged axes.
Producers include owned surfaces when expanding assembly targets, including
model-less owners. A CAD target alone does not implicitly move its surfaces;
this keeps membership explicit and avoids double translations.

Per-record schemas validate shape. Document consumers must additionally reject
missing/duplicate IDs, missing stage owners, invalid/gapped/duplicate order,
unknown membership/targets, duplicate membership, and targets outside the
executing stage's membership. Validate **all** stages before partial playback.
A producer expands physical subassemblies to their full CAD membership; a
consumer must never infer membership from proximity or names.

This version describes CAD translations only. Reject targets with associated PCB
geometry rather than moving component models away from pads/traces. Board/cable
movement and rotations need separate geometry semantics. These records do not
certify collision clearance.

## Collision diagnostics

`cad_explosion_collision_error` identifies the executing stage and move, the
moving CAD component, and an obstacle (`cad_component` or `pcb_board`). It reports
newly entered positive-volume intersection over the continuous translation,
including collisions between otherwise clear start and end poses. Earlier moves
are already applied; all members of one move translate together.

`swept_intersection_volume_mm3` measures the obstacle volume inside the sweep
after subtracting the moving solid's position at the start of that move. Existing
overlap is therefore excluded, as is touching without penetration. This metric
is neither instantaneous penetration depth nor the exact time of first contact.

`cad_explosion_collision_check_warning` records incomplete coverage when CAD or
PCB geometry is unsupported/invalid, or the collision check fails. Consumers
must preserve that warning alongside any confirmed collisions; absence of an
error alone is not evidence that unexamined geometry has clearance.
