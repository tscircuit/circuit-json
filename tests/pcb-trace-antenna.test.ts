import { expect, test } from "bun:test"
import { pcb_trace } from "../src/pcb/pcb_trace"

test("pcb_trace preserves an optional antenna marker", () => {
  const trace = { type: "pcb_trace", route: [] }
  expect(pcb_trace.parse(trace)).not.toHaveProperty("is_antenna_trace")
  expect(pcb_trace.parse({ ...trace, is_antenna_trace: true })).toHaveProperty(
    "is_antenna_trace",
    true,
  )
  expect(pcb_trace.parse({ ...trace, is_antenna_trace: false })).toHaveProperty(
    "is_antenna_trace",
    false,
  )
  expect(() =>
    pcb_trace.parse({ ...trace, is_antenna_trace: "true" }),
  ).toThrow()
})
