import { expect, test } from "bun:test"
import { rlgc, accepts } from "./fixtures/simulation-signal-integrity"

test.each(["c_f", "g_s"])(
  "%s symmetry uses a relative matrix tolerance",
  (field) => {
    for (const scale of [1e-12, 1, 1e12]) {
      for (const [difference, valid] of [
        [0, true],
        [0.5e-9, true],
        [2e-9, false],
      ] as const) {
        const matrix = [
          [scale, -scale / 4],
          [-scale / 4 + scale * difference, scale],
        ]
        expect(
          accepts(rlgc, {
            matrices: [{ ...rlgc.matrices[0], [field]: matrix }],
          }),
        ).toBe(valid)
      }
    }
  },
)
