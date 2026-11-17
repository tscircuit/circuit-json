import { expect, test } from "bun:test"
import {
  any_circuit_element,
  simulation_pcb_driver_receiver_channel,
  type SimulationPcbDriverReceiverChannelInput,
} from "../src"

const channel = {
  type: "simulation_pcb_driver_receiver_channel",
  simulation_pcb_transient_channel_simulation_id: "run_1",
  name: "DATA",
  driver: { source_port_id: "tx", ibis_model_name: "OUT" },
  receivers: [{ source_port_id: "rx" }, { source_port_id: "rx2" }],
  bit_rate_bps: 50e6,
  pattern: "prbs7",
  offset_ms: 0,
} satisfies SimulationPcbDriverReceiverChannelInput

const parses = (change: object) =>
  simulation_pcb_driver_receiver_channel.safeParse({ ...channel, ...change })
    .success

test("simulation_pcb_driver_receiver_channel", () => {
  const parsed = simulation_pcb_driver_receiver_channel.parse(channel)
  expect(parsed.simulation_pcb_driver_receiver_channel_id).toStartWith(
    "simulation_pcb_driver_receiver_channel_",
  )
  expect(any_circuit_element.parse(parsed)).toEqual(parsed)
  expect(
    simulation_pcb_driver_receiver_channel.parse({
      ...channel,
      offset_ms: "1.25ns",
    }).offset_ms,
  ).toBeCloseTo(1.25e-6, 15)

  for (const change of [
    {
      driver: { p_source_port_id: "tx_p", n_source_port_id: "tx_n" },
      receivers: [{ p_source_port_id: "rx_p", n_source_port_id: "rx_n" }],
    },
    { pattern: "custom-pattern", driver_disabled: true },
    { seed: 1 },
    { seed: 2 ** 7 - 1 },
  ])
    expect(parses(change)).toBe(true)

  for (const change of [
    { simulation_pcb_transient_channel_simulation_id: "" },
    { driver: { p_source_port_id: "same", n_source_port_id: "same" } },
    { receivers: [] },
    { receivers: [{ p_source_port_id: "rx_p", n_source_port_id: "rx_n" }] },
    { bit_rate_bps: -1 },
    { offset_ms: -1 },
    { pattern: "" },
    { seed: 0 },
    { seed: 2 ** 7 },
    { seed: 1.5 },
  ])
    expect(parses(change)).toBe(false)
})
