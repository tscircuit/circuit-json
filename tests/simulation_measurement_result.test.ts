import { expect, test } from "bun:test"
import { any_circuit_element, simulation_measurement_result } from "../src"

const inputVoltageCoordinate = {
  simulation_parameter_sweep_id: "simulation_parameter_sweep_input_voltage",
  sweep_index: 0,
  parameter_value: 2.5,
  parameter_unit: "V" as const,
}

const loadCurrentCoordinate = {
  simulation_parameter_sweep_id: "simulation_parameter_sweep_load_current",
  sweep_index: 0,
  parameter_value: 0,
  parameter_unit: "A" as const,
}

test("parses a multidimensional simulation measurement result", () => {
  const result = simulation_measurement_result.parse({
    type: "simulation_measurement_result",
    simulation_experiment_id: "simulation_experiment_load_regulation",
    name: "output-voltage-regulation",
    measurement_values: [-0.08, -0.07],
    measurement_unit: "%",
    simulation_parameter_sweep_coordinate_sets: [
      [inputVoltageCoordinate, loadCurrentCoordinate],
      [
        inputVoltageCoordinate,
        {
          ...loadCurrentCoordinate,
          sweep_index: 1,
          parameter_value: 0.25,
        },
      ],
    ],
  })

  expect(result.measurement_values).toEqual([-0.08, -0.07])
  expect(result.simulation_parameter_sweep_coordinate_sets?.[1]?.[1]).toEqual({
    ...loadCurrentCoordinate,
    sweep_index: 1,
    parameter_value: 0.25,
  })
  expect(any_circuit_element.parse(result).type).toBe(
    "simulation_measurement_result",
  )
})

test("parses one measurement value without parameter sweeps", () => {
  const result = simulation_measurement_result.parse({
    type: "simulation_measurement_result",
    simulation_experiment_id: "simulation_experiment_bias",
    name: "output-voltage",
    measurement_values: [3.3],
    measurement_unit: "V",
  })

  expect(result.measurement_values).toEqual([3.3])
  expect(result.simulation_parameter_sweep_coordinate_sets).toBeUndefined()
})

test("parses a one-dimensional swept measurement result", () => {
  const result = simulation_measurement_result.parse({
    type: "simulation_measurement_result",
    simulation_experiment_id: "simulation_experiment_load_regulation",
    name: "output-voltage",
    measurement_values: [3.301, 3.299],
    measurement_unit: "V",
    simulation_parameter_sweep_coordinate_sets: [
      [loadCurrentCoordinate],
      [
        {
          ...loadCurrentCoordinate,
          sweep_index: 1,
          parameter_value: 0.25,
        },
      ],
    ],
  })

  expect(result.simulation_parameter_sweep_coordinate_sets).toHaveLength(2)
  expect(result.simulation_parameter_sweep_coordinate_sets?.[0]).toHaveLength(1)
})

test("rejects measurement values without matching coordinate sets", () => {
  expect(() =>
    simulation_measurement_result.parse({
      type: "simulation_measurement_result",
      simulation_experiment_id: "simulation_experiment_load_regulation",
      name: "output-voltage-regulation",
      measurement_values: [-0.08, -0.07],
      measurement_unit: "%",
      simulation_parameter_sweep_coordinate_sets: [
        [inputVoltageCoordinate, loadCurrentCoordinate],
      ],
    }),
  ).toThrow(
    "measurement_values and simulation_parameter_sweep_coordinate_sets must have the same length",
  )
})

test("rejects multiple values when there are no parameter sweeps", () => {
  expect(() =>
    simulation_measurement_result.parse({
      type: "simulation_measurement_result",
      simulation_experiment_id: "simulation_experiment_bias",
      name: "output-voltage",
      measurement_values: [3.3, 3.29],
      measurement_unit: "V",
    }),
  ).toThrow(
    "A measurement result without parameter sweeps must contain exactly one value",
  )
})

test("rejects non-finite measurement values", () => {
  expect(() =>
    simulation_measurement_result.parse({
      type: "simulation_measurement_result",
      simulation_experiment_id: "simulation_experiment_bias",
      name: "output-voltage",
      measurement_values: [Number.NaN],
      measurement_unit: "V",
    }),
  ).toThrow()
})
