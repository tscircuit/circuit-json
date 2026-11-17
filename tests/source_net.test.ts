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

test("source_net preserves optional PCB trace clearance in millimeters", () => {
  const net = source_net.parse({
    type: "source_net",
    source_net_id: "net1",
    name: "USB_DP",
    member_source_group_ids: [],
  })

  expect(net.pcb_min_trace_clearance).toBeUndefined()

  const withClearance = source_net.parse({
    ...net,
    pcb_min_trace_clearance: 0.254,
  })
  const reloaded = source_net.parse(JSON.parse(JSON.stringify(withClearance)))
  expect(reloaded.pcb_min_trace_clearance).toBe(0.254)

  const clearance = source_net.shape.pcb_min_trace_clearance
  expect(clearance.parse(0)).toBe(0)
  for (const invalid of [-0.1, Infinity, NaN, "0.254mm", null]) {
    expect(clearance.safeParse(invalid).success).toBe(false)
  }
})
