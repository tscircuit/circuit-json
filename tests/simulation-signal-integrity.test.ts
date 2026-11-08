import { expect, test } from "bun:test"
import * as circuitJson from "../src"
import type {
  SimulationSignalInput,
  SimulationSignalIntegrityInput,
  SimulationSignalWaveformInput,
  SimulationSignalEyeInput,
  SimulationSignalCrosstalkInput,
  SimulationSignalStrobeMarginInput,
  SimulationSignalIntegrityRlgcInput,
} from "../src"
import { model } from "./fixtures/simulation-ibis"

const block = {
  type: "simulation_signal_integrity",
  name: "WRITE",
  bit_rate_bps: 1.6e9,
  duration_s: 1e-6,
  corner: "typ",
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
  mask: { vih_v: 0.9, vil_v: 0.6, setup_s: 75e-12, hold_s: 100e-12 },
  strobe_simulation_signal_id: "dqs",
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
const eye = {
  type: "simulation_signal_eye",
  simulation_signal_id: "dq0",
  source_port_id: "dram_dq0",
  folded_traces: [samples, samples],
  eye_height_v: 0.8,
  eye_width_s: 300e-12,
  mask_margin_v: -0.02,
} satisfies SimulationSignalEyeInput
const crosstalk = {
  type: "simulation_signal_crosstalk",
  simulation_signal_id: "dq0",
  end: "far",
  source_port_id: "dram_dq0",
  idle_voltage_v: 1.5,
  peak_positive_v: 0.02,
  peak_negative_v: -0.04,
} satisfies SimulationSignalCrosstalkInput
const strobeMargin = {
  type: "simulation_signal_strobe_margin",
  simulation_signal_id: "dq0",
  source_port_id: "dram_dq0",
  edges: [
    { time_s: 1e-9, setup_margin_s: -10e-12, hold_margin_s: 20e-12 },
    { time_s: 2e-9, setup_margin_s: 30e-12, hold_margin_s: -5e-12 },
  ],
  worst_setup_margin_s: -10e-12,
  worst_hold_margin_s: -5e-12,
} satisfies SimulationSignalStrobeMarginInput
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
      // RFC charge-neutral reduction of [[4,-1,-1],[-1,4,-1],[-1,-1,4]] pF.
      c_f: [
        [(10 / 3) * 1e-12, (-5 / 3) * 1e-12],
        [(-5 / 3) * 1e-12, (10 / 3) * 1e-12],
      ],
      g_s: [
        [0, 0],
        [0, 0],
      ],
    },
  ],
} satisfies SimulationSignalIntegrityRlgcInput

