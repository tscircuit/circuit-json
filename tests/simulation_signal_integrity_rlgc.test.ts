import { expect, test } from "bun:test"
import {
  any_circuit_element,
  simulation_signal_integrity_rlgc,
  type SimulationSignalIntegrityRlgcInput,
} from "../src"

const result = {
  type: "simulation_signal_integrity_rlgc",
  simulation_signal_integrity_id: "run_1",
  conductors: [
    {
      simulation_pcb_driver_receiver_channel_id: "channel_1",
      source_port_id: "tx",
    },
  ],
  matrices: [
    {
      frequency_hz: 1e6,
      resistance_ohms: [[1]],
      inductance_henries: [[2e-9]],
      capacitance_farads: [[2e-12]],
      conductance_siemens: [[0]],
    },
  ],
} satisfies SimulationSignalIntegrityRlgcInput

test("RLGC keeps its run and references driver receiver channels with expanded matrix fields", () => {
  const parsed = simulation_signal_integrity_rlgc.parse(result)
  expect(parsed.simulation_signal_integrity_rlgc_id).toStartWith(
    "simulation_signal_integrity_rlgc_",
  )
  expect(any_circuit_element.parse(parsed)).toEqual(parsed)
  expect(
    simulation_signal_integrity_rlgc.safeParse({
      ...result,
      conductors: [
        { simulation_signal_id: "old_channel", source_port_id: "tx" },
      ],
    }).success,
  ).toBe(false)
})

test("conductor cardinality and matrix dimensions still apply to renamed channel IDs", () => {
  const conductor = result.conductors[0]!
  for (const conductors of [
    [conductor, conductor],
    [conductor, { ...conductor, source_port_id: "other" }],
  ])
    expect(
      simulation_signal_integrity_rlgc.safeParse({ ...result, conductors })
        .success,
    ).toBe(false)
  const pair = {
    ...result,
    conductors: [conductor, { ...conductor, source_port_id: "tx_n" }],
    matrices: [
      {
        frequency_hz: 1e6,
        resistance_ohms: [
          [1, 0],
          [0, 1],
        ],
        inductance_henries: [
          [2e-9, 0],
          [0, 2e-9],
        ],
        capacitance_farads: [
          [2e-12, -1e-13],
          [-1e-13, 2e-12],
        ],
        conductance_siemens: [
          [0, 0],
          [0, 0],
        ],
      },
    ],
  }
  expect(simulation_signal_integrity_rlgc.safeParse(pair).success).toBe(true)
})

test("expanded matrix fields retain dimensional and coupling validation", () => {
  const entry = result.matrices[0]!
  for (const field of [
    "resistance_ohms",
    "inductance_henries",
    "conductance_siemens",
    "capacitance_farads",
  ])
    expect(
      simulation_signal_integrity_rlgc.safeParse({
        ...result,
        matrices: [{ ...entry, [field]: [[Infinity]] }],
      }).success,
    ).toBe(false)
  for (const field of ["conductance_siemens", "capacitance_farads"])
    expect(
      simulation_signal_integrity_rlgc.safeParse({
        ...result,
        matrices: [{ ...entry, [field]: [[-1]] }],
      }).success,
    ).toBe(false)
  expect(
    simulation_signal_integrity_rlgc.safeParse({
      ...result,
      matrices: [
        {
          frequency_hz: 1e6,
          r_ohm: [[1]],
          l_h: [[2e-9]],
          c_f: [[2e-12]],
          g_s: [[0]],
        },
      ],
    }).success,
  ).toBe(false)
})
