import { expect, test } from "bun:test"
import {
  any_circuit_element,
  simulation_signal_waveform,
  type SimulationSignalWaveformInput,
} from "../src"

const waveform = {
  type: "simulation_signal_waveform",
  simulation_pcb_driver_receiver_channel_id: "channel_1",
  source_port_id: "rx",
  timestamps_s: [0, 1e-9],
  voltage_levels: [0, 1.2],
} satisfies SimulationSignalWaveformInput

test("waveforms reference driver receiver channels and retain their record type", () => {
  const parsed = simulation_signal_waveform.parse(waveform)
  expect(parsed.simulation_signal_waveform_id).toStartWith(
    "simulation_signal_waveform_",
  )
  expect(any_circuit_element.parse(parsed)).toEqual(parsed)
  expect(
    simulation_signal_waveform.safeParse({
      ...waveform,
      simulation_pcb_driver_receiver_channel_id: undefined,
      simulation_signal_id: "old_channel",
    }).success,
  ).toBe(false)
  expect(
    simulation_signal_waveform.safeParse({ ...waveform, voltage_levels: [0] })
      .success,
  ).toBe(false)
  expect(
    simulation_signal_waveform.safeParse({ ...waveform, timestamps_s: [0, 0] })
      .success,
  ).toBe(false)
})
