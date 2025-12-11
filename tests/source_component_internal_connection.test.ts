import { expect, test } from "bun:test"
import { source_component_internal_connection } from "src/source/source_component_internal_connection"

test("source_component_internal_connection parses source port ids", () => {
  const parsed = source_component_internal_connection.parse({
    type: "source_component_internal_connection",
    source_component_internal_connection_id: "conn-1",
    source_component_id: "comp-1",
    source_port_ids: ["p1", "p2"],
    subcircuit_id: "sub-1",
  })

  expect(parsed.source_port_ids).toEqual(["p1", "p2"])
  expect(parsed.subcircuit_id).toEqual("sub-1")
})
