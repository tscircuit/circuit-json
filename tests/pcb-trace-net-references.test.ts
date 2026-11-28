import { expect, test } from "bun:test"
import { any_circuit_element, type PcbTraceInput } from "../src"

const baseTrace = {
  type: "pcb_trace",
  pcb_trace_id: "pcb_trace_1",
  route: [],
} satisfies PcbTraceInput

test("pcb_trace preserves physical net references through a JSON round trip", () => {
  const netReferences = {
    source_net_id: "source_net_1",
    subcircuit_connectivity_map_key: "subcircuit_1_gnd",
  }
  const trace = any_circuit_element.parse({ ...baseTrace, ...netReferences })
  const roundTrippedTrace = any_circuit_element.parse(
    JSON.parse(JSON.stringify(trace)),
  )

  expect(roundTrippedTrace).toMatchObject(netReferences)
})

test("pcb_trace leaves omitted physical net references absent", () => {
  const trace = any_circuit_element.parse(baseTrace)

  expect(trace).not.toHaveProperty("source_net_id")
  expect(trace).not.toHaveProperty("subcircuit_connectivity_map_key")
})

test("pcb_trace rejects an empty source net id", () => {
  expect(
    any_circuit_element.safeParse({ ...baseTrace, source_net_id: "" }).success,
  ).toBe(false)
})
