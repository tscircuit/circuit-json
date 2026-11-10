# Differential pair source buses

`SourceBus` is a union of `OrdinarySourceBus` and `SourceDifferentialPairBus`.
Ordinary buses retain their member-by-member constraints. Differential pairs
support only maximum lane-length skew, measured in planar millimeters:

```ts
const pair: SourceDifferentialPairBus = {
  type: "source_bus",
  source_bus_id: "usb",
  source_trace_ids: ["dp1", "dp2", "dm1"],
  max_length_skew: 0.1,
  differential_pair: {
    positive_source_trace_ids: ["dp1", "dp2"],
    negative_source_trace_ids: ["dm1"],
  },
}
```

The schemas require ordered, nonempty lanes of nonempty trace IDs, no duplicate
IDs within or between lanes, exact positive-then-negative membership, and an
explicit finite nonnegative skew limit (including zero). Lanes may have different
hop counts. Pair skew means `abs(sum(positive lengths) - sum(negative lengths))`,
not the longest individual hop minus the shortest. The metric excludes vertical
via barrels and component bodies.

Both variants reject unknown fields. Pair objects reject ordinary bus constraints,
gap/uncoupled-length fields and differential impedance. Their nested metadata also
rejects the removed singular `positive_source_trace_id` and
`negative_source_trace_id`. Ordinary buses reject differential pair metadata and
differential impedance fields. Existing ordinary length and single-ended
impedance capabilities remain available.

## Validation requiring a complete document

Per-element schemas cannot check referenced trace existence or subcircuit scope,
exclusive hop ownership across pairs, exactly two distinct physical ports per
hop, routable terminal coverage, consistent ordered traversal through shared pads
or known two-terminal resistor/capacitor/inductor bridges, electrical shorts
(including internal connections), repeated electrical sections, or overlap with
ordinary bus membership and length-comparison references. Core must validate
these before routing serialized Circuit JSON as well as TSX-generated records.
Two-pad net aliases must already reference canonical two-terminal source traces.

## Existing diagnostics with lane lengths

`PcbAutoroutingError.differential_pair_length_skew` optionally carries
`{ source_bus_id, positive_length, negative_length }` for a measured failed solve.
It requires no fabricated PCB trace IDs. `PcbBusLengthSkewError` optionally carries
`differential_pair_lengths: { positive_length, negative_length }` for final,
manual or imported copper. Ordinary diagnostics need neither payload.

Schemas validate finite nonnegative lane lengths and require DRC
`actual_length_skew` to equal the absolute lane difference within `1e-9` mm.
Document-level validation must require the appropriate payload for a measured pair
diagnostic, resolve its source bus, verify `maximum_length_skew` against that
bus, and verify that the measured difference exceeds its limit plus `1e-9` mm.
Missing or ambiguous route coverage is an autorouting error, not a partial skew
measurement. Core owns error mapping and readable pair/lane messages.
