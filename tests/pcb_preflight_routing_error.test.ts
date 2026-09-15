import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_preflight_routing_error,
  type AnyCircuitElement,
  type PcbCircuitElement,
  type PcbPreflightRoutingError,
} from "../src"

test("preflight errors support new check codes without a schema change", () => {
  for (const error_code of [
    "placement_errors",
    "fixed_obstacle_disconnect",
    "future_check",
  ]) {
    const parsed = pcb_preflight_routing_error.parse({
      type: "pcb_preflight_routing_error",
      error_code,
      message: "Routing blocked",
    })
    expect(parsed.error_code).toBe(error_code)
    expect(parsed.error_type).toBe("pcb_preflight_routing_error")
    expect(parsed.pcb_preflight_routing_error_id).toStartWith(
      "pcb_preflight_routing_error_",
    )
    expect(parsed.measurements).toBeUndefined()
    const pcb: PcbCircuitElement = parsed
    const element: AnyCircuitElement = pcb
    expect(any_circuit_element.parse(element)).toEqual(parsed)
  }
})

test("preflight errors retain phase, geometry references, and measured factors", () => {
  const error: PcbPreflightRoutingError = {
    type: "pcb_preflight_routing_error",
    pcb_preflight_routing_error_id: "pcb_preflight_routing_error_1",
    error_type: "pcb_preflight_routing_error",
    error_code: "fixed_obstacle_disconnect",
    message: "No escape for U1.3",
    subcircuit_id: "subcircuit_1",
    pcb_group_id: "pcb_group_1",
    routing_phase_index: 0,
    phase_name: "signals",
    source_trace_ids: ["source_trace_1"],
    pcb_port_ids: ["pcb_port_1"],
    pcb_component_ids: ["pcb_component_1"],
    related_error_ids: ["pcb_error_1"],
    measurements: { connection_count: 16, estimated_trace_density: 0.4 },
  }
  expect(any_circuit_element.parse(error)).toEqual(error)
})

test("preflight errors reject missing codes and malformed diagnostic fields", () => {
  const input = {
    type: "pcb_preflight_routing_error",
    error_code: "placement_errors",
    message: "Blocked",
  }
  for (const fields of [
    { error_code: undefined },
    { error_code: 1 },
    { message: undefined },
    { routing_phase_index: 0.5 },
    { measurements: { density: "high" } },
    { measurements: { density: Infinity } },
    { pcb_port_ids: [1] },
  ])
    expect(
      pcb_preflight_routing_error.safeParse({ ...input, ...fields }).success,
    ).toBe(false)
})
