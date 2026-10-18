import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
import { stimulus } from "./fixtures/simulation-ibis"
test("digital stimuli reject invalid timing and nonbinary traffic", () => {
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
})
