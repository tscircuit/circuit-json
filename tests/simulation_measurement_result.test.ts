import { expect, test } from "bun:test"
import {
  simulation_measurement_result,
  type SimulationMeasurementResult,
} from "../src/simulation"

test("simulation_measurement_result parses multidimensional coordinates", () => {
  const result: SimulationMeasurementResult =
    simulation_measurement_result.parse({
      type: "simulation_measurement_result",
      simulation_experiment_id: "simulation_experiment_0",
      name: "efficiency",
      measurement_values: [0.91, 0.94],
      measurement_unit: "%",
      simulation_parameter_sweep_coordinate_sets: [
        [
          {
            simulation_parameter_sweep_id: "simulation_parameter_sweep_vin",
            sweep_index: 0,
            parameter_value: 2.5,
            parameter_unit: "V",
          },
          {
            simulation_parameter_sweep_id: "simulation_parameter_sweep_load",
            sweep_index: 0,
            parameter_value: 0.1,
            parameter_unit: "A",
          },
        ],
        [
          {
            simulation_parameter_sweep_id: "simulation_parameter_sweep_vin",
            sweep_index: 0,
            parameter_value: 2.5,
            parameter_unit: "V",
          },
          {
            simulation_parameter_sweep_id: "simulation_parameter_sweep_load",
            sweep_index: 1,
            parameter_value: 1,
            parameter_unit: "A",
          },
        ],
      ],
    })

  expect(result.measurement_values).toEqual([0.91, 0.94])
  expect(result.simulation_parameter_sweep_coordinate_sets?.[1]?.[1]).toEqual({
    simulation_parameter_sweep_id: "simulation_parameter_sweep_load",
    sweep_index: 1,
    parameter_value: 1,
    parameter_unit: "A",
  })
})

test("simulation_measurement_result rejects coordinate length mismatch", () => {
  expect(() =>
    simulation_measurement_result.parse({
      type: "simulation_measurement_result",
      simulation_experiment_id: "simulation_experiment_0",
      name: "output-voltage",
      measurement_values: [3.3, 3.29],
      measurement_unit: "V",
      simulation_parameter_sweep_coordinate_sets: [[]],
    }),
  ).toThrow(
    "measurement_values and simulation_parameter_sweep_coordinate_sets must have the same length",
  )
})
