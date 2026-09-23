# Tapered wire segments (teardrops)

A teardrop is a `wire` segment with varying full copper width. `route_type`
contains only `wire`, `via`, and `through_pad`; there is no separate `teardrop`
entry, outline, or attachment array.

```json
[
  {
    "route_type": "wire",
    "x": 0, "y": 0,
    "width": 0.6,
    "start_width": 0.6,
    "end_width": 0.2,
    "width_interpolation_mode": "quadratic",
    "layer": "top"
  },
  { "route_type": "wire", "x": 0.8, "y": 0, "width": 0.2, "layer": "top" },
  { "route_type": "wire", "x": 4, "y": 0, "width": 0.2, "layer": "top" }
]
```

The first point's fields describe the **outgoing segment** from (0,0) to
(0.8,0). The remaining segment is an ordinary constant-width wire. No duplicate
boundary point or separate `start`/`end` coordinates are needed.

## Fields and traversal

`start_width`, `end_width`, and `width_interpolation_mode` are optional as a
set: either omit all three or supply all three. Widths must be finite and
positive, and `start_width` must equal the existing required `width` field.
This preserves the original wire shape and a starting-width fallback for old
consumers, although old consumers cannot reproduce the taper itself.
Coordinates and full widths use millimeters; schema inputs accept unit strings.

A tapered point must have a distinct, finite next route point on the same
copper layer. Its endpoint is the next wire's (x,y), the next via's (x,y) on
`from_layer`, or the next through-pad's `start` on `start_layer`. The via or
through-pad then performs its normal layer transition. A tapered final point,
zero-length segment, or implicit cross-layer segment is invalid.

The local profile overrides `route_thickness_mode` **only for this outgoing
segment**. The incoming segment still uses its previous point's settings.
A sequence of tapered wires can share endpoints normally. Consumers must not
also draw a constant-width stroke over the tapered segment. Matching the next
wire's width to `end_width` is the producer's responsibility.

## Geometry

Let A be the wire's (x,y), B its endpoint, L=|B-A|, u=(B-A)/L and
n=(-u.y,u.x). With t measuring normalized distance along the segment:

```
f(t) = t             // linear
f(t) = t*t           // quadratic, start_width <= end_width
f(t) = 2*t - t*t     // quadratic, start_width > end_width
w(t) = start_width + (end_width - start_width) * f(t)
C(t) = A + t * (B - A)
left(t)  = C(t) + n * w(t)/2
right(t) = C(t) - n * w(t)/2
```

**Linear** produces straight tapered sides. **Quadratic** produces concave
sides that flatten into the narrow trace. Equivalently, measuring q from wide
to narrow: `w(q) = narrow + (wide - narrow) * (1-q)^2`. Equal widths form a
constant-width rectangle. The wide end does not automatically match a pad's
tangent. `smoothstep` is not supported.

The filled region has straight end caps and no additional round caps. It is
unioned with adjacent pad, via, and wire copper. Reversing a route moves the
profile fields to the new outgoing point, swaps `start_width`/`end_width`, and
sets `width` to the new start width; this preserves the same copper. The
centerline length is L, counted once as an ordinary wire segment.

Tapers retain the wire's layer, port references and pour annotations and their
parent trace's net/group/subcircuit ownership. Clearance calculations must use
the full tapered region. Pad overlap and electrical connectivity remain
producer/DRC responsibilities.

## Compatibility and consumers

Ordinary wire documents are unchanged. Migrate an old standalone teardrop to
an outgoing wire with its start coordinates, `width = start_width`, and taper
fields, followed by a wire at its end with `width = end_width` (reuse an existing
boundary wire if present). The removed `route_type: "teardrop"` is rejected.

Renderers, routers, exporters, DRC, and copper-solver obstacle conversion need
explicit support for wire taper fields. Existing consumers may ignore these
fields and draw a constant-width starting-width segment. Producers requiring
accurate output must use a supporting consumer. Linear tapers can be exported
directly; quadratic boundaries can be emitted as curves or tessellated to a
stated tolerance. They are trace copper, not independently solved pours.
