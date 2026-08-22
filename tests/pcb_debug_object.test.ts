import { expect, test } from "bun:test"
import { any_circuit_element } from "src/any_circuit_element"
import {
  pcb_debug_line,
  pcb_debug_object,
  pcb_debug_point,
  pcb_debug_rect,
} from "src/pcb/pcb_debug_object"

test("parses a PCB debug rectangle", () => {
  const rect = pcb_debug_rect.parse({
    type: "pcb_debug_object",
    shape: "rect",
    center: { x: 1, y: 2 },
    size: { width: 3, height: 4 },
    label: "component bounds",
    subcircuit_id: "subcircuit_1",
  })

  expect(rect.pcb_debug_object_id).toStartWith("pcb_debug_object")
  expect(rect.center).toEqual({ x: 1, y: 2 })
  expect(rect.size).toEqual({ width: 3, height: 4 })
  expect(rect.label).toBe("component bounds")
  expect(rect.subcircuit_id).toBe("subcircuit_1")
})

test("parses a PCB debug line", () => {
  const line = pcb_debug_line.parse({
    type: "pcb_debug_object",
    shape: "line",
    start: { x: 1, y: 2 },
    end: { x: 3, y: 4 },
  })

  expect(line.start).toEqual({ x: 1, y: 2 })
  expect(line.end).toEqual({ x: 3, y: 4 })
})

test("parses a PCB debug point", () => {
  const point = pcb_debug_point.parse({
    type: "pcb_debug_object",
    shape: "point",
    center: { x: 1, y: 2 },
  })

  expect(point.center).toEqual({ x: 1, y: 2 })
})

test("pcb_debug_object rejects unsupported shapes", () => {
  const result = pcb_debug_object.safeParse({
    type: "pcb_debug_object",
    shape: "circle",
    center: { x: 1, y: 2 },
  })

  expect(result.success).toBe(false)
})

test("any_circuit_element includes pcb_debug_object", () => {
  const parsed = any_circuit_element.parse({
    type: "pcb_debug_object",
    shape: "point",
    center: { x: 1, y: 2 },
  })

  expect(parsed.type).toBe("pcb_debug_object")
})
