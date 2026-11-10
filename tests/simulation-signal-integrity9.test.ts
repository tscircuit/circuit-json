import { expect, test } from "bun:test"
import { rlgc, accepts } from "./fixtures/simulation-signal-integrity"

test("RLGC matrices use listed conductor order, without a size cap", () => {
  for (const size of [1, 4, 16]) {
    const matrix = Array.from({ length: size }, (_, i) =>
      Array.from({ length: size }, (_, j) => (i === j ? 1 : -0.1)),
    )
    const conductors = Array.from({ length: size }, (_, i) => ({
      simulation_signal_id: `signal_${i}`,
      leg: "single",
    }))
    expect(
      accepts(rlgc, {
        conductors,
        matrices: [1e6, 1e7].map((frequency_hz) => ({
          frequency_hz,
          r_ohm: matrix,
          l_h: matrix,
          c_f: matrix,
          g_s: matrix,
        })),
      }),
    ).toBe(true)
  }
  for (const conductors of [
    [],
    [rlgc.conductors[0], rlgc.conductors[0]],
    [rlgc.conductors[0], { simulation_signal_id: "dq0", leg: "p" }],
    [{ simulation_signal_id: "dqs", leg: "single" }, rlgc.conductors[1]],
    [rlgc.conductors[0], { simulation_signal_id: "dqs", leg: "" }],
    [{ simulation_signal_id: "dqs" }, rlgc.conductors[1]],
    [{ ...rlgc.conductors[0], source_trace_id: "trace" }, rlgc.conductors[1]],
  ])
    expect(accepts(rlgc, { conductors })).toBe(false)
  for (const frequencies of [
    [],
    [0],
    [-1],
    [Infinity],
    [NaN],
    [1e6, 1e6],
    [1e7, 1e6],
  ])
    expect(
      accepts(rlgc, {
        matrices: frequencies.map((frequency_hz) => ({
          ...rlgc.matrices[0],
          frequency_hz,
        })),
      }),
    ).toBe(false)
})
