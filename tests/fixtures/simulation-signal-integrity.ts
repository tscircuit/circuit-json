import { expect } from "bun:test"
import * as circuitJson from "../../src"
import type {
  SimulationSignalInput,
  SimulationSignalIntegrityInput,
  SimulationSignalWaveformInput,
  SimulationSignalIntegrityRlgcInput,
} from "../../src"

export const block = {
  type: "simulation_signal_integrity",
  name: "WRITE",
  bit_rate_bps: 1.6e9,
  duration_s: 1e-6,
  allow_unrouted_traces: false,
} satisfies SimulationSignalIntegrityInput

export const signal = {
  type: "simulation_signal",
  simulation_signal_integrity_id: "si_write",
  name: "DQ0",
  driver: { source_port_id: "mc_dq0" },
  receivers: [
    {
      source_port_id: "dram_dq0",
      ibis_model_name: "DQ_40_ODT40_1600",
    },
    { source_port_id: "dram2_dq0" },
  ],
  bit_rate_bps: 1.6e9,
  pattern: "prbs7",
  seed: 123,
  offset_s: 0,
} satisfies SimulationSignalInput

export const samples = {
  timestamps_s: [0, 1e-9, 2e-9],
  voltage_levels: [-0.1, 1.8, 0.1],
}

export const waveform = {
  type: "simulation_signal_waveform",
  simulation_signal_id: "dq0",
  source_port_id: "dram_dq0",
  ...samples,
} satisfies SimulationSignalWaveformInput

export const rlgc = {
  type: "simulation_signal_integrity_rlgc",
  simulation_signal_integrity_id: "si_write",
  conductors: [
    { simulation_signal_id: "dqs", source_port_id: "mc_dqs_p" },
    { simulation_signal_id: "dqs", source_port_id: "mc_dqs_n" },
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

export function accepts(
  record: typeof block | typeof signal | typeof waveform | typeof rlgc,
  change: Record<string, unknown>,
) {
  return circuitJson[record.type].safeParse({ ...record, ...change }).success
}

export function expectInvalidChanges(
  record: typeof block | typeof signal | typeof waveform | typeof rlgc,
  changes: Record<string, unknown>[],
) {
  for (const change of changes) expect(accepts(record, change)).toBe(false)
}

export const endpoint = {
  p_source_port_id: "bus_p",
  n_source_port_id: "bus_n",
  p_ibis_model_name: "Model_579",
  n_ibis_model_name: "Model_771",
}
