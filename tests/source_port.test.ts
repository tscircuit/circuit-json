import { expect, test } from "bun:test"
import { source_port } from "../src/source/source_port"

test("source_port parses with most_frequently_referenced_by_name", () => {
  const parsed = source_port.parse({
    type: "source_port",
    name: "A",
    source_port_id: "source_port_1",
    most_frequently_referenced_by_name: "GND",
  })

  expect(parsed.most_frequently_referenced_by_name).toBe("GND")
})

test("source_port parses without most_frequently_referenced_by_name", () => {
  const parsed = source_port.parse({
    type: "source_port",
    name: "B",
    source_port_id: "source_port_2",
  })

  expect(parsed.most_frequently_referenced_by_name).toBeUndefined()
})
