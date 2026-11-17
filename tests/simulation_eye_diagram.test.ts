import { expect, test } from "bun:test"
import {
  any_circuit_element,
  simulation_eye_diagram,
  type SimulationEyeDiagramInput,
} from "../src"

const eye = {
  type: "simulation_eye_diagram",
  name: "RX_EYES",
  simulation_pcb_transient_channel_simulation_id: "simulation_1",
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
    { start_time_ms: 40e-6, end_time_ms: 160e-6 },
    { start_time_ms: "40ns", end_time_ms: "160ns" },
  ])
    expect(parses(change)).toBe(true)
  expect(
    simulation_eye_diagram.parse({ ...eye, start_time_ms: "40ns" })
      .start_time_ms,
  ).toBeCloseTo(40e-6, 15)

  for (const change of [
    { name: " " },
    { simulation_pcb_transient_channel_simulation_id: "" },
    { simulation_pcb_driver_receiver_channel_ids: [] },
    { simulation_pcb_driver_receiver_channel_ids: [""] },
    { start_time_ms: -1 },
    { end_time_ms: Number.NaN },
    { start_time_ms: "16UI" },
    { start_time_ms: 1e-6, end_time_ms: 1e-6 },
    { start_time_ms: 2e-6, end_time_ms: 1e-6 },
  ])
    expect(parses(change)).toBe(false)
})
