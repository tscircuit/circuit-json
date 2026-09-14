import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_trace, type PcbTraceInput } from "../src/pcb/pcb_trace"

test("trace route vias preserve explicit and omitted tenting without a board", () => {
  const input = {
    type: "pcb_trace",
    pcb_trace_id: "pcb_trace_1",
    route: [
      {
        route_type: "via",
        x: 0,
        y: 0,
        from_layer: "top",
        to_layer: "bottom",
        tented_on_top: false,
        tented_on_bottom: true,
      },
      {
        route_type: "via",
        x: 1,
        y: 0,
        from_layer: "bottom",
        to_layer: "top",
        tented_on_top: true,
      },
      {
        route_type: "via",
        x: 2,
        y: 0,
        from_layer: "top",
        to_layer: "bottom",
      },
    ],
  } satisfies PcbTraceInput

  const trace = pcb_trace.parse(input)
  expect(trace.route).toEqual(input.route)
  expect(any_circuit_element.parse(input)).toEqual(trace)
  expect(trace.route[1]).not.toHaveProperty("tented_on_bottom")
  expect(trace.route[2]).not.toHaveProperty("tented_on_top")
  expect(trace.route[2]).not.toHaveProperty("tented_on_bottom")
})
