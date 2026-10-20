import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
import { stimulus } from "./fixtures/simulation-ibis"
test("digital stimuli reject invalid timing and nonbinary traffic", () => {
  for (const change of [
    { bit_duration_ms: 0 },
    { bit_duration_ms: Infinity },
    { start_time_ms: -1 },
  ]) {
    expect(
      any_circuit_element.safeParse({ ...stimulus, ...change }).success,
    ).toBe(false)
  }
  for (const bits of ["012", "", [], [0, 2]]) {
    expect(
      any_circuit_element.safeParse({
        ...stimulus,
        transmission_pattern: { ...stimulus.transmission_pattern, bits },
      }).success,
    ).toBe(false)
  }
})
