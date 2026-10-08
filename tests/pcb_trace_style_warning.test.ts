import { expect, test } from "bun:test"
import { pcb_trace_style_warning, any_circuit_element } from "../src"

// Measurements from the published PD power supply's original bottom-layer route.
const input = {
  type: "pcb_trace_style_warning" as const,
  message: "The supply trace has a long segment at an odd angle",
  styling_issue_type: "long_segment_at_odd_angle" as const,
  pcb_trace_id: "pcb_trace_3",
  source_trace_id: "source_trace_3",
  layer: "bottom" as const,
  circuit_json_index: 3131,
  start_route_index: 4,
  end_route_index: 5,
  start: { x: 5, y: 20.5 },
  end: { x: 17, y: 18 },
  center: { x: 11, y: 19.25 },
  bounds: { min_x: 3.8, min_y: 16.8, max_x: 18.2, max_y: 21.7 },
  segment_length: 12.257650672131263,
  minimum_segment_length: 5,
  angle_degrees: 348.23171106797935,
  nearest_allowed_angle_degrees: 0,
  angle_deviation_degrees: 11.768288932020653,
  angle_tolerance_degrees: 4,
}

test("PCB trace style warnings retain segment locations and default their IDs and warning type", () => {
  const warning = pcb_trace_style_warning.parse(input)
  expect(warning.pcb_trace_style_warning_id).toStartWith(
    "pcb_trace_style_warning",
  )
  expect(warning.warning_type).toBe("pcb_trace_style_warning")
  expect(warning.start).toEqual(input.start)
  expect(warning.bounds).toEqual(input.bounds)
  expect(warning.start_route_index).toBe(4)
  expect(warning.angle_deviation_degrees).toBe(input.angle_deviation_degrees)
  expect(any_circuit_element.parse(warning)).toEqual(warning)
})

test("PCB trace style warnings parse lengths and positions with units", () => {
  const warning = pcb_trace_style_warning.parse({
    ...input,
    segment_length: "12.257650672131263mm",
    minimum_segment_length: "5mm",
    start: { x: "5mm", y: "20.5mm" },
  })
  expect(warning.segment_length).toBe(input.segment_length)
  expect(warning.minimum_segment_length).toBe(5)
  expect(warning.start).toEqual(input.start)
})

test("PCB trace style warnings reject invalid indices, directions, and angle tolerances", () => {
  for (const invalid of [
    { start_route_index: -1 },
    { end_route_index: 1.5 },
    { angle_degrees: 360 },
    { nearest_allowed_angle_degrees: 30 },
    { angle_tolerance_degrees: 22.5 },
  ])
    expect(
      pcb_trace_style_warning.safeParse({ ...input, ...invalid }).success,
    ).toBe(false)
})
