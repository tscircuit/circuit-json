# Proposal: a teardrop route segment

Add `route_type: "teardrop"` to `pcb_trace.route`. A teardrop is an explicit
straight wire segment whose full copper width varies along its centerline.
It participates in the route directly, without a separate outline, copper pour,
attachment index, or trace-level teardrop array.

```json
{
  "route_type": "teardrop",
  "start": { "x": 0, "y": 0 },
  "end": { "x": 0.8, "y": 0 },
  "start_width": 0.6,
  "end_width": 0.2,
  "width_interpolation_mode": "smoothstep",
  "layer": "top"
}
```

## Names and conventions

Existing `wire` route entries use `width`, so `start_width` and `end_width`
describe the in-plane copper size consistently. They are **full widths**, not
radii or vertical copper thickness. `start` and `end` follow the existing
`through_pad` convention for explicit segments. Distances and coordinates are
millimeters; schema inputs also accept the usual unit strings.

`width_interpolation_mode` defines the local taper profile. The existing
trace-level `route_thickness_mode: "constant" | "interpolated"` still controls
ordinary wire entries. It does not override this segment's explicit widths or
interpolation mode. All teardrop geometry fields are required: no pad dimensions,
router defaults or global settings are consulted to reconstruct the shape.

## Geometry

Let A = `start`, B = `end`, L = |B−A|, u = (B−A)/L and n = (−u.y, u.x).
For normalized distance t along the segment, 0 ≤ t ≤ 1:

```
f(t) = t                         // linear
f(t) = 3*t*t - 2*t*t*t           // smoothstep
w(t) = start_width + (end_width - start_width) * f(t)
C(t) = A + t * (B - A)
left(t)  = C(t) + n * w(t)/2
right(t) = C(t) - n * w(t)/2
```

The filled copper region lies between these boundaries, closed by straight caps
at t=0 and t=1. The segment does not add round caps of its own. Adjacent trace,
pad and via copper is unioned with it.

- **linear** produces straight tapered sides (a trapezoid).
- **smoothstep** produces cubic sides whose width derivative is zero at both
  ends, providing smooth shoulders into constant-width copper. This is an exact
  profile, not a renderer-selected generic "curved" shape. Equivalently, each
  side's Bezier controls are at longitudinal positions L/3 and 2L/3, with the
  respective endpoint side offsets.

Either width may be the larger one: the segment can narrow or widen in route
order. Equal widths are valid and give a constant-width segment. Both widths
must be positive and finite; endpoints must be finite and distinct. Length is
implied by the endpoints rather than stored redundantly. Reversing a segment
swaps `start`/`end`, widths, and any endpoint port IDs; both modes then describe
the same copper. For curved traces, use a straight terminal taper adjoining the
curved route; this proposal does not define a curved centerline.

## Route traversal and connectivity

Unlike an ordinary `wire` point, this entry consumes the entire explicit segment
from `start` to `end`. It contributes L to centerline trace length. Route walkers
enter it at `start` and leave it at `end`. Do not infer another connector through
it or treat it as an additional vertex. Consecutive explicit segments share the
preceding end and following start. Wire runs adjoining it include their endpoint
at the same coordinate; duplicated boundary coordinates do not create another
physical segment or additional length.

For example, this route narrows away from a pad, continues to a via, changes
layers, and narrows away from the via on its other side:

```json
[
  { "route_type": "teardrop", "start": { "x": 0, "y": 0 }, "end": { "x": 0.8, "y": 0 }, "start_width": 0.6, "end_width": 0.2, "width_interpolation_mode": "smoothstep", "layer": "top" },
  { "route_type": "wire", "x": 0.8, "y": 0, "width": 0.2, "layer": "top" },
  { "route_type": "wire", "x": 4, "y": 0, "width": 0.2, "layer": "top" },
  { "route_type": "via", "x": 4, "y": 0, "from_layer": "top", "to_layer": "bottom" },
  { "route_type": "teardrop", "start": { "x": 4, "y": 0 }, "end": { "x": 4.8, "y": 0 }, "start_width": 0.6, "end_width": 0.2, "width_interpolation_mode": "linear", "layer": "bottom" },
  { "route_type": "wire", "x": 4.8, "y": 0, "width": 0.2, "layer": "bottom" },
  { "route_type": "wire", "x": 6, "y": 0, "width": 0.2, "layer": "bottom" }
]
```

The teardrop's `layer` must agree with adjoining route geometry; only an actual
via/through-pad transition changes layers. It inherits the trace's net, group,
subcircuit and copper thickness. Optional `start_pcb_port_id`, `end_pcb_port_id`,
`copper_pour_id`, and `is_inside_copper_pour` have the same ownership/annotation
roles as on wire entries; they do not determine or replace the taper geometry.
Clearance calculations must use the full tapered region. Connections, continuity,
matching adjoining widths and pad overlap are producer/DRC responsibilities, not
inferred by the schema from other records.

## Scope and consumer compatibility

This is a schema and geometry proposal, not a renderer or router implementation.
The schema validates the new entry's fields and leaves all existing route entries
unchanged. Old Circuit JSON remains valid, but **old consumers do not necessarily
accept or render the new route type**. Consumers must add explicit route handling;
exporters must support it or reject it, never silently discard a segment.

Follow-up work is needed in core/autorouter generation, shared geometry helpers,
PCB/SVG/3D viewers, trace-length calculations, DRC, copper-solver obstacle
conversion, and fabrication exporters. Linear tapers can be exported directly;
smoothstep boundaries can be emitted as curves or tessellated to an explicit
fabrication tolerance. Neither mode is a new independently solved pour region.

There is deliberately no generic polygon escape hatch. Importers may fit a source
teardrop to these profiles within a declared tolerance. Shapes that cannot be
represented sufficiently accurately should remain ordinary imported copper shapes,
not be silently approximated or labeled as teardrop route segments. Storing these
fields alone does not change performance; consumers must use the new segment as
trace copper instead of submitting it as another pour to solve.
