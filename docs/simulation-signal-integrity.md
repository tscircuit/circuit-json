# PCB transient channel simulation records

[RFC #28](https://github.com/tscircuit/rfc/pull/28), pinned at
[`89a2635`](https://github.com/tscircuit/rfc/blob/89a263537ebc143315849f005024f84c1efa5635/rfcs/2026-11-08-pcb-transient-channel-simulation.md),
defines the four shared records exported by `circuit-json` and included in
`any_circuit_element`.

Core emits `simulation_signal_integrity` and `simulation_signal`. Rates are in
bit/s, offsets and explicit durations in seconds. Corners are `typical`,
`minimum` and `maximum`. Absent `duration_s` stays absent: the pipeline computes
`S + 128 * max(UI_i)`, with `S = max(offset_i + 16 * UI_i)` over switching
channels, or `32 * max(UI_i)` for quiet-only blocks. Explicit durations are
finite positive bounds and are never extended. The final duration is reported
in `result.blocks[].duration_s`.

Endpoints identify physical source ports. Differential endpoints carry P/N IDs
and optional per-leg IBIS models. Receivers are never collapsed. PRBS records
require resolved integer seeds in `1..2^n-1`; clock and literals omit seeds.
Constant literals carry normalized quiet states. There are no measurement props
or records. Ideal PDN uses selected IBIS rails; extracted PDN is not implemented.

The pipeline emits only `simulation_signal_waveform` and
`simulation_signal_integrity_rlgc` and validates them with the shared schemas.
Waveforms have nonempty parallel finite `timestamps_s` and `voltage_levels`
arrays, with strictly increasing nonnegative times spanning zero to final
duration. Every receiver has a far waveform; quiet signals also have a driver
near waveform. Differential voltage is P−N and `source_port_id` is its P port.
Quiet waveforms require `idle_voltage_v`, measured with aggressors held at their
initial levels and the victim's state, termination and probe reference retained.
Switching waveforms omit idle voltage. A floating off victim without a unique
idle operating point is an error. These cross-record conditions belong to the
pipeline.

RLGC conductors are listed legs only: `{ simulation_signal_id, leg }`, where
`leg` is `single`, `p` or `n`. Identities are unique; each positive, increasing
frequency has square finite matrices in the same conductor order. Unlisted
copper remains in the private extraction and transient model.

Entries are total ohms, henries, farads and siemens. R/L are loop matrices
against the eliminated finite return: `A = [I; -ones]`, `R = Aᵀ Rprim A`,
`L = Aᵀ Lprim A`. C/G are ground-referenced Maxwell signal blocks:
`C = Cprim[s,s]`, `G = Gprim[s,s]`, with nonnegative diagonal and nonpositive
mutual entries. The return is held at 0 V relative to infinity. Extraction
checks reciprocity within 2.5% before symmetrizing; lossless G is zero. Align
spatial sections and sum total entries, counting shunt halves once. Do not
normalize by length. Physical extraction checks belong to the pipeline.

General SPICE experiments, probes and graphs remain available. The old
`pcb_spice_channel`, pin states, digital stimuli, eye diagrams and SI measurement
records are removed. IBIS declarations retain chip bindings; package parasitics
are always included and corner belongs to the simulation block.
