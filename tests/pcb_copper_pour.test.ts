import { test, expect } from "bun:test"
import { pcb_copper_pour } from "../src/pcb/pcb_copper_pour"
import { any_circuit_element } from "../src/any_circuit_element"

test("pcb_copper_pour rect parses", () => {
  const pour = pcb_copper_pour.parse({
    type: "pcb_copper_pour",
    shape: "rect",
    center: { x: 0, y: 0 },
    width: 10,
    height: 10,
    layer: "top",
    source_net_id: "net1",
  })
  expect(pour.shape).toBe("rect")
  if (pour.shape === "rect") {
    expect(pour.width).toBe(10)
  }
  expect((pour as any).pcb_copper_pour_id).toBeDefined()
  expect(any_circuit_element.parse(pour)).toBeDefined()
})

test("pcb_copper_pour circle parses", () => {
  const pour = pcb_copper_pour.parse({
    type: "pcb_copper_pour",
    shape: "circle",
    center: { x: 0, y: 0 },
    radius: 5,
    layer: "top",
    source_net_id: "net1",
  })
  expect(pour.shape).toBe("circle")
  if (pour.shape === "circle") {
    expect(pour.radius).toBe(5)
  }
  expect((pour as any).pcb_copper_pour_id).toBeDefined()
  expect(any_circuit_element.parse(pour)).toBeDefined()
})

test("pcb_copper_pour polygon parses", () => {
  const pour = pcb_copper_pour.parse({
    type: "pcb_copper_pour",
    shape: "polygon",
    points: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 5, y: 10 },
    ],
    layer: "top",
  })
  expect(pour.shape).toBe("polygon")
  if (pour.shape === "polygon") {
    expect(pour.points.length).toBe(3)
  }
  expect(pour.source_net_id).toBeUndefined()
  expect((pour as any).pcb_copper_pour_id).toBeDefined()
  expect(any_circuit_element.parse(pour)).toBeDefined()
})
