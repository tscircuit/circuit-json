import { expect, test } from "bun:test"
import {
  any_circuit_element,
  simulation_pcb_driver_receiver_channel,
  type SimulationPcbDriverReceiverChannelInput,
} from "../src"

const channel = {
  type: "simulation_pcb_driver_receiver_channel",
  simulation_signal_integrity_id: "run_1",
  name: "DATA",
  driver: { source_port_id: "tx", ibis_model_name: "OUT" },
  receivers: [{ source_port_id: "rx" }, { source_port_id: "rx2" }],
  bit_rate_bps: 50e6,
  pattern: "01",
  offset_s: 0,
} satisfies SimulationPcbDriverReceiverChannelInput

test("registers resolved single-ended and differential driver receiver channels", () => {
  const parsed = simulation_pcb_driver_receiver_channel.parse(channel)
  expect(parsed.simulation_pcb_driver_receiver_channel_id).toStartWith(
    "simulation_pcb_driver_receiver_channel_",
  )
  expect(any_circuit_element.parse(parsed)).toEqual(parsed)
  const differential = simulation_pcb_driver_receiver_channel.parse({
    ...channel,
    driver: {
      p_source_port_id: "tx_p",
      n_source_port_id: "tx_n",
      p_ibis_model_name: "P",
      n_ibis_model_name: "N",
    },
    receivers: [{ p_source_port_id: "rx_p", n_source_port_id: "rx_n" }],
  })
  expect(any_circuit_element.parse(differential)).toEqual(differential)
  expect(
    any_circuit_element.safeParse({ ...channel, type: "simulation_signal" })
      .success,
  ).toBe(false)
})

test("preserves open patterns and validates optional PRBS seed bounds", () => {
  for (const pattern of ["0", "1", "clock", "custom-pattern"])
    expect(
      simulation_pcb_driver_receiver_channel.parse({
        ...channel,
        pattern,
        driver_disabled: true,
      }).pattern,
    ).toBe(pattern)
  expect(
    simulation_pcb_driver_receiver_channel.parse({ ...channel, seed: 1 }).seed,
  ).toBe(1)
  for (const order of [7, 15, 31]) {
    const pattern = `prbs${order}`
    const max = 2 ** order - 1
    expect(
      simulation_pcb_driver_receiver_channel.parse({ ...channel, pattern })
        .seed,
    ).toBeUndefined()
    for (const seed of [1, max])
      expect(
        simulation_pcb_driver_receiver_channel.parse({
          ...channel,
          pattern,
          seed,
        }).seed,
      ).toBe(seed)
    for (const seed of [0, max + 1, 1.5])
      expect(
        simulation_pcb_driver_receiver_channel.safeParse({
          ...channel,
          pattern,
          seed,
        }).success,
      ).toBe(false)
  }
})

test("rejects ambiguous endpoints and invalid resolved traffic", () => {
  for (const change of [
    { simulation_signal_integrity_id: "" },
    { driver: { p_source_port_id: "same", n_source_port_id: "same" } },
    {
      driver: {
        source_port_id: "tx",
        p_source_port_id: "tx_p",
        n_source_port_id: "tx_n",
      },
    },
    { receivers: [] },
    { receivers: [{ p_source_port_id: "rx_p", n_source_port_id: "rx_n" }] },
    { receivers: [{ source_port_id: "" }] },
    { bit_rate_bps: -1 },
    { offset_s: Infinity },
    { offset_s: -1 },
    { pattern: "" },
  ])
    expect(
      simulation_pcb_driver_receiver_channel.safeParse({
        ...channel,
        ...change,
      }).success,
    ).toBe(false)
})
