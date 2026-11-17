import { expect, test } from "bun:test"
import {
  any_circuit_element,
  simulation_eye_diagram,
  type SimulationEyeDiagramInput,
} from "../src"

const eye = {
  type: "simulation_eye_diagram",
  name: "RX_EYES",
  simulation_signal_integrity_id: "simulation_1",
} satisfies SimulationEyeDiagramInput

const parses = (change: object) =>
  simulation_eye_diagram.safeParse({ ...eye, ...change }).success

test("simulation_eye_diagram", () => {
  const record = simulation_eye_diagram.parse(eye)
  expect(record.simulation_eye_diagram_id).toStartWith(
    "simulation_eye_diagram_",
  )
  expect(any_circuit_element.parse(record)).toEqual(record)

  for (const change of [
    { simulation_pcb_driver_receiver_channel_ids: ["channel_tx"] },
    { start_time: 40e-9, end_time: 160e-9 },
    { start_time: "16UI", end_time: "64UI" },
    { start_time: "16UI", end_time: 160e-9 },
  ])
    expect(parses(change)).toBe(true)

  for (const change of [
    { name: " " },
    { simulation_signal_integrity_id: "" },
    { simulation_pcb_driver_receiver_channel_ids: [] },
    { simulation_pcb_driver_receiver_channel_ids: [""] },
    { start_time: -1 },
    { end_time: Number.NaN },
    { start_time: "-1UI" },
    { start_time: "InfinityUI" },
    { start_time: "2ns" },
    { start_time: "64UI", end_time: "16UI" },
    { start_time: 1e-9, end_time: 1e-9 },
  ])
    expect(parses(change)).toBe(false)
})
