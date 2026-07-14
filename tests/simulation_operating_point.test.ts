import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import {
  simulation_experiment_error,
  simulation_operating_point_current,
  simulation_operating_point_voltage,
} from "../src/simulation"

test("operating-point results and classified errors parse", () => {
  const voltageResult = simulation_operating_point_voltage.parse({
    type: "simulation_operating_point_voltage",
    simulation_experiment_id: "simulation_experiment_bias",
    simulation_voltage_probe_id: "simulation_voltage_probe_vout",
    voltage: "3.3V",
    name: "VOUT",
  })
  const currentResult = simulation_operating_point_current.parse({
    type: "simulation_operating_point_current",
    simulation_experiment_id: "simulation_experiment_bias",
    simulation_current_probe_id: "simulation_current_probe_iin",
    current: "2mA",
    name: "IIN",
  })
  const error = simulation_experiment_error.parse({
    type: "simulation_experiment_error",
    simulation_experiment_id: "simulation_experiment_bias",
    error_code: "non_convergent",
    message: "DC operating point did not converge",
    diagnostics: ["singular matrix"],
    is_fatal: true,
  })

  expect(voltageResult.voltage).toBe(3.3)
  expect(currentResult.current).toBe(0.002)
  expect(error.error_code).toBe("non_convergent")
  expect(() => any_circuit_element.parse(voltageResult)).not.toThrow()
  expect(() => any_circuit_element.parse(currentResult)).not.toThrow()
  expect(() => any_circuit_element.parse(error)).not.toThrow()
})
