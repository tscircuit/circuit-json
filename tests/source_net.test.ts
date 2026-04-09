import { test, expect } from "bun:test"
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

test("source_net.routing_phase_index accepts a number", () => {
  const net = source_net.parse({
    type: "source_net",
    source_net_id: "net1",
    name: "VCC",
    member_source_group_ids: [],
    routing_phase_index: 2,
  })

  expect(net.routing_phase_index).toBe(2)
})

test("source_net.routing_phase_index accepts null", () => {
  const net = source_net.parse({
    type: "source_net",
    source_net_id: "net1",
    name: "VCC",
    member_source_group_ids: [],
    routing_phase_index: null,
  })

  expect(net.routing_phase_index).toBeNull()
})
