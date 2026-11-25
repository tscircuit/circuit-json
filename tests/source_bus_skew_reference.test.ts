import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"

test("source bus retains reference skew and explicit branched timing endpoints", () => {
  const bus = {
    type: "source_bus" as const,
    source_bus_id: "data",
    source_trace_ids: ["dq"],
    max_length_skew: 1,
    skew_reference: "references" as const,
    length_match_source_trace_ids: ["dqs"],
    length_matching_paths: [
      { source_trace_id: "dqs", source_port_ids: ["cpu_dqs", "ram_dqs"] },
    ],
  }
  expect(any_circuit_element.parse(bus)).toEqual(bus)
})
