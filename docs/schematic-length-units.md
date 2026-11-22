# Schematic length units

A record's optional `schematic_length_unit` describes its stored schematic geometry, including nested points, sizes, and drawing lengths. Supported values are `"mm"`, `"in"`, and the legacy unit `"9.236363636363636mm"` (10.16 mm per 1.1 drawing units). An untagged record uses the legacy unit, including when read on its own.

A subcircuit's `source_group.default_schematic_length_unit` is the default for writing new records. During migration, writers should set `schematic_length_unit` on each geometry record, including records written in legacy units. Readers interpret each record independently.

For example, a trace tagged `"in"` with an edge from `{ "x": 0, "y": 0 }` to `{ "x": 1, "y": 0 }` spans one inch. On a sheet the tag applies to `center`. Paper dimensions (`sheet_width` and `sheet_height`) always use millimeters. Fields for other domains, such as `pcb_center` or KiCad metadata, keep their own units.
