import { expect, test } from "bun:test"
import { source_net } from "../src/source/source_net"

test("source_net.is_positive_voltage_source defaults to undefined", () => {
  const net = source_net.parse({
    type: "source_net",
    source_net_id: "net1",
    name: "VCC",
    member_source_group_ids: [],
  })
  expect(net.is_positive_voltage_source).toBeUndefined()
})

test("source_net.is_positive_voltage_source can be true", () => {
  const net = source_net.parse({
    type: "source_net",
    source_net_id: "net1",
    name: "VCC",
    member_source_group_ids: [],
    is_positive_voltage_source: true,
  })
  expect(net.is_positive_voltage_source).toBe(true)
})
