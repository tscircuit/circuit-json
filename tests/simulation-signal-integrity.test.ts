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

function accepts(
  record: typeof block | typeof signal | typeof waveform | typeof rlgc,
  change: Record<string, unknown>,
) {
  return circuitJson[record.type].safeParse({ ...record, ...change }).success
}

function expectInvalidChanges(
  record: typeof block | typeof signal | typeof waveform | typeof rlgc,
  changes: Record<string, unknown>[],
) {
  for (const change of changes) expect(accepts(record, change)).toBe(false)
}

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

const endpoint = {
  kind: "differential",
  p_source_port_id: "bus_p",
  n_source_port_id: "bus_n",
  p_ibis_model_name: "Model_579",
  n_ibis_model_name: "Model_771",
}
test("differential endpoints select models while arrays mean multiple receivers", () => {
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
  expectInvalidChanges(signal, [
    { driver: endpoint },
    { receivers: [signal.driver, endpoint] },
    { driver: endpoint, receivers: [endpoint, signal.driver] },
  ])
})

test.each(
  [
    "selector",
    [],
    [signal.driver, signal.driver],
    { kind: "single", source_port_id: "" },
    { kind: "single", source_port_id: "port", ibis_model_name: "" },
    { kind: "differential", p_source_port_id: "p" },
    { ...endpoint, n_source_port_id: "" },
    { ...endpoint, n_source_port_id: endpoint.p_source_port_id },
    { ...endpoint, ibis_model_name: "BUS" },
    { ...endpoint, p_ibis_model_name: "" },
    { ...endpoint, n_ibis_model_name: "" },
    { ...signal.driver, p_source_port_id: "p", n_source_port_id: "n" },
    { ...endpoint, kind: "pair" },
  ].map((invalid) => ({ invalid })),
)("rejects invalid endpoint $invalid", ({ invalid }) => {
  expect(circuitJson.signal_endpoint.safeParse(invalid).success).toBe(false)
})

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

test("waveforms require paired finite samples", () => {
  expectInvalidChanges(waveform, [
    { end: "middle" },
    { idle_voltage_v: Infinity },
    { timestamps_s: [] },
    { voltage_levels: [] },
    { voltage_levels: [0] },
    { timestamps_s: [0, -1, 2] },
    { timestamps_s: [0, 0, 2] },
    { timestamps_s: [0, 2, 1] },
    { timestamps_s: [1e-9, 2e-9, 3e-9] },
    { timestamps_s: [1e-9], voltage_levels: [0] },
    { timestamps_s: [0, Infinity, 2] },
    { voltage_levels: [0, NaN, 1] },
    { voltage_levels: [0, Infinity, 1] },
  ])
  expect(
    circuitJson.simulation_signal_waveform.parse({
      ...waveform,
      end: "near",
      idle_voltage_v: 0.1,
    }).idle_voltage_v,
  ).toBe(0.1)
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

test("removed SI records and settings are absent while general SPICE remains", () => {
  // Complete records accepted by the schemas before their removal.
  for (const record of [
    {
      type: "simulation_ibis_pin_state",
      simulation_ibis_pin_state_id: "pin_state",
      simulation_experiment_id: "experiment",
      source_port_id: "port",
      is_output: true,
      is_output_enabled: true,
    },
    {
      type: "simulation_digital_stimulus",
      simulation_digital_stimulus_id: "stimulus",
      simulation_experiment_id: "experiment",
      source_port_id: "port",
      name: "Data",
      bit_duration_ms: 1e-6,
      start_time_ms: 0,
      initial_state: 0,
      inverted: false,
      transmission_pattern: {
        transmission_type: "bits",
        bits: "01",
        repeat: true,
      },
    },
    {
      type: "simulation_eye_diagram",
      simulation_eye_diagram_id: "eye",
      simulation_experiment_id: "experiment",
      simulation_voltage_probe_id: "probe",
      name: "Eye",
      unit_interval_ms: 1e-6,
      time_origin_ms: 0,
    },
    {
      type: "simulation_signal_eye",
      simulation_signal_eye_id: "eye",
      simulation_signal_id: "dq0",
      source_port_id: "port",
      folded_traces: [samples],
      eye_height_v: 1,
      eye_width_s: 1e-9,
      mask_margin_v: 0,
    },
    {
      type: "simulation_signal_crosstalk",
      simulation_signal_crosstalk_id: "crosstalk",
      simulation_signal_id: "dq0",
      source_port_id: "port",
      end: "far",
      idle_voltage_v: 0,
      peak_positive_v: 0.1,
      peak_negative_v: -0.1,
    },
    {
      type: "simulation_signal_strobe_margin",
      simulation_signal_strobe_margin_id: "margin",
      simulation_signal_id: "dq0",
      source_port_id: "port",
      edges: [{ time_s: 1e-9, setup_margin_s: 1e-10, hold_margin_s: 2e-10 }],
      worst_setup_margin_s: 1e-10,
      worst_hold_margin_s: 2e-10,
    },
  ]) {
    expect(Reflect.has(circuitJson, record.type)).toBe(false)
    expect(circuitJson.any_circuit_element.safeParse(record).success).toBe(
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
  expectInvalidChanges(
    signal,
    [
      "mask",
      "strobe_simulation_signal_id",
      "thresholds",
      "setup_s",
      "hold_s",
    ].map((field) => ({ [field]: "removed" })),
  )
})
