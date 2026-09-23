# Proposal: teardrops owned by PCB traces

Add optional `pcb_trace.teardrops`, an array of resolved copper additions. This
keeps a teardrop with the trace that owns it, instead of representing every small
reinforcement as an independently solved `pcb_copper_pour`.

```json
{
  "type": "pcb_trace",
  "pcb_trace_id": "pcb_trace_1",
  "source_trace_id": "source_trace_1",
  "route": [
    { "route_type": "wire", "x": 0, "y": 0, "width": 0.2, "layer": "top" },
    { "route_type": "wire", "x": 4, "y": 0, "width": 0.2, "layer": "top" }
  ],
  "teardrops": [
    { "route_segment_index": 0, "end": "start", "shape": "curved", "length": 0.8, "width": 0.6 },
    { "route_segment_index": 0, "end": "end", "shape": "linear", "length": 0.5, "width": 0.5 }
  ]
}
```

Omission or an empty array means no teardrops. No dimensions or enablement are
inferred from a pad, via, global design rule, or viewer default. Numeric distances
and coordinates are mm; schema inputs also accept the usual distance strings.

## Attachment and ownership

`route_segment_index: i` refers to the segment **from `route[i]` to `route[i+1]`**.
Both entries must be `wire`, on the same layer, at distinct finite coordinates.
`end: "start"` places the wide end at `route[i]`; `"end"` places it at `route[i+1]`.
The taper always extends inward along that segment. An internal bend or via can
therefore have a teardrop on either adjacent wire segment, on different layers.
A via entry is not itself a wire segment. For example, in
`[wire, wire, via, wire, wire]`, indices 0 and 3 are eligible, but 1 and 2 are not.
Producers must include coincident wire endpoints at a via when needed.

The teardrop inherits layer, net/connectivity, group, subcircuit, solder-mask
behavior, and copper thickness from its trace/segment. It adds copper to the
union of the trace, pad and via; it does not change the centerline or trace length.
There is no separate net reference or target-pad reference to become inconsistent.
Removing a trace removes its teardrops. Editing, reversing, splitting, simplifying,
or rerouting a trace requires regenerating/remapping the segment indices and
end labels; the array must not be carried over blindly.

## Deterministic parametric geometry

`shape` is `linear` or `curved`. `length` and `width` are positive, finite,
resolved dimensions, not percentages or router requests.

Let A be the selected endpoint, u the unit vector pointing into the selected
segment, and n its left perpendicular. Local (s,t) maps to A + s*u + t*n.
Let L = `length`, W = `width`, and N be the trace's full width at distance L
from A, using its `route_thickness_mode` (omission means constant). A constant
segment uses `route[i].width`; an interpolated segment interpolates between its
two endpoint widths, accounting for the selected end.

- `linear`: the implicitly closed outline is `(0,-W/2)`, `(L,-N/2)`,
  `(L,N/2)`, `(0,W/2)`.
- `curved`: each side is a cubic Bezier from `(0,±W/2)` to `(L,±N/2)`,
  with control points `(L/2,±W/2)` and `(L/2,±N/2)`. Close the outline with
  straight wide and neck caps. This fixes the curve rather than leaving
  renderers to choose different profiles. Polygon-only consumers tessellate
  the curve to their declared fabrication/rendering tolerance.

The producer must ensure L does not exceed the selected segment length and W
is at least the maximum trace width over the taper span. No consumer should
silently shorten, widen or otherwise repair invalid geometry. Two teardrops may
overlap; their copper is unioned. Clearances must be checked against that union,
not just the original trace width. These shapes do not imply electrical or
manufacturing validity.

## Imported outlines

A `polygon` alternative preserves resolved asymmetric or imported polygon copper:

```json
{
  "route_segment_index": 0,
  "end": "start",
  "shape": "polygon",
  "outline": [
    { "x": 0, "y": -0.3 },
    { "x": 0.8, "y": -0.1 },
    { "x": 0.8, "y": 0.1 },
    { "x": 0, "y": 0.3 }
  ]
}
```

Coordinates are absolute PCB coordinates, like the route, not local offsets.
The ring is implicitly closed; either winding is accepted. It must be simple,
nonzero-area, and have no holes. `length`/`width` are forbidden for polygon shapes;
`outline` is forbidden for parametric shapes. Importers preserve the polygon as
supplied and tessellate source arcs to an explicit tolerance before creating it.
The polygon must overlap the attached segment with positive area near the chosen
endpoint. It is not an arbitrary disconnected island or a replacement for a
plane/pour. The import classification must establish its connection to the trace;
size alone does not establish that a source copper shape is a teardrop.

## Validation and compatibility

The schema checks integer nonnegative indices, finite positive dimensions,
finite polygon coordinates and nonzero polygon area. As with other Circuit JSON
references, route-relative geometry checks are producer/DRC responsibilities:
index bounds, same-layer wire adjacency, duplicate attachment entries (at most
one per segment/end), usable segment length, widths, simple outlines and overlap.
`pcb_trace` remains a Zod object; the existing route union and wire/via/through-pad
types are unchanged. Existing JSON remains valid without generated fields.

This is additive data compatibility, **not automatic renderer/exporter support**.
Older parsers may discard unknown fields and older consumers will draw only the
base trace. Manufacturing exporters must support teardrops or explicitly reject
such a board, rather than silently omit copper. Flattening to a legacy format is
a downstream conversion, not something this schema does automatically.

## Alternatives and follow-up

- Trace-wide `start_teardrop`/`end_teardrop` cannot describe internal via contacts
  or separately reinforce opposite sides of a bend without splitting traces.
- A new route type would require every route walker to understand how to continue
  the centerline and change layers, despite a teardrop being additive copper.
- Wire-point flags alone leave the incoming versus outgoing segment ambiguous.
- A copper-pour element gives independent net/layer ownership and a solve lifecycle
  to what is fixed trace geometry; it can also leave orphan shapes when traces
  are removed.

This PR proposes the storage/schema contract only. Core/autorouter generation,
Altium/KiCad import classification, shared geometry generation, PCB/SVG/3D
rendering, Gerber/export support, and DRC/copper-solver obstacle handling require
follow-up changes. In particular, exporting this schema alone does not speed up
pour solving: consumers must first union the teardrop into the trace obstacle
instead of treating it as another region to solve.
