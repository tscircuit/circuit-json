# Signal integrity records

[RFC #28](https://github.com/tscircuit/rfc/pull/28), pinned at
[`ae2c01a`](https://github.com/tscircuit/rfc/blob/ae2c01a336534386886bfe6d3bb916c18c0c445b/rfcs/2026-11-08-signal-integrity-signal-api.md),
defines the exact source and result interfaces reproduced in the README.
All seven schemas and their TypeScript interfaces are exported from `circuit-json`
and included in `any_circuit_element`. The pipeline must validate the records it
emits with these shared schemas, for example:

```ts
import { simulation_signal_integrity_rlgc } from "circuit-json"
import type { SimulationSignalIntegrityRlgc } from "circuit-json"

const result: SimulationSignalIntegrityRlgc =
  simulation_signal_integrity_rlgc.parse(extractedResult)
```

## Source records

Each `simulation_signal` references its `simulation_signal_integrity` block by
ID. Settings use numeric SI units: bit/s, seconds and volts. Core resolves
inherited bit rates, patterns, PRBS seeds, offsets and the default corner.
Absent `duration_s` means automatic recording time; core leaves it absent.
A present positive `duration_s` is the user's explicit limit, which the pipeline
must preserve. The final duration belongs to the pipeline's `result.blocks[]`.

There is no `supply` field. Ideal-PDN rails come from each selected IBIS model's
`[Voltage Range]` and reference keywords at the block's corner. `pdn` is explicit
in source records; the authoring default is `"ideal"`. The schema represents
`"extracted"`, but execution must fail until extracted PDN is implemented.

Endpoints use physical source port IDs. A single endpoint has `source_port_id`
and optional `ibis_model_name`; a differential endpoint has `p_source_port_id`,
`n_source_port_id`, and optional `p_ibis_model_name` / `n_ibis_model_name`.
A shared pair model expands into both per-leg fields. `receivers` is an array
of endpoints; a differential pair is one endpoint. There are no count caps.

PRBS records require a resolved integer seed in `1..127`, `1..32767` or
`1..2147483647` for `prbs7`, `prbs15` or `prbs31`, including quiet PRBS records.
Core obtains defaults from the RFC's sorted-name phase plan. Schemas never
coerce, truncate, mask or generate seeds. Clock and literal records omit `seed`.
Constant literals carry their normalized `quiet` state; explicit quiet wins.

Setup/hold limits require a strobe ID, which cannot equal the signal's own ID.
The renderer and pipeline check references across records: the strobe must be
a different switching signal in the same block, without a dependency cycle,
and have exactly one receiver on each data receiver's chip. Forward references
are allowed. Schemas do not resolve selectors, model capabilities or topology.

## Result records

Every record has its own `<type>_id`, generated when omitted, like other simulation
records. Every numeric result is finite. For differential measurements,
`source_port_id` identifies the P port and every voltage measures P minus N.

| Record                             | Payload                                                                                                                                                                                              |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `simulation_signal_waveform`       | Signal ID, `end` (`near` or `far`), `source_port_id`, parallel nonempty `timestamps_s` / `voltage_levels` arrays of equal length, with strictly increasing nonnegative times                         |
| `simulation_signal_eye`            | Signal ID, receiver `source_port_id`, nonempty `folded_traces` in the same sample shape, `eye_height_v`, nonnegative `eye_width_s`, `mask_margin_v`                                                  |
| `simulation_signal_crosstalk`      | Signal ID, `end`, `source_port_id`, `idle_voltage_v`, nonnegative `peak_positive_v`, nonpositive `peak_negative_v`                                                                                   |
| `simulation_signal_strobe_margin`  | Signal ID, receiver `source_port_id`, nonempty time-ordered `edges` with `time_s`, `setup_margin_s`, `hold_margin_s`; `worst_setup_margin_s` and `worst_hold_margin_s` equal their respective minima |
| `simulation_signal_integrity_rlgc` | Block ID, nonempty `conductors`, nonempty `matrices` with positive, unique, increasing `frequency_hz` and square `r_ohm`, `l_h`, `c_f`, `g_s` in the same conductor order                            |

Waveforms span zero to the final recording duration. Complete folded eye traces
span zero to 2 UI. Eye height and mask margin may be negative. The sampling
instant is 0.5 UI for a fixed-grid eye or 1 UI for a strobe eye, centered at the
received crossing plus data offset. Bit classes come from transmitted bits.
The RFC defines the interpolated threshold checks and eye opening formulas;
cross-record timing coverage and computed values are pipeline responsibilities.

A switching signal emits a far waveform and eye for every receiver. A quiet
signal emits a waveform and crosstalk record for its driver (`end="near"`, NEXT)
and for every receiver (`end="far"`, FEXT). Receivers are never collapsed into a
maximum. At each end, compute `idle_voltage_v` with aggressors held at their
initial levels and the victim's selected quiet state and termination retained.
Over the measurement gate:

```text
peak_positive_v = max(0, max(V - idle_voltage_v))
peak_negative_v = min(0, min(V - idle_voltage_v))
```

Do not subtract the disturbed waveform's mean. A floating off victim without a
unique idle operating point is an error. Strobe margins also remain signed:
for the expected bit's valid interval `[a, b]` and sampling time `t`, setup is
`t - a - requested_setup`, hold is `b - t - requested_hold`. Missing intervals
produce finite failing margins per the RFC, and no edge is dropped.

## RLGC conductor and matrix conventions

Each conductor is exactly one of:

```ts
{
  simulation_signal_id: string
  leg: "p" | "n" | "single"
}
{
  source_trace_id: string
}
```

A differential signal contributes distinct P and N rows with the **same** logical
signal ID. A single-ended signal uses `single`; unlisted coupled copper uses its
source trace ID. Identities are unique by `(simulation_signal_id, leg)` or trace
ID, so internal extraction partitions cannot duplicate a public conductor.
Every matrix is `conductors.length` square at every frequency, with no size cap.

Entries are total ohms, henries, farads and siemens. R and L use loop coordinates
against the eliminated finite physical return: `A = [I; -ones]`,
`R = Aᵀ R_primitive A`, `L = Aᵀ L_primitive A`. The return has no public row.
C uses charge neutrality with a floating finite return. With `s` the signal
indices, `u = Cprim · 1`, `d = 1ᵀ · Cprim · 1 > 0`:

```text
C = Cprim[s,s] - u_s · u_sᵀ / d
```

For `Cprim=[[4,-1,-1],[-1,4,-1],[-1,-1,4]] pF`, this gives
`C=[[10/3,-5/3],[-5/3,10/3]] pF`. G uses the analogous zero-total-current
reduction when `dG > 0`; if `dG=0` and `uG=0`, use `Gprim[s,s]`. Other
nonpositive-denominator cases fail; lossless G is zero. C/G retain Maxwell
signs: nonnegative total diagonal values and nonpositive mutual entries.
Thus `ΔV = (R + jωL) I` and `I_shunt = (G + jωC) V` relative to the return.

At each frequency, align spatial sections to the public conductor order and
sum total entries. Absent conductors contribute zero; count shunt halves once.
Never divide by length or multiply already-total solver matrices by length.
These totals summarize extraction; the transient model retains spatial sections
and junctions. Schemas validate shape, dimensions, signs and identity; the
pipeline must perform the physical reductions and aggregation.

The old `pcb_spice_channel`, `simulation_ibis_pin_state`,
`simulation_digital_stimulus` and `simulation_eye_diagram` API is removed.
`simulation_ibis_model` retains chip asset, component and pin bindings; corner
belongs to the block and package parasitics are always included. General SPICE
experiments, probes, transient graphs and oscilloscope traces remain available.
