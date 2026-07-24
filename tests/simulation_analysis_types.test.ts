import { expect, test } from "bun:test"
import {
  any_circuit_element,
  simulation_ac_sweep_voltage_graph,
  simulation_dc_operating_point_voltage,
  simulation_dc_sweep_current_graph,
  simulation_experiment,
  simulation_parameter_sweep,
} from "../src"

test("parses analysis-specific experiment fields", () => {
  const acExperiment = simulation_experiment.parse({
    type: "simulation_experiment",
    name: "frequency-response",
    experiment_type: "spice_ac_analysis",
    ac_sweep_type: "decade",
    ac_samples_per_interval: 20,
    ac_start_frequency_hz: 10,
    ac_stop_frequency_hz: 1_000_000,
  })
  expect(acExperiment.ac_sweep_type).toBe("decade")

  const dcSweepExperiment = simulation_experiment.parse({
    type: "simulation_experiment",
    name: "line-regulation",
    experiment_type: "spice_dc_sweep",
    dc_sweep_voltage_source_id: "simulation_voltage_source_0",
    dc_sweep_start: 2.5,
    dc_sweep_stop: 5.5,
    dc_sweep_step: 0.1,
    dc_sweep_unit: "V",
  })
  expect(dcSweepExperiment.dc_sweep_step).toBe(0.1)
})

test("rejects incomplete analysis experiments", () => {
  expect(() =>
    simulation_experiment.parse({
      type: "simulation_experiment",
      name: "frequency-response",
      experiment_type: "spice_ac_analysis",
      ac_sweep_type: "linear",
      ac_start_frequency_hz: 10,
      ac_stop_frequency_hz: 1_000,
    }),
  ).toThrow()
})

test("parses parameter sweeps", () => {
  const sweep = simulation_parameter_sweep.parse({
    type: "simulation_parameter_sweep",
    simulation_experiment_id: "simulation_experiment_0",
    parameter_type: "resistance",
    resistor_source_component_id: "source_component_0",
    parameter_values: [100, 330, 1_000],
    parameter_unit: "Ω",
  })
  expect(any_circuit_element.parse(sweep).type).toBe(
    "simulation_parameter_sweep",
  )
})

test("parses analysis-specific simulation results", () => {
  const operatingPoint = simulation_dc_operating_point_voltage.parse({
    type: "simulation_dc_operating_point_voltage",
    simulation_experiment_id: "simulation_experiment_0",
    simulation_voltage_probe_id: "simulation_voltage_probe_0",
    voltage: 3.3,
    simulation_parameter_sweep_coordinate: {
      simulation_parameter_sweep_id: "simulation_parameter_sweep_0",
      sweep_index: 1,
      parameter_value: 330,
      parameter_unit: "Ω",
    },
  })
  expect(operatingPoint.voltage).toBe(3.3)
  expect(
    operatingPoint.simulation_parameter_sweep_coordinate?.sweep_index,
  ).toBe(1)

  const dcSweep = simulation_dc_sweep_current_graph.parse({
    type: "simulation_dc_sweep_current_graph",
    simulation_experiment_id: "simulation_experiment_1",
    simulation_current_probe_id: "simulation_current_probe_0",
    sweep_values: [0, 1, 2],
    sweep_unit: "V",
    current_levels: [0, 0.01, 0.02],
  })
  expect(dcSweep.current_levels).toHaveLength(3)

  const acSweep = simulation_ac_sweep_voltage_graph.parse({
    type: "simulation_ac_sweep_voltage_graph",
    simulation_experiment_id: "simulation_experiment_2",
    simulation_voltage_probe_id: "simulation_voltage_probe_0",
    frequencies_hz: [10, 100],
    complex_voltages: [
      { re: 1, im: 0 },
      { re: 0.5, im: -0.5 },
    ],
  })
  expect(acSweep.complex_voltages[1]).toEqual({ re: 0.5, im: -0.5 })
})