test.each([block, signal, waveform, eye, crosstalk, strobeMargin, rlgc])(
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
  for (const corner of ["typ", "min", "max"]) {
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
    { corner: "typical" },
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

test("signals support named patterns, literal bits, quiet levels and masks without a count cap", () => {
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
          mask: "ibis",
          probe: "global",
          strobe_simulation_signal_id: undefined,
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
    { mask: { setup_s: -1 } },
    { mask: { vih_v: Infinity } },
    { strobe_simulation_signal_id: undefined },
  ])
    expect(
      circuitJson.simulation_signal.safeParse({ ...signal, ...change }).success,
    ).toBe(false)
  expect(
    circuitJson.simulation_signal.safeParse({
      ...signal,
      mask: { vih_v: 0.9 },
      strobe_simulation_signal_id: undefined,
    }).success,
  ).toBe(true)
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

test("a required strobe cannot refer to the signal itself; forward references remain valid", () => {
  const record = { ...signal, simulation_signal_id: "dq0" }
  expect(
    circuitJson.simulation_signal.parse(record).strobe_simulation_signal_id,
  ).toBe("dqs")
  const self = { ...record, strobe_simulation_signal_id: "dq0" }
  expect(circuitJson.simulation_signal.safeParse(self).success).toBe(false)
  expect(circuitJson.any_circuit_element.safeParse(self).success).toBe(false)
  expect(
    circuitJson.simulation_signal.safeParse({ ...self, mask: "ibis" }).success,
  ).toBe(false)
})

test("waveforms and folded traces require paired finite samples", () => {
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
    expect(
      circuitJson.simulation_signal_eye.safeParse({
        ...eye,
        folded_traces: [{ ...samples, ...change }],
      }).success,
    ).toBe(false)
  }
  for (const change of [
    { folded_traces: [] },
    { eye_height_v: Infinity },
    { eye_width_s: -1 },
    { eye_width_s: Infinity },
    { mask_margin_v: NaN },
  ]) {
    expect(
      circuitJson.simulation_signal_eye.safeParse({ ...eye, ...change })
        .success,
    ).toBe(false)
  }
})

test("crosstalk keeps near and each far receiver separate, with signed peaks from idle", () => {
  const records = [
    {
      ...crosstalk,
      end: "near",
      source_port_id: "mc_dq0",
      peak_negative_v: -0.01,
    },
    crosstalk,
    {
      ...crosstalk,
      source_port_id: "dram2_dq0",
      idle_voltage_v: 1.4,
      peak_positive_v: 0.03,
    },
  ].map((record) => circuitJson.simulation_signal_crosstalk.parse(record))
  expect(records.map((record) => [record.end, record.source_port_id])).toEqual([
    ["near", "mc_dq0"],
    ["far", "dram_dq0"],
    ["far", "dram2_dq0"],
  ])
  expect(records.map((record) => record.peak_negative_v)).toEqual([
    -0.01, -0.04, -0.04,
  ])
  expect(records.map((record) => record.idle_voltage_v)).toEqual([
    1.5, 1.5, 1.4,
  ])
  for (const record of records)
    expect(circuitJson.any_circuit_element.parse(record)).toEqual(record)
  for (const field of [
    "idle_voltage_v",
    "peak_positive_v",
    "peak_negative_v",
  ]) {
    for (const value of [Infinity, -Infinity, NaN]) {
      expect(
        circuitJson.simulation_signal_crosstalk.safeParse({
          ...crosstalk,
          [field]: value,
        }).success,
      ).toBe(false)
    }
  }
  for (const change of [
    { peak_positive_v: -0.01 },
    { peak_negative_v: 0.01 },
    { end: "middle" },
    { source_port_id: undefined },
  ])
    expect(
      circuitJson.simulation_signal_crosstalk.safeParse({
        ...crosstalk,
        ...change,
      }).success,
    ).toBe(false)
  expect(
    circuitJson.simulation_signal_crosstalk.safeParse({
      ...crosstalk,
      idle_voltage_v: -0.5,
      peak_positive_v: 0,
      peak_negative_v: 0,
    }).success,
  ).toBe(true)
})

test("eye height, mask and timing margins can be negative; worst margins are edge minima", () => {
  expect(
    circuitJson.simulation_signal_eye.parse({ ...eye, eye_height_v: -0.1 })
      .eye_height_v,
  ).toBe(-0.1)
  expect(
    circuitJson.simulation_signal_eye.parse(eye).mask_margin_v,
  ).toBeLessThan(0)
  expect(
    circuitJson.simulation_signal_strobe_margin.parse(strobeMargin)
      .worst_setup_margin_s,
  ).toBeLessThan(0)
  for (const change of [
    { edges: [] },
    { worst_setup_margin_s: Infinity },
    { worst_hold_margin_s: NaN },
    { edges: [{ ...strobeMargin.edges[0], time_s: -1 }] },
    { edges: [{ ...strobeMargin.edges[0], setup_margin_s: Infinity }] },
    { edges: [{ ...strobeMargin.edges[0], hold_margin_s: undefined }] },
    { edges: [...strobeMargin.edges].reverse() },
    { edges: [strobeMargin.edges[0], strobeMargin.edges[0]] },
    { worst_setup_margin_s: 30e-12 },
    { worst_hold_margin_s: -10e-12 },
  ])
    expect(
      circuitJson.simulation_signal_strobe_margin.safeParse({
        ...strobeMargin,
        ...change,
      }).success,
    ).toBe(false)
})

test("differential RLGC keeps distinct P/N conductors with the same signal ID", () => {
  const result = circuitJson.simulation_signal_integrity_rlgc.parse(rlgc)
  expect(result.conductors).toEqual(rlgc.conductors)
  expect(result.matrices[0]!.c_f[0]![1]).toBeLessThan(0)
  expect(circuitJson.any_circuit_element.parse(result)).toEqual(result)
})

test("RLGC matrices use physical conductor order, including unlisted copper, without a size cap", () => {
  for (const size of [1, 4, 16]) {
    const matrix = Array.from({ length: size }, (_, i) =>
      Array.from({ length: size }, (_, j) => (i === j ? 1 : -0.1)),
    )
    const conductors = Array.from({ length: size }, (_, i) =>
      i === 0
        ? { source_trace_id: "unlisted_trace" }
        : { simulation_signal_id: `signal_${i}`, leg: "single" },
    )
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
