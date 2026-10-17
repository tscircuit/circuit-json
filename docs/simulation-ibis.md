# External IBIS transient declarations

These records describe an experiment for a separately invoked simulation runner.
Parsing Circuit JSON does not download model files, install tools or execute a
solver. Existing SPICE experiments remain compatible.

- `simulation_ibis_model` attaches a vendor component, explicit corner and package
  policy to a source component. Vendor pin numbers map to physical source port
  IDs. Reference roles (`pullup`, `pulldown`, `power_clamp`, `ground_clamp`,
  `external`) also point to physical source ports.
- `simulation_ibis_pin_state` selects input or output mode for one experiment.
  Outputs require an explicit `enabled` boolean; inputs must omit it.
- `simulation_digital_stimulus` describes a binary pattern, repetition, initial
  bit, inversion, start time and unit interval. It targets one physical source
  port in one experiment. No traffic is inferred from the net name.
- `simulation_eye_diagram` identifies its experiment and voltage probe, a fixed
  time origin, unit interval and optional measurement gate. It is a measurement
  declaration, without an eye-opening or compliance result.

All time fields use milliseconds after parsing and accept unit strings such as
`"2.5ns"`. A stimulus's initial bit and pattern are specified before inversion.
An omitted eye gate is resolved by the runner against the recorded experiment.

An IBIS source is exactly one of `{ url, sha256, archive? }`,
`{ file, sha256?, archive? }` or `{ content, sha256? }`. Hashes cover original
source bytes. Archives specify `{ member, member_sha256? }`; the member hash
covers the extracted IBIS bytes. Source content is preserved without trimming.

`simulation_experiment.execution_mode = "external"` marks a declaration for an
external runner. `spice_engine` identifies the requested engine and
`subcircuit_id` retains its scope. A transient voltage graph can retain
`simulation_voltage_probe_id` to bind recorded samples to the declared probe.
