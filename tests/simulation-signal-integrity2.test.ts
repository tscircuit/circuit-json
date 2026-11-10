import { expect, test } from "bun:test"
import * as circuitJson from "../src"
import {
  block,
  accepts,
  expectInvalidChanges,
} from "./fixtures/simulation-signal-integrity"

test("block choices are explicit and finite numerical values use SI units", () => {
  const { name, duration_s, ...automatic } = block
  const parsed = circuitJson.simulation_signal_integrity.parse({
    ...automatic,
    supply: "board",
  })
  for (const field of ["name", "duration_s", "supply"])
    expect(parsed).not.toHaveProperty(field)
  for (const change of [
    { corner: "minimum" },
    { corner: "maximum" },
    { unrouted: "ideal", pdn: "extracted" },
  ])
    expect(accepts(block, change)).toBe(true)
  expectInvalidChanges(block, [
    { bit_rate_bps: 0 },
    { bit_rate_bps: Infinity },
    { bit_rate_bps: "20Mbps" },
    { duration_s: -1 },
    { duration_s: 0 },
    { duration_s: Infinity },
    { duration_s: NaN },
    { corner: "typ" },
    { unlisted_nets: "ignore" },
    { unrouted: "skip" },
    { pdn: "guessed" },
  ])
})
