import { expect, test } from "bun:test"
import * as circuitJson from "../src"
import { signal, accepts } from "./fixtures/simulation-signal-integrity"

test("clock and literal sources omit seed; constant literals carry a quiet state", () => {
  for (const pattern of ["clock", "0011010", "0", "000", "1", "111"]) {
    const constant = /^(?:0+|1+)$/.test(pattern)
    const { seed, ...record } = signal
    const normalized = {
      ...record,
      pattern,
      quiet: constant ? (pattern[0] === "0" ? "low" : "high") : undefined,
    }
    expect(circuitJson.simulation_signal.parse(normalized)).not.toHaveProperty(
      "seed",
    )
    expect(accepts(signal, { ...normalized, seed: 1 })).toBe(false)
    expect(
      accepts(signal, { ...normalized, quiet: undefined, seed: undefined }),
    ).toBe(!constant)
    expect(
      accepts(signal, { ...normalized, quiet: "off", seed: undefined }),
    ).toBe(true)
  }
})
