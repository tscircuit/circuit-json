import { expect, test } from "bun:test"
import * as circuitJson from "../src"
import {
  block,
  accepts,
  expectInvalidChanges,
} from "./fixtures/simulation-signal-integrity"

test("unrouted traces require an explicit boolean and finite numerical values use SI units", () => {
  const { name, duration_s, ...automatic } = block
  const parsed = circuitJson.simulation_signal_integrity.parse({
    ...automatic,
    supply: "board",
  })
  for (const field of ["name", "duration_s", "supply"])
    expect(parsed).not.toHaveProperty(field)
  for (const allow_unrouted_traces of [false, true])
    expect(accepts(block, { allow_unrouted_traces })).toBe(true)
  expectInvalidChanges(block, [
    { name: "" },
    { bit_rate_bps: 0 },
    { bit_rate_bps: Infinity },
    { bit_rate_bps: "20Mbps" },
    { duration_s: -1 },
    { duration_s: 0 },
    { duration_s: Infinity },
    { duration_s: NaN },
    { allow_unrouted_traces: "ideal" },
    { allow_unrouted_traces: 0 },
    { allow_unrouted_traces: null },
  ])
})
