import { expect, test } from "bun:test"
import * as circuitJson from "../src"
import {
  waveform,
  expectInvalidChanges,
} from "./fixtures/simulation-signal-integrity"

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
