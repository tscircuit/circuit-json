import { expect, test } from "bun:test"
import { source_port_internal_connection } from "src/source/source_port_internal_connection"

test("source_port_internal_connection parses source port ids", () => {
  const parsed = source_port_internal_connection.parse({
    type: "source_port_internal_connection",
    source_port_internal_connection_id: "conn-1",
    source_port_ids: ["p1", "p2"],
  })

  expect(parsed.source_port_ids).toEqual(["p1", "p2"])
})
