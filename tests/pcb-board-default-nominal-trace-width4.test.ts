import { expect, test } from "bun:test"
import { pcb_board } from "../src/pcb/pcb_board"

test("board default nominal trace width rejects non-length values", () => {
  expect(
    pcb_board.safeParse({
      type: "pcb_board",
      center: { x: 0, y: 0 },
      default_nominal_trace_width: true,
    }).success,
  ).toBe(false)
})
