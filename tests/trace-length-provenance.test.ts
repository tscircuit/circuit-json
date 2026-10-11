import { expect, test } from "bun:test"
import {
  source_trace,
  source_simple_capacitor,
  pcb_trace_warning,
  pcb_trace_length_warning,
  pcb_trace_too_long_error,
} from "../src"

const connection = {
  capacitor_source_component_id: "c",
  capacitor_source_port_id: "cp",
  associated_source_component_id: "u",
  associated_source_port_id: "up",
  connection_type: "supply",
  capacitor_role: "decoupling",
}

test("trace-length provenance and physical path survive Circuit JSON parsing", () => {
  const trace = source_trace.parse({
    type: "source_trace",
    source_trace_id: "t",
    connected_source_port_ids: ["cp", "up"],
    connected_source_net_ids: [],
    max_length: 5.5,
    max_length_origin: "configured_capacitor",
    capacitor_connection: connection,
  })
  expect(trace.capacitor_connection).toEqual(connection)
  expect(trace.max_length_origin).toBe("configured_capacitor")
  const error = pcb_trace_too_long_error.parse({
    type: "pcb_trace_too_long_error",
    pcb_trace_id: "pcb",
    message: "C1 to U1.VDD",
    actual_trace_length: 8,
    maximum_trace_length: 5.5,
    max_length_origin: "explicit",
    capacitor_connection: connection,
    path_pcb_trace_ids: ["pcb", "escape"],
    path_pcb_via_ids: ["via"],
    measurement_method: "shortest_copper_path",
  })
  expect(error.path_pcb_trace_ids).toEqual(["pcb", "escape"])
  expect(error.path_pcb_via_ids).toEqual(["via"])
  const warning = pcb_trace_warning.parse({
    type: "pcb_trace_warning",
    message: "Plane path indeterminate",
    pcb_trace_id: "pcb",
    source_trace_id: "t",
    pcb_component_ids: [],
    pcb_port_ids: [],
    trace_length_status: "indeterminate",
    measurement_reason: "Connected plane",
    maximum_trace_length: 5.5,
    max_length_origin: "explicit",
  })
  expect(warning.trace_length_status).toBe("indeterminate")
  expect(warning).not.toHaveProperty("actual_trace_length")
  const planeOnly = pcb_trace_length_warning.parse({
    type: "pcb_trace_length_warning",
    message: "Plane-only path indeterminate",
    source_trace_id: "t",
    pcb_component_ids: [],
    pcb_port_ids: [],
    trace_length_status: "indeterminate",
    measurement_reason: "No routed copper",
    maximum_trace_length: 5.5,
  })
  expect(planeOnly).not.toHaveProperty("pcb_trace_id")
  expect(planeOnly).not.toHaveProperty("actual_trace_length")
})

test("capacitor role and limit origin remain independent", () => {
  const cap = source_simple_capacitor.parse({
    type: "source_component",
    source_component_id: "c",
    name: "CB",
    ftype: "simple_capacitor",
    capacitance: "10uF",
    capacitor_role: "bulk",
    max_decoupling_trace_length: "5.5mm",
    max_decoupling_trace_length_origin: "configured",
  })
  expect(cap.capacitor_role).toBe("bulk")
  expect(cap.max_decoupling_trace_length).toBe(5.5)
  expect(() =>
    source_trace.parse({
      type: "source_trace",
      source_trace_id: "t",
      connected_source_port_ids: [],
      connected_source_net_ids: [],
      max_length_origin: "datasheet_verified",
    }),
  ).toThrow()
})
