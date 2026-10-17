import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
import { stimulus, eye } from "./fixtures/simulation-ibis"

test("invalid digital timing, nonbinary traffic, pin states and eye gates are rejected", () => {
  for (const change of [
    { unit_interval_ms: 0 },
    { unit_interval_ms: Infinity },
    { start_time_ms: -1 },
    { pattern: { type: "bits", bits: "012", repeat: true } },
    { pattern: { type: "bits", bits: "", repeat: true } },
  ]) {
    expect(
      any_circuit_element.safeParse({ ...stimulus, ...change }).success,
    ).toBe(false)
  }
  for (const state of [{ mode: "output" }, { mode: "input", enabled: false }]) {
    expect(
      any_circuit_element.safeParse({
        type: "simulation_ibis_pin_state",
        simulation_experiment_id: "experiment",
        source_port_id: "port",
        ...state,
      }).success,
    ).toBe(false)
  }
  for (const change of [
    { unit_interval_ms: -1 },
    { time_origin_ms: Infinity },
    { start_time_ms: "200ns" },
    { end_time_ms: 0 },
  ]) {
    expect(any_circuit_element.safeParse({ ...eye, ...change }).success).toBe(
      false,
    )
  }
})
