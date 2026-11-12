# Expanded subcircuit interfaces

An expanded subcircuit uses `schematic_group.show_boundary: true`. Its existing
`center`, `width`, and `height` describe the boundary; its contents remain visible.
This is distinct from `show_as_schematic_box`, which represents a collapsed group.

An exported terminal is an ordinary `source_port` owned by `source_group_id`.
Its connections use the existing source traces and nets. Exposing a net may
produce a public source port connected to that net; geometry never implies a
connection or merges equal names across subcircuits.

Its `schematic_port` has `schematic_group_id` instead of
`schematic_component_id`, and `boundary_position` is the point where its stem
meets the frame. `center` is the outer terminal. `facing_direction` points out of
the group; it is not electrical input/output direction. Both positions are in
schematic-world millimeters, with +X right and +Y up, including group translation.
On different sheets these coordinates belong to their respective sheet frames.

Renderers draw a labeled frame, the port stem from `boundary_position` to
`center`, and the public name. They do not infer port positions from component
bounding boxes or source connectivity. A boundary terminal should remain visible
when internally connected; internal wiring does not imply an external connection.

Legacy groups and component ports omit these optional fields and retain their
existing rendering. All endpoint ownership references and boundary positions
must be consistent; as with other Circuit JSON references, cross-record
validation is a consumer responsibility.
