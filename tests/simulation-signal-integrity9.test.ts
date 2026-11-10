import { expect, test } from "bun:test"
import { rlgc, accepts } from "./fixtures/simulation-signal-integrity"

test("RLGC matrices use listed conductor order, without a size cap", () => {
  const [p, n] = rlgc.conductors
  for (const [conductors, valid] of [
    ...[1, 4, 16].map(
      (size) =>
        [
          Array.from({ length: size }, (_, i) => ({
            simulation_signal_id: `signal_${i}`,
            source_port_id: `port_${i}`,
          })),
          true,
        ] as const,
    ),
    [[p, n], true],
    [[n, p], true],
    [[p, { ...p, simulation_signal_id: "dq0" }, n], true],
    [[], false],
    [[p, p], false],
    [[p, { ...p, source_port_id: "third_port" }, n], false],
    [[p, { ...n, source_port_id: "" }], false],
    [[p, { ...n, simulation_signal_id: "" }], false],
    [[p, { simulation_signal_id: "dqs" }], false],
    [[{ ...p, source_trace_id: "trace" }, n], false],
  ] as const) {
    const size = conductors.length
    const matrix = Array.from({ length: size }, (_, i) =>
      Array.from({ length: size }, (_, j) => (i === j ? 1 : -0.1)),
    )
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
    ).toBe(valid)
  }
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
