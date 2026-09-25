import { expect, test } from "bun:test"
import { pcb_board } from "../src/pcb/pcb_board"

test("pcb_board preserves optional trace-to-hole edge clearance in mm", () => {
  const base = { type: "pcb_board", center: { x: 0, y: 0 } }
  for (const [input, expected] of [
    [0.2, 0.2],
    ["0.2mm", 0.2],
    ["0.01in", 0.254],
    [0, 0],
  ] as const) {
    const board = pcb_board.parse({
      ...base,
      min_trace_to_hole_edge_clearance: input,
    })
    expect(board.min_trace_to_hole_edge_clearance).toBeCloseTo(expected)
    const restored = pcb_board.parse(JSON.parse(JSON.stringify(board)))
    expect(restored.min_trace_to_hole_edge_clearance).toBeCloseTo(expected)
  }
  expect(pcb_board.parse(base)).not.toHaveProperty(
    "min_trace_to_hole_edge_clearance",
  )
})
