import type {
  SimulationIbisModelInput,
  SimulationDigitalStimulusInput,
  SimulationEyeDiagramInput,
} from "../../src"

export const model = {
  type: "simulation_ibis_model",
  source_component_id: "source_component_tx",
  ibis_model_asset: {
    project_relative_path: "models/chip.ibs",
    url: "https://example.com/chip.ibs",
    mimetype: "text/plain",
  },
  ibis_component_name: "CHIP",
  ibis_pin_name_to_source_port_id: { A1: "source_port_tx" },
  ibis_pin_name_to_model_name: { A1: "OUTPUT" },
  model_value_corner: "typical",
  include_package_parasitics: false,
} satisfies SimulationIbisModelInput

export const stimulus = {
  type: "simulation_digital_stimulus",
  name: "DATA",
  simulation_experiment_id: "experiment",
  source_port_id: "source_port_tx",
  bit_duration_ms: "2.5ns",
  start_time_ms: "0ns",
  initial_state: 0,
  inverted: false,
  transmission_pattern: {
    transmission_type: "bits",
    bits: "00010111",
    repeat: true,
  },
} satisfies SimulationDigitalStimulusInput

export const eye = {
  type: "simulation_eye_diagram",
  name: "RX_EYE",
  simulation_experiment_id: "experiment",
  simulation_voltage_probe_id: "probe_rx",
  unit_interval_ms: "2.5ns",
  time_origin_ms: "1.25ns",
  start_time_ms: "40ns",
  end_time_ms: "160ns",
} satisfies SimulationEyeDiagramInput
