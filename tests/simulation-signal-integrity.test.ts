import { expect, test } from "bun:test"
import * as circuitJson from "../src"
import type {
  SimulationSignalInput,
  SimulationSignalIntegrityInput,
  SimulationSignalWaveformInput,
  SimulationSignalIntegrityRlgcInput,
} from "../src"
import { model } from "./fixtures/simulation-ibis"

const block = {
  type: "simulation_signal_integrity",
  name: "WRITE",
  bit_rate_bps: 1.6e9,
  duration_s: 1e-6,
  corner: "typical",
  unlisted_nets: "passive",
  unrouted: "error",
  pdn: "ideal",
} satisfies SimulationSignalIntegrityInput

const signal = {
  type: "simulation_signal",
  simulation_signal_integrity_id: "si_write",
  name: "DQ0",
  driver: { kind: "single", source_port_id: "mc_dq0" },
  receivers: [
    {
      kind: "single",
      source_port_id: "dram_dq0",
      ibis_model_name: "DQ_40_ODT40_1600",
    },
    { kind: "single", source_port_id: "dram2_dq0" },
  ],
  bit_rate_bps: 1.6e9,
  pattern: "prbs7",
  seed: 123,
  offset_s: 0,
  probe: "local",
} satisfies SimulationSignalInput

const samples = {
  timestamps_s: [0, 1e-9, 2e-9],
  voltage_levels: [-0.1, 1.8, 0.1],
}
const waveform = {
  type: "simulation_signal_waveform",
  simulation_signal_id: "dq0",
  end: "far",
  source_port_id: "dram_dq0",
  ...samples,
} satisfies SimulationSignalWaveformInput
const rlgc = {
  type: "simulation_signal_integrity_rlgc",
  simulation_signal_integrity_id: "si_write",
  conductors: [
    { simulation_signal_id: "dqs", leg: "p" },
    { simulation_signal_id: "dqs", leg: "n" },
  ],
  matrices: [
    {
      frequency_hz: 1e6,
      r_ohm: [
        [1, 0.1],
        [0.1, 1],
      ],
      l_h: [
        [1e-9, 0.1e-9],
        [0.1e-9, 1e-9],
      ],
      // Ground-referenced signal block of the primitive Maxwell matrix.
      c_f: [
        [4e-12, -1e-12],
        [-1e-12, 4e-12],
      ],
      g_s: [
        [0, 0],
        [0, 0],
      ],
    },
  ],
} satisfies SimulationSignalIntegrityRlgcInput

test.each([block, signal, waveform, rlgc])(
  "$type is exported, generates an ID, and survives the public union and JSON roundtrip",
  (record) => {
    const schema = circuitJson[record.type]
    const parsed = schema.parse(record)
    expect(parsed).toMatchObject(record)
    expect(Reflect.get(parsed, `${record.type}_id`)).toStartWith(
      `${record.type}_`,
    )
    expect(circuitJson.any_circuit_element.parse(parsed)).toEqual(parsed)
    expect(
      circuitJson.any_circuit_element.parse(JSON.parse(JSON.stringify(parsed))),
    ).toEqual(parsed)
    for (const field of Object.keys(record).filter(
      (field) => field !== "name" && field !== "duration_s",
    )) {
      expect(schema.safeParse({ ...record, [field]: undefined }).success).toBe(
        false,
      )
    }
  },
)

