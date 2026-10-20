import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
import { eye } from "./fixtures/simulation-ibis"
test("eye measurement gates and unit intervals must be finite and ordered", () => {
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
