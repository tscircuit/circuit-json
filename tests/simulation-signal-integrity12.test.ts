import { expect, test } from "bun:test"
import * as circuitJson from "../src"
import { model } from "./fixtures/simulation-ibis"
import { samples } from "./fixtures/simulation-signal-integrity"

test("removed SI records and settings are absent while general SPICE remains", () => {
  // Complete records accepted by the schemas before their removal.
  for (const record of [
    {
      type: "simulation_ibis_pin_state",
      simulation_ibis_pin_state_id: "pin_state",
      simulation_experiment_id: "experiment",
      source_port_id: "port",
      is_output: true,
      is_output_enabled: true,
    },
    {
      type: "simulation_digital_stimulus",
      simulation_digital_stimulus_id: "stimulus",
      simulation_experiment_id: "experiment",
      source_port_id: "port",
      name: "Data",
      bit_duration_ms: 1e-6,
      start_time_ms: 0,
      initial_state: 0,
      inverted: false,
      transmission_pattern: {
        transmission_type: "bits",
        bits: "01",
        repeat: true,
      },
    },
    {
      type: "simulation_eye_diagram",
      simulation_eye_diagram_id: "eye",
      simulation_experiment_id: "experiment",
      simulation_voltage_probe_id: "probe",
      name: "Eye",
      unit_interval_ms: 1e-6,
      time_origin_ms: 0,
    },
    {
      type: "simulation_signal_eye",
      simulation_signal_eye_id: "eye",
      simulation_signal_id: "dq0",
      source_port_id: "port",
      folded_traces: [samples],
      eye_height_v: 1,
      eye_width_s: 1e-9,
      mask_margin_v: 0,
    },
    {
      type: "simulation_signal_crosstalk",
      simulation_signal_crosstalk_id: "crosstalk",
      simulation_signal_id: "dq0",
      source_port_id: "port",
      end: "far",
      idle_voltage_v: 0,
      peak_positive_v: 0.1,
      peak_negative_v: -0.1,
    },
    {
      type: "simulation_signal_strobe_margin",
      simulation_signal_strobe_margin_id: "margin",
      simulation_signal_id: "dq0",
      source_port_id: "port",
      edges: [{ time_s: 1e-9, setup_margin_s: 1e-10, hold_margin_s: 2e-10 }],
      worst_setup_margin_s: 1e-10,
      worst_hold_margin_s: 2e-10,
    },
  ]) {
    expect(Reflect.has(circuitJson, record.type)).toBe(false)
    expect(circuitJson.any_circuit_element.safeParse(record).success).toBe(
      false,
    )
  }
  expect(Reflect.has(circuitJson, "pcb_spice_channel")).toBe(false)
  const experiment = {
    type: "simulation_experiment",
    name: "Transient",
    experiment_type: "spice_transient_analysis",
  }
  expect(
    circuitJson.simulation_experiment.safeParse({
      ...experiment,
      spice_engine: "pcb_spice",
    }).success,
  ).toBe(false)
  expect(
    circuitJson.simulation_experiment.parse({
      ...experiment,
      spice_engine: "ngspice",
      pcb_spice_channel: {},
    }),
  ).not.toHaveProperty("pcb_spice_channel")
  const parsedModel = circuitJson.simulation_ibis_model.parse({
    ...model,
    model_value_corner: "typical",
    include_package_parasitics: false,
  })
  expect(parsedModel).not.toHaveProperty("model_value_corner")
  expect(parsedModel).not.toHaveProperty("include_package_parasitics")
})
