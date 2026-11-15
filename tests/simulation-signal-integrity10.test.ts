import { expect, test } from "bun:test"
import { rlgc, accepts } from "./fixtures/simulation-signal-integrity"

test.each(["r_ohm", "l_h", "c_f", "g_s"])(
  "%s matrices are finite and square, with Maxwell signs for C/G",
  (field) => {
    for (const [matrix, valid] of [
      [[], false],
      [[[1]], false],
      [[[1, 0], [0]], false],
      [
        [
          [1, Infinity],
          [0, 1],
        ],
        false,
      ],
      [
        [
          [-1, 0],
          [0, 1],
        ],
        field === "r_ohm" || field === "l_h",
      ],
      [
        [
          [1, 0.1],
          [0.1, 1],
        ],
        field === "r_ohm" || field === "l_h",
      ],
    ] as const)
      expect(
        accepts(rlgc, {
          matrices: [{ ...rlgc.matrices[0], [field]: matrix }],
        }),
      ).toBe(valid)
  },
)
