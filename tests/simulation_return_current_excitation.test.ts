import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import {
  simulation_return_current_excitation,
  type SimulationReturnCurrentExcitation,
  type SimulationReturnCurrentExcitationInput,
} from "../src/simulation/simulation_return_current_excitation"

const excitation: SimulationReturnCurrentExcitationInput = {
  type: "simulation_return_current_excitation",
  pcb_trace_id: "pcb_trace_0",
  ground_source_net_id: "source_net_0",
  current: "500mA",
  return_source: { x: "12mm", y: "2mm" },
  return_sink: { x: "-12mm", y: "2mm" },
}

test("return-current excitation parses units, generates an ID, and joins the circuit element union", () => {
  const parsed: SimulationReturnCurrentExcitation =
    simulation_return_current_excitation.parse(excitation)
  expect(parsed.current).toBe(0.5)
  expect(parsed.return_source).toEqual({ x: 12, y: 2 })
  expect(parsed.return_sink).toEqual({ x: -12, y: 2 })
  expect(parsed.simulation_return_current_excitation_id).toStartWith(
    "simulation_return_current_excitation_",
  )
  expect(any_circuit_element.parse(parsed)).toEqual(parsed)
})

test("negative and zero currents preserve the requested direction and amplitude", () => {
  expect(
    simulation_return_current_excitation.parse({ ...excitation, current: -2 })
      .current,
  ).toBe(-2)
  expect(
    simulation_return_current_excitation.parse({ ...excitation, current: 0 })
      .current,
  ).toBe(0)
})

test("non-finite current and contact coordinates are rejected", () => {
  for (const current of [Infinity, -Infinity, NaN]) {
    expect(
      simulation_return_current_excitation.safeParse({ ...excitation, current })
        .success,
    ).toBe(false)
  }
  for (const coordinate of [Infinity, -Infinity, NaN]) {
    expect(
      simulation_return_current_excitation.safeParse({
        ...excitation,
        return_source: { x: coordinate, y: 0 },
      }).success,
    ).toBe(false)
    expect(
      simulation_return_current_excitation.safeParse({
        ...excitation,
        return_sink: { x: 0, y: coordinate },
      }).success,
    ).toBe(false)
  }
})

test("trace, ground-net, and both contact references are mandatory", () => {
  for (const field of [
    "pcb_trace_id",
    "ground_source_net_id",
    "return_source",
    "return_sink",
  ] as const) {
    expect(
      simulation_return_current_excitation.safeParse({
        ...excitation,
        [field]: undefined,
      }).success,
    ).toBe(false)
  }
})
