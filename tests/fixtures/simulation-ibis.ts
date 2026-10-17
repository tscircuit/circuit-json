export const model = {
  type: "simulation_ibis_model",
  source_component_id: "source_component_tx",
  source: {
    url: "https://example.com/chip.zip",
    sha256: "a".repeat(64),
    archive: { member: "chip.ibs", member_sha256: "b".repeat(64) },
  },
  component: "CHIP",
  pin_to_source_port_map: { A1: "source_port_tx" },
  model_selections: { A1: "OUTPUT" },
  corner: "typical",
  package_policy: "omit",
}

export const stimulus = {
  type: "simulation_digital_stimulus",
  name: "DATA",
  simulation_experiment_id: "experiment",
  source_port_id: "source_port_tx",
  unit_interval_ms: "2.5ns",
  start_time_ms: "0ns",
  initial_state: 0,
  inverted: false,
  pattern: { type: "bits", bits: "00010111", repeat: true },
}

export const eye = {
  type: "simulation_eye_diagram",
  name: "RX_EYE",
  simulation_experiment_id: "experiment",
  simulation_voltage_probe_id: "probe_rx",
  unit_interval_ms: "2.5ns",
  time_origin_ms: "1.25ns",
  start_time_ms: "40ns",
  end_time_ms: "160ns",
}
