import { expect, test } from "bun:test"
import * as circuitJson from "../src"
import { signal, accepts } from "./fixtures/simulation-signal-integrity"

test("clock and literal patterns stay literal, omit seed, and allow disabled drivers", () => {
  const { seed, ...record } = signal
  for (const pattern of ["clock", "0011010", "0", "000", "1", "111"]) {
    for (const driver_disabled of [undefined, false, true]) {
      const source = { ...record, pattern, driver_disabled }
      const parsed = circuitJson.simulation_signal.parse(source)
      expect(parsed).toMatchObject(source)
      expect(parsed).not.toHaveProperty("seed")
      expect(accepts(signal, { ...source, seed: 1 })).toBe(false)
    }
  }
})
