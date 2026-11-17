import { expect, test } from "bun:test"
import {
  any_circuit_element,
  simulation_pcb_transient_channel_result,
  type SimulationPcbTransientChannelResultInput,
} from "../src"

const conductor = {
  simulation_pcb_driver_receiver_channel_id: "channel_1",
  source_port_id: "tx",
}
const entry = {
  frequency_hz: 1e6,
  resistance_ohms: [[1]],
  inductance_henries: [[2e-9]],
  capacitance_farads: [[2e-12]],
  conductance_siemens: [[0]],
}
const result = {
  type: "simulation_pcb_transient_channel_result",
  simulation_pcb_transient_channel_simulation_id: "run_1",
  conductors: [conductor],
  matrices: [entry],
} satisfies SimulationPcbTransientChannelResultInput

const parses = (change: object) =>
  simulation_pcb_transient_channel_result.safeParse({ ...result, ...change })
    .success

test("simulation_pcb_transient_channel_result", () => {
  const parsed = simulation_pcb_transient_channel_result.parse(result)
  expect(parsed.simulation_pcb_transient_channel_result_id).toStartWith(
    "simulation_pcb_transient_channel_result_",
  )
  expect(any_circuit_element.parse(parsed)).toEqual(parsed)

  const pair = [
    [1, 0],
    [0, 1],
  ]
  expect(
    parses({
      conductors: [conductor, { ...conductor, source_port_id: "tx_n" }],
      matrices: [
        {
          frequency_hz: 1e6,
          resistance_ohms: pair,
          inductance_henries: pair,
          capacitance_farads: [
            [2, -1],
            [-1, 2],
          ],
          conductance_siemens: pair,
        },
      ],
    }),
  ).toBe(true)

  expect(parses({ conductors: [conductor, conductor] })).toBe(false)
  for (const field of [
    "resistance_ohms",
    "inductance_henries",
    "capacitance_farads",
    "conductance_siemens",
  ]) {
    expect(parses({ matrices: [{ ...entry, [field]: [[Infinity]] }] })).toBe(
      false,
    )
    expect(parses({ matrices: [{ ...entry, [field]: [[1, 0]] }] })).toBe(false)
  }
  for (const field of ["capacitance_farads", "conductance_siemens"])
    expect(parses({ matrices: [{ ...entry, [field]: [[-1]] }] })).toBe(false)
})