test("block choices are explicit and finite numerical values use SI units", () => {
  expect(
    circuitJson.simulation_signal_integrity.parse({ ...block, name: undefined })
      .name,
  ).toBeUndefined()
  const { duration_s, ...automatic } = block
  expect(
    circuitJson.simulation_signal_integrity.parse(automatic),
  ).not.toHaveProperty("duration_s")
  expect(
    circuitJson.simulation_signal_integrity.parse({
      ...block,
      supply: "board",
    }),
  ).not.toHaveProperty("supply")
  for (const corner of ["typical", "minimum", "maximum"]) {
    for (const [unrouted, pdn] of [
      ["error", "extracted"],
      ["ideal", "ideal"],
    ]) {
      expect(
        circuitJson.simulation_signal_integrity.safeParse({
          ...block,
          corner,
          unrouted,
          pdn,
        }).success,
      ).toBe(true)
    }
  }
  for (const change of [
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
    expect(
      circuitJson.simulation_signal_integrity.safeParse({ ...block, ...change })
        .success,
    ).toBe(false)
})

test("differential endpoints select models while arrays mean multiple receivers", () => {
  const endpoint = {
    kind: "differential",
    p_source_port_id: "bus_p",
    n_source_port_id: "bus_n",
    p_ibis_model_name: "Model_579",
    n_ibis_model_name: "Model_771",
  }
  expect(
    circuitJson.simulation_signal.parse({
      ...signal,
      driver: endpoint,
      receivers: [endpoint],
    }),
  ).toMatchObject({ driver: endpoint, receivers: [endpoint] })
  expect(
    circuitJson.signal_endpoint.parse({
      ...endpoint,
      p_ibis_model_name: undefined,
      n_ibis_model_name: undefined,
    }).kind,
  ).toBe("differential")
  for (const invalid of [
    "selector",
    [],
    [signal.driver, signal.driver],
    { kind: "single", source_port_id: "" },
    { kind: "single", source_port_id: "port", ibis_model_name: "" },
    { kind: "differential", p_source_port_id: "p" },
    { kind: "differential", p_source_port_id: "p", n_source_port_id: "" },
    { ...endpoint, ibis_model_name: "BUS" },
    { ...endpoint, p_ibis_model_name: "" },
    { ...endpoint, n_ibis_model_name: "" },
    {
      kind: "single",
      source_port_id: "p",
      p_source_port_id: "p",
      n_source_port_id: "n",
    },
    { kind: "pair", p_source_port_id: "p", n_source_port_id: "n" },
  ]) {
    expect(circuitJson.signal_endpoint.safeParse(invalid).success).toBe(false)
    expect(
      circuitJson.simulation_signal.safeParse({ ...signal, driver: invalid })
        .success,
    ).toBe(false)
    expect(
      circuitJson.simulation_signal.safeParse({
        ...signal,
        receivers: [invalid],
      }).success,
    ).toBe(false)
  }
})

test("signals support named patterns, literal bits, quiet levels without a count cap", () => {
  for (const pattern of [
    "prbs7",
    "prbs15",
    "prbs31",
    "clock",
    "0011010",
    "01".repeat(65537),
  ]) {
    for (const quiet of [undefined, "low", "high", "off"]) {
      expect(
        circuitJson.simulation_signal.safeParse({
          ...signal,
          pattern,
          seed: pattern.startsWith("prbs") ? 123 : undefined,
          quiet,
          probe: "global",
        }).success,
      ).toBe(true)
    }
  }
  expect(
    circuitJson.simulation_signal.parse({
      ...signal,
      receivers: Array(64).fill(signal.driver),
    }).receivers,
  ).toHaveLength(64)
  for (const change of [
    { receivers: [] },
    { name: "" },
    { simulation_signal_integrity_id: "" },
    { bit_rate_bps: 0 },
    { bit_rate_bps: Infinity },
    { seed: 1.5 },
    { seed: -1 },
    { offset_s: -1 },
    { offset_s: Infinity },
    { pattern: "012" },
    { pattern: "" },
    { pattern: "prbs9" },
    { quiet: true },
    { probe: "ideal" },
  ])
    expect(
      circuitJson.simulation_signal.safeParse({ ...signal, ...change }).success,
    ).toBe(false)
})

test.each([7, 15, 31])(
  "PRBS%d seeds are resolved integers in 1..2^n-1, including quiet records",
  (order) => {
    const maxSeed = 2 ** order - 1
    for (const quiet of [undefined, "low", "high", "off"]) {
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
          circuitJson.simulation_signal.safeParse({
            ...signal,
            pattern: `prbs${order}`,
            seed,
            quiet,
          }).success,
        ).toBe(seed === 1 || seed === maxSeed)
      }
    }
  },
)

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
    expect(
      circuitJson.simulation_signal.safeParse({ ...normalized, seed: 1 })
        .success,
    ).toBe(false)
    expect(
      circuitJson.simulation_signal.safeParse({
        ...normalized,
        quiet: undefined,
      }).success,
    ).toBe(!constant)
    expect(
      circuitJson.simulation_signal.safeParse({ ...normalized, quiet: "off" })
        .success,
    ).toBe(true)
  }
})

test("waveforms require paired finite samples", () => {
  for (const end of ["near", "far"]) {
    expect(
      circuitJson.simulation_signal_waveform.safeParse({ ...waveform, end })
        .success,
    ).toBe(true)
  }
  expect(
    circuitJson.simulation_signal_waveform.safeParse({
      ...waveform,
      end: "middle",
    }).success,
  ).toBe(false)
  for (const change of [
    { timestamps_s: [] },
    { voltage_levels: [] },
    { voltage_levels: [0] },
    { timestamps_s: [0, -1, 2] },
    { timestamps_s: [0, 0, 2] },
    { timestamps_s: [0, 2, 1] },
    { timestamps_s: [0, Infinity, 2] },
    { voltage_levels: [0, NaN, 1] },
    { voltage_levels: [0, Infinity, 1] },
  ]) {
    expect(
      circuitJson.simulation_signal_waveform.safeParse({
        ...waveform,
        ...change,
      }).success,
    ).toBe(false)
  }
  expect(
    circuitJson.simulation_signal_waveform.parse({
      ...waveform,
      idle_voltage_v: 0.1,
    }).idle_voltage_v,
  ).toBe(0.1)
  expect(
    circuitJson.simulation_signal_waveform.safeParse({
      ...waveform,
      idle_voltage_v: Infinity,
    }).success,
  ).toBe(false)
})

