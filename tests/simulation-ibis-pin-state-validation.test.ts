import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
test("pin direction uses booleans and only outputs accept an enable state", () => {
  const pin = {
    type: "simulation_ibis_pin_state",
    simulation_experiment_id: "experiment",
    source_port_id: "port",
  }
  for (const state of [
    { is_output: true },
    { is_output: false, is_output_enabled: true },
    { is_output: false, is_output_enabled: false },
    { is_output: "output" },
  ]) {
    expect(any_circuit_element.safeParse({ ...pin, ...state }).success).toBe(
      false,
    )
  }
  for (const state of [
    { is_output: false },
    { is_output: true, is_output_enabled: false },
    { is_output: true, is_output_enabled: true },
  ]) {
    expect(any_circuit_element.parse({ ...pin, ...state })).toMatchObject(state)
  }
})
