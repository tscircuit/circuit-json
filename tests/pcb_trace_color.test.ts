import { expect, test } from "bun:test"
import { pcb_trace, type PcbTrace } from "src/pcb/pcb_trace"

test("pcb_trace parses with color property", () => {
  const traceData = {
    type: "pcb_trace" as const,
    pcb_trace_id: "test_trace_1",
    route: [
      {
        route_type: "wire" as const,
        x: "1mm",
        y: "2mm", 
        width: "0.2mm",
        layer: "top",
        color: "#ff0000"
      }
    ],
    color: "#00ff00"
  }

  const parsed = pcb_trace.parse(traceData)
  expect(parsed.color).toBe("#00ff00")
  expect(parsed.route[0].color).toBe("#ff0000")
})

test("pcb_trace parses without color properties", () => {
  const traceData = {
    type: "pcb_trace" as const,
    pcb_trace_id: "test_trace_2",
    route: [
      {
        route_type: "wire" as const,
        x: "1mm",
        y: "2mm",
        width: "0.2mm", 
        layer: "top"
      }
    ]
  }

  const parsed = pcb_trace.parse(traceData)
  expect(parsed.color).toBeUndefined()
  expect(parsed.route[0].color).toBeUndefined()
})

test("pcb_trace color properties are optional", () => {
  const traceData = {
    type: "pcb_trace" as const,
    pcb_trace_id: "test_trace_3",
    route: [
      {
        route_type: "wire" as const,
        x: "1mm",
        y: "2mm",
        width: "0.2mm",
        layer: "top"
      }
    ]
  }

  // Should not throw when parsing without color
  expect(() => pcb_trace.parse(traceData)).not.toThrow()
})
