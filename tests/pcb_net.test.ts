import { expect, test } from "bun:test"
import { pcb_net } from "../src/pcb/pcb_net"

test("pcb_net optional fields default to undefined", () => {
  const net = pcb_net.parse({
    type: "pcb_net",
  })

  expect(net.pcb_net_id).toBeDefined()
  expect(net.pcb_net_id.startsWith("pcb_net")).toBe(true)
  expect(net.source_net_id).toBeUndefined()
  expect(net.rats_nest_color).toBeUndefined()
})

test("pcb_net optional fields can be provided", () => {
  const net = pcb_net.parse({
    type: "pcb_net",
    pcb_net_id: "pcb_net_123",
    source_net_id: "source_net_1",
    rats_nest_color: "#ffaa00",
  })

  expect(net.pcb_net_id).toBe("pcb_net_123")
  expect(net.source_net_id).toBe("source_net_1")
  expect(net.rats_nest_color).toBe("#ffaa00")
})
