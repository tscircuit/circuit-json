import { expect, test } from "bun:test"
import {
  any_circuit_element,
  simulation_current_source,
  simulation_measurement_result,
  simulation_voltage_source,
} from "../src"

test("parses compact PWL source waveforms", () => {
  const voltageSource = simulation_voltage_source.parse({
    type: "simulation_voltage_source",
    is_dc_source: false,
    voltage_waveform: {
      timestamps_ms: ["0ms", "1ms", "1.001ms"],
      voltage_values: ["2.2V", "2.2V", "4.2V"],
    },
  })
  expect(voltageSource.voltage_waveform).toEqual({
    timestamps_ms: [0, 1, 1.001],
    voltage_values: [2.2, 2.2, 4.2],
  })

  const currentSource = simulation_current_source.parse({
    type: "simulation_current_source",
    is_dc_source: false,
    current_waveform: {
      timestamps_ms: ["0ms", "1ms", "1.001ms"],
      current_values: ["100mA", "100mA", "1A"],
    },
  })
  expect(currentSource.current_waveform).toEqual({
    timestamps_ms: [0, 1, 1.001],
    current_values: [0.1, 0.1, 1],
  })
})

test("rejects invalid PWL source waveforms", () => {
  expect(() =>
    simulation_voltage_source.parse({
      type: "simulation_voltage_source",
      is_dc_source: false,
      voltage_waveform: {
        timestamps_ms: [0, 1, 1],
        voltage_values: [2.2, 2.2, 4.2],
      },
    }),
  ).toThrow("strictly increasing")

  expect(() =>
    simulation_current_source.parse({
      type: "simulation_current_source",
      is_dc_source: false,
      current_waveform: {
        timestamps_ms: [0, 1],
        current_values: [0.1],
      },
    }),
  ).toThrow("same length")
})

test("parses aligned scalar measurement results", () => {
  const measurementResult = simulation_measurement_result.parse({
    type: "simulation_measurement_result",
    simulation_experiment_id: "simulation_experiment_0",
    name: "efficiency",
    measurement_values: [91.2, 92.4],
    measurement_unit: "%",
    simulation_parameter_sweep_coordinate_sets: [
      [
        {
          simulation_parameter_sweep_id: "simulation_parameter_sweep_vin",
          sweep_index: 0,
          parameter_value: 2.5,
          parameter_unit: "V",
        },
      ],
      [
        {
          simulation_parameter_sweep_id: "simulation_parameter_sweep_vin",
          sweep_index: 1,
          parameter_value: 3.3,
          parameter_unit: "V",
        },
      ],
    ],
  })

  expect(any_circuit_element.parse(measurementResult).type).toBe(
    "simulation_measurement_result",
  )
  expect(measurementResult.measurement_values).toEqual([91.2, 92.4])
})

test("rejects misaligned scalar measurement results", () => {
  expect(() =>
    simulation_measurement_result.parse({
      type: "simulation_measurement_result",
      simulation_experiment_id: "simulation_experiment_0",
      name: "efficiency",
      measurement_values: [91.2, 92.4],
      measurement_unit: "%",
      simulation_parameter_sweep_coordinate_sets: [
        [
          {
            simulation_parameter_sweep_id: "simulation_parameter_sweep_vin",
            sweep_index: 0,
            parameter_value: 2.5,
            parameter_unit: "V",
          },
        ],
      ],
    }),
  ).toThrow("same length")
})
