import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
import { eye } from "./fixtures/simulation-ibis"
test("eye timing normalizes while retaining its probe association", () => {
  const record = any_circuit_element.parse(eye)
  if (record.type !== "simulation_eye_diagram")
    throw new Error("Expected an eye measurement")
  expect(record.time_origin_ms).toBeCloseTo(0.00000125, 14)
  expect(record.simulation_voltage_probe_id).toBe("probe_rx")
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(record)))).toEqual(
    record,
  )
})
