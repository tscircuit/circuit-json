import { expect, test } from "bun:test"
import {
  any_circuit_element,
  simulation_signal_waveform_result,
  type SimulationSignalWaveformResultInput,
} from "../src"

const waveform = {
  type: "simulation_signal_waveform_result",
  simulation_pcb_driver_receiver_channel_id: "channel_1",
  source_port_id: "rx",
  timestamps_ms: [0, 1e-6],
  voltage_levels: [0, 1.2],
} satisfies SimulationSignalWaveformResultInput

test("waveforms reference driver receiver channels and retain their record type", () => {
  const parsed = simulation_signal_waveform_result.parse(waveform)
  expect(parsed.simulation_signal_waveform_result_id).toStartWith(
    "simulation_signal_waveform_result_",
  )
  expect(any_circuit_element.parse(parsed)).toEqual(parsed)
  expect(
    simulation_signal_waveform_result.safeParse({
      ...waveform,
      simulation_pcb_driver_receiver_channel_id: undefined,
      simulation_signal_id: "old_channel",
    }).success,
  ).toBe(false)
  expect(
    simulation_signal_waveform_result.safeParse({
      ...waveform,
      voltage_levels: [0],
    }).success,
  ).toBe(false)
  expect(
    simulation_signal_waveform_result.safeParse({
      ...waveform,
      timestamps_ms: [0, 0],
    }).success,
  ).toBe(false)
})
