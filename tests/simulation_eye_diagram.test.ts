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

test("eye diagrams select every driven channel by default", () => {
  const record = simulation_eye_diagram.parse(eye)
  expect(record).toMatchObject(eye)
  expect(record.simulation_eye_diagram_id).toStartWith(
    "simulation_eye_diagram_",
  )
  expect(record.simulation_pcb_driver_receiver_channel_ids).toBeUndefined()
  expect(record.start_time).toBeUndefined()
  expect(record.end_time).toBeUndefined()
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(record)))).toEqual(
    record,
  )
})

test.each([
  { start_time: 40e-9, end_time: 160e-9 },
  { start_time: "16UI", end_time: "64UI" },
  { start_time: "16UI", end_time: 160e-9 },
  { start_time: 40e-9, end_time: "64UI" },
])("eye windows retain seconds or per-channel UI: %j", (window) => {
  const input = {
    ...eye,
    simulation_pcb_driver_receiver_channel_ids: ["channel_tx", "channel_rx"],
    ...window,
  }
  const record = any_circuit_element.parse(input)
  expect(record).toMatchObject(input)
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(record)))).toEqual(
    record,
  )
})

test("eye diagrams reject invalid references and measurement windows", () => {
  for (const change of [
    { name: " " },
    { simulation_signal_integrity_id: undefined },
    { simulation_signal_integrity_id: "" },
    { simulation_pcb_driver_receiver_channel_ids: [] },
    { simulation_pcb_driver_receiver_channel_ids: [""] },
    { start_time: -1 },
    { start_time: Infinity },
    { end_time: Number.NaN },
    { start_time: "-1UI" },
    { start_time: "1e999UI" },
    { start_time: "InfinityUI" },
    { start_time: "2ns" },
    { start_time: "16UI", end_time: "16UI" },
    { start_time: "64UI", end_time: "16UI" },
    { start_time: 1e-9, end_time: 1e-9 },
    { start_time: 2e-9, end_time: 1e-9 },
  ]) {
    expect(
      simulation_eye_diagram.safeParse({ ...eye, ...change }).success,
    ).toBe(false)
  }
})

test("eye diagrams reject the superseded analog probe and folding fields", () => {
  for (const field of [
    "simulation_experiment_id",
    "simulation_voltage_probe_id",
    "unit_interval_ms",
    "time_origin_ms",
    "start_time_ms",
    "end_time_ms",
  ]) {
    expect(any_circuit_element.safeParse({ ...eye, [field]: 1 }).success).toBe(
      false,
    )
  }
})
