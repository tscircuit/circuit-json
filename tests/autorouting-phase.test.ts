import { expect, test } from "bun:test"
import {
  pcb_trace_error,
  pcb_trace_too_long_warning,
  autorouting_phase,
} from "../src"

test("DRC phase attribution survives parsing and remains optional", () => {
  const error = {
    type: "pcb_trace_error",
    message: "Trace crosses the board edge",
    pcb_trace_id: "pcb_trace_1",
    source_trace_id: "source_trace_1",
    pcb_component_ids: [],
    pcb_port_ids: [],
  }
  const phase = {
    subcircuit_id: "subcircuit_1",
    routing_phase_index: 2,
    name: "fanout",
    stage_index: 0,
  }
  expect(
    pcb_trace_error.parse({ ...error, autorouting_phase: phase })
      .autorouting_phase,
  ).toEqual(phase)
  expect(pcb_trace_error.parse(error).autorouting_phase).toBeUndefined()
  expect(
    pcb_trace_too_long_warning.parse({
      type: "pcb_trace_too_long_warning",
      message: "Too long",
      pcb_trace_id: "pcb_trace_1",
      actual_trace_length: 20,
      maximum_trace_length: 10,
      autorouting_phase: phase,
    }).autorouting_phase,
  ).toEqual(phase)
  expect(
    autorouting_phase.safeParse({ ...phase, routing_phase_index: -1 }).success,
  ).toBe(false)
  expect(
    autorouting_phase.safeParse({ ...phase, stage_index: 0.5 }).success,
  ).toBe(false)
})
