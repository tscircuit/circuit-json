# Signal integrity records

[RFC #26](https://github.com/tscircuit/rfc/pull/26) defines the
`simulation_signal_integrity` block and its `simulation_signal` source records.
Each signal references its block by `simulation_signal_integrity_id`. Endpoints
use physical source port IDs, with `kind: "single"` or `kind: "differential"`
and an optional `ibis_model_name` override. `receivers` is an array of endpoints;
a differential pair is one endpoint. There is no signal or receiver count cap.

The renderer resolves all source settings, including inherited bit rates,
patterns, seeds, offsets, duration and the default corner. Schemas accept numeric
SI units: bit/s, seconds and volts. They do not resolve selectors, calculate
defaults or verify topology and cross-record references.

Simulation results use the following fields:

| Record | Payload |
| --- | --- |
| `simulation_signal_waveform` | `simulation_signal_id`, `end` (`near` or `far`), `source_port_id`, parallel `timestamps_s` and `voltage_levels` arrays |
| `simulation_signal_eye` | `simulation_signal_id`, receiver `source_port_id`, `folded_traces` (each with parallel `timestamps_s` and `voltage_levels`), `eye_height_v`, `eye_width_s`, `mask_margin_v` |
| `simulation_signal_crosstalk` | `simulation_signal_id`, receiver `source_port_id`, `peak_next_v`, `peak_fext_v` (nonnegative peak magnitudes in volts) |
| `simulation_signal_strobe_margin` | `simulation_signal_id`, receiver `source_port_id`, `edges` (each with `time_s`, `setup_margin_s`, `hold_margin_s`), `worst_setup_margin_s`, `worst_hold_margin_s` |
| `simulation_signal_integrity_rlgc` | `simulation_signal_integrity_id`, `signal_order` (simulation signal IDs), square `r_ohm`, `l_h`, `c_f`, `g_s` matrices using that row/column order |

Every record has its own `<type>_id`, generated when omitted, like other simulation
records. Sample times use seconds, including offsets within folded eye traces;
voltages use volts. For differential results, `source_port_id` identifies the P
port and voltage samples measure P minus N. Receiver IDs distinguish multi-drop
measurements. NEXT is measured at the driver, and FEXT at the specified receiver.
Negative mask and setup/hold margins represent failing measurements. RLGC values
are coupled lumped values in ohms, henries, farads and siemens; off-diagonal
coupling may be negative. Matrices have no size cap.

The old `pcb_spice_channel`, `simulation_ibis_pin_state`,
`simulation_digital_stimulus` and `simulation_eye_diagram` API is removed.
`simulation_ibis_model` keeps the chip's asset, component selection and pin
bindings; corner selection now belongs to the block and package parasitics are
always included. General SPICE experiments, sources, voltage/current probes,
transient graphs and oscilloscope traces remain available.
