import { expect, test } from "bun:test"
import { signal, accepts } from "./fixtures/simulation-signal-integrity"

test.each([7, 15, 31])(
  "PRBS%d seeds are resolved integers in 1..2^n-1",
  (order) => {
    const maxSeed = 2 ** order - 1
    for (const seed of [
      1,
      maxSeed,
      undefined,
      0,
      -1,
      1.5,
      maxSeed + 1,
      Infinity,
      NaN,
      "1",
    ]) {
      expect(
        accepts(signal, { pattern: `prbs${order}`, seed, quiet: "off" }),
      ).toBe(seed === 1 || seed === maxSeed)
    }
  },
)
