# Proposal: independent keepout permissions

Add optional boolean `allow_traces` and `allow_placements` fields to every
`pcb_keepout` shape (rectangle, circle, outline). These serialize the proposed
`<keepout allowTraces />` and `<keepout allowPlacements />` props respectively.

```tsx
// Reserve component space while allowing traces through it.
<keepout shape="rect" width={6} height={6} allowTraces />

// Reserve trace-free space while permitting components in it.
<keepout shape="rect" width={6} height={6} allowPlacements />
```

```json
{
  "type": "pcb_keepout",
  "pcb_keepout_id": "keepout_1",
  "shape": "rect",
  "center": { "x": 0, "y": 0 },
  "width": 6,
  "height": 6,
  "layers": ["top"],
  "allow_traces": true,
  "allow_placements": false
}
```

## Semantics

| Field | Effect when true |
| --- | --- |
| `allow_traces` | Trace segments may cross the region. Do not use it as a trace-routing obstacle or emit keepout overlap diagnostics for those traces. |
| `allow_placements` | Components and their associated SMT pads and plated holes may occupy the region. Do not use it as a placement obstacle or emit keepout overlap diagnostics for them. |

Permissions are independent and can both be true. They apply only on the
keepout's layers. Neither permission allows copper-pour fill: pours still avoid
the region, including when both permissions or `warning_only` are true.
Standalone vias are not component placements or trace segments; these permissions
do not exempt their overlaps or change via placement restrictions.

An allowed overlap produces neither a keepout error nor a keepout warning.
For overlaps that remain prohibited, `warning_only` retains its advisory routing
and placement behavior and changes the diagnostic from an error to
`pcb_keepout_overlap_warning`. It does not override a permission to reintroduce
warnings. `excluded_pcb_component_ids` continues to exempt the listed components.
Other keepouts and unrelated design rules still apply.

## Parsing and compatibility

Only booleans are accepted, with no coercion. Explicit false remains false;
omission remains absent and means no permission is granted. The props use the
same parsing rules. There are no aliases or conflicting combinations, and
existing documents require no migration. Older consumers may ignore the fields
and enforce stricter restrictions.

This PR proposes the data contract and schema only. Core and checks must implement
emission, import, routing/placement obstacle handling, and diagnostic filtering
before users receive the proposed behavior. Copper-pour avoidance must remain
covered by the existing visual regression.
