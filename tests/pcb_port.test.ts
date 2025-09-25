import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_port } from "../src/pcb/pcb_port"

test("pcb_port parses with is_board_pinout", () => {
  const port = pcb_port.parse({
    type: "pcb_port",
    source_port_id: "source_port_1",
    pcb_component_id: "pcb_component_1",
    x: 0,
    y: 0,
    layers: ["top"],
    is_board_pinout: true,
  })

  expect(port.is_board_pinout).toBe(true)
})

test("pcb_port parses without is_board_pinout", () => {
  const port = pcb_port.parse({
    type: "pcb_port",
    source_port_id: "source_port_2",
    pcb_component_id: "pcb_component_2",
    x: 1,
    y: 1,
    layers: ["bottom"],
  })

  expect(port.is_board_pinout).toBeUndefined()
})

test("any_circuit_element includes pcb_port with is_board_pinout", () => {
  const parsed = any_circuit_element.parse({
    type: "pcb_port",
    source_port_id: "source_port_3",
    pcb_component_id: "pcb_component_3",
    x: 2,
    y: 3,
    layers: ["top"],
    is_board_pinout: false,
  })

  expect(parsed.type).toBe("pcb_port")
  if (parsed.type !== "pcb_port") {
    throw new Error("expected pcb_port")
  }
  expect(parsed.is_board_pinout).toBe(false)
})
