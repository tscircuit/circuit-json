import { expect, test } from "bun:test"
import * as circuitJson from "../src"
import {
  signal,
  expectInvalidChanges,
} from "./fixtures/simulation-signal-integrity"

test("signals support literal bits and multiple receivers without a count cap", () => {
  expect(
    circuitJson.simulation_signal.parse({
      ...signal,
      pattern: "01".repeat(65537),
      seed: undefined,
      probe: "global",
      receivers: Array(64).fill(signal.driver),
    }).receivers,
  ).toHaveLength(64)
  expectInvalidChanges(signal, [
    { receivers: [] },
    { name: "" },
    { simulation_signal_integrity_id: "" },
    { bit_rate_bps: 0 },
    { bit_rate_bps: Infinity },
    { offset_s: -1 },
    { offset_s: Infinity },
    { pattern: "012" },
    { pattern: "" },
    { pattern: "prbs9" },
    { quiet: true },
    { probe: "ideal" },
  ])
})
