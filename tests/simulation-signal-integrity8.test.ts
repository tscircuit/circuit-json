import { expect, test } from "bun:test"
import * as circuitJson from "../src"
import {
  waveform,
  expectInvalidChanges,
} from "./fixtures/simulation-signal-integrity"

test("waveforms require paired finite samples", () => {
  expectInvalidChanges(waveform, [
    { simulation_signal_id: "" },
    { source_port_id: "" },
    { idle_voltage_v: Infinity },
    { idle_voltage_v: NaN },
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
  // Quietness depends on the referenced signal, which this record cannot validate.
  expect(
    circuitJson.simulation_signal_waveform.parse(waveform),
  ).not.toHaveProperty("idle_voltage_v")
  for (const idle_voltage_v of [-0.1, 0, 0.1])
    expect(
      circuitJson.simulation_signal_waveform.parse({
        ...waveform,
        idle_voltage_v,
      }).idle_voltage_v,
    ).toBe(idle_voltage_v)
})