test("differential RLGC keeps distinct P/N conductors with the same signal ID", () => {
  const result = circuitJson.simulation_signal_integrity_rlgc.parse(rlgc)
  expect(result.conductors).toEqual(rlgc.conductors)
  expect(result.matrices[0]!.c_f[0]![1]).toBeLessThan(0)
  expect(circuitJson.any_circuit_element.parse(result)).toEqual(result)
})

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
      circuitJson.simulation_signal_integrity_rlgc.safeParse({
        ...rlgc,
        conductors,
        matrices: [1e6, 1e7].map((frequency_hz) => ({
          frequency_hz,
          r_ohm: matrix,
          l_h: matrix,
          c_f: matrix,
          g_s: matrix,
        })),
      }).success,
    ).toBe(true)
  }
  for (const field of ["r_ohm", "l_h", "c_f", "g_s"]) {
    for (const matrix of [
      [],
      [[1]],
      [[1, 0], [0]],
      [
        [1, Infinity],
        [0, 1],
      ],
    ]) {
      expect(
        circuitJson.simulation_signal_integrity_rlgc.safeParse({
          ...rlgc,
          matrices: [{ ...rlgc.matrices[0], [field]: matrix }],
        }).success,
      ).toBe(false)
    }
  }
  for (const conductors of [
    [],
    [rlgc.conductors[0], rlgc.conductors[0]],
    [{ source_trace_id: "trace" }, { source_trace_id: "trace" }],
    [
      { simulation_signal_id: "dqs", leg: "p" },
      { simulation_signal_id: "dqs", leg: "" },
    ],
    [{ simulation_signal_id: "dqs" }, rlgc.conductors[1]],
    [{ source_trace_id: "" }, rlgc.conductors[1]],
    [{ ...rlgc.conductors[0], source_trace_id: "trace" }, rlgc.conductors[1]],
  ]) {
    expect(
      circuitJson.simulation_signal_integrity_rlgc.safeParse({
        ...rlgc,
        conductors,
      }).success,
    ).toBe(false)
  }
  for (const frequencies of [
    [],
    [0],
    [-1],
    [Infinity],
    [NaN],
    [1e6, 1e6],
    [1e7, 1e6],
  ]) {
    expect(
      circuitJson.simulation_signal_integrity_rlgc.safeParse({
        ...rlgc,
        matrices: frequencies.map((frequency_hz) => ({
          ...rlgc.matrices[0],
          frequency_hz,
        })),
      }).success,
    ).toBe(false)
  }
  for (const field of ["c_f", "g_s"]) {
    for (const matrix of [
      [
        [-1, 0],
        [0, 1],
      ],
      [
        [1, 0.1],
        [0.1, 1],
      ],
    ]) {
      expect(
        circuitJson.simulation_signal_integrity_rlgc.safeParse({
          ...rlgc,
          matrices: [{ ...rlgc.matrices[0], [field]: matrix }],
        }).success,
      ).toBe(false)
    }
  }
})

test("removed SI records and settings are absent while general SPICE remains", () => {
  for (const type of [
    "simulation_ibis_pin_state",
    "simulation_digital_stimulus",
    "simulation_eye_diagram",
    "simulation_signal_eye",
    "simulation_signal_crosstalk",
    "simulation_signal_strobe_margin",
  ]) {
    expect(Reflect.has(circuitJson, type)).toBe(false)
    expect(circuitJson.any_circuit_element.safeParse({ type }).success).toBe(
      false,
    )
  }
  expect(Reflect.has(circuitJson, "pcb_spice_channel")).toBe(false)
  const experiment = {
    type: "simulation_experiment",
    name: "Transient",
    experiment_type: "spice_transient_analysis",
  }
  expect(
    circuitJson.simulation_experiment.safeParse({
      ...experiment,
      spice_engine: "pcb_spice",
    }).success,
  ).toBe(false)
  expect(
    circuitJson.simulation_experiment.parse({
      ...experiment,
      spice_engine: "ngspice",
      pcb_spice_channel: {},
    }),
  ).not.toHaveProperty("pcb_spice_channel")
  const parsedModel = circuitJson.simulation_ibis_model.parse({
    ...model,
    model_value_corner: "typical",
    include_package_parasitics: false,
  })
  expect(parsedModel).not.toHaveProperty("model_value_corner")
  expect(parsedModel).not.toHaveProperty("include_package_parasitics")
})

test("measurement source fields are rejected", () => {
  for (const field of [
    "mask",
    "strobe_simulation_signal_id",
    "thresholds",
    "setup_s",
    "hold_s",
  ]) {
    expect(
      circuitJson.simulation_signal.safeParse({ ...signal, [field]: "removed" })
        .success,
    ).toBe(false)
  }
})
