import { expect, test } from "bun:test"
import { schematic_trace, type SchematicTrace } from "src/schematic/schematic_trace"

test("schematic_trace parses with color property", () => {
  const traceData = {
    type: "schematic_trace" as const,
    schematic_trace_id: "test_sch_trace_1",
    junctions: [{ x: 0, y: 0 }],
    edges: [
      {
        from: { x: 0, y: 0 },
        to: { x: 10, y: 0 },
        color: "#ff0000"
      }
    ],
    color: "#00ff00"
  }

  const parsed = schematic_trace.parse(traceData)
  expect(parsed.color).toBe("#00ff00")
  expect(parsed.edges[0].color).toBe("#ff0000")
})

test("schematic_trace parses without color properties", () => {
  const traceData = {
    type: "schematic_trace" as const,
    schematic_trace_id: "test_sch_trace_2",
    junctions: [{ x: 0, y: 0 }],
    edges: [
      {
        from: { x: 0, y: 0 },
        to: { x: 10, y: 0 }
      }
    ]
  }

  const parsed = schematic_trace.parse(traceData)
  expect(parsed.color).toBeUndefined()
  expect(parsed.edges[0].color).toBeUndefined()
})

test("schematic_trace color properties are optional", () => {
  const traceData = {
    type: "schematic_trace" as const,
    schematic_trace_id: "test_sch_trace_3",
    junctions: [{ x: 0, y: 0 }],
    edges: [
      {
        from: { x: 0, y: 0 },
        to: { x: 10, y: 0 }
      }
    ]
  }

  // Should not throw when parsing without color
  expect(() => schematic_trace.parse(traceData)).not.toThrow()
})
