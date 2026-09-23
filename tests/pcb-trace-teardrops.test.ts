import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_trace,
  pcb_trace_teardrop,
  type PcbTrace,
  type PcbTraceInput,
  type PcbTraceTeardrop,
} from "../src"

const route = [
  { route_type: "wire", x: 0, y: 0, width: 0.2, layer: "top" },
  { route_type: "wire", x: 4, y: 0, width: 0.2, layer: "top" },
] satisfies PcbTraceInput["route"]
const trace = { type: "pcb_trace", pcb_trace_id: "pcb_trace_1", route } as const
const taper = {
  route_segment_index: 0,
  end: "start",
  shape: "curved",
  length: 0.8,
  width: 0.6,
} satisfies PcbTraceTeardrop

test("old traces retain their route and do not gain implicit teardrops", () => {
  expect(pcb_trace.parse(trace)).toEqual(trace)
  expect(any_circuit_element.parse(trace)).toEqual(trace)
  expect(pcb_trace.parse({ ...trace, teardrops: [] }).teardrops).toEqual([])
})

test("both segment ends survive general circuit parsing and JSON round trips", () => {
  const input = {
    ...trace,
    teardrops: [
      taper,
      {
        ...taper,
        end: "end",
        shape: "linear",
        length: "500um",
        width: "0.5mm",
      },
    ],
  } satisfies PcbTraceInput
  const parsed = pcb_trace.parse(input)
  expect(parsed.teardrops).toEqual([
    taper,
    { ...taper, end: "end", shape: "linear", length: 0.5, width: 0.5 },
  ])
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(parsed)))).toEqual(
    parsed,
  )
  const typed: PcbTrace = parsed
  expect(typed.route).toEqual(route)
})

test("teardrops on both layers of an internal via do not introduce a route type", () => {
  const input = {
    ...trace,
    route: [
      ...route,
      { route_type: "via", x: 4, y: 0, from_layer: "top", to_layer: "bottom" },
      { route_type: "wire", x: 4, y: 0, width: 0.2, layer: "bottom" },
      { route_type: "wire", x: 8, y: 0, width: 0.2, layer: "bottom" },
    ],
    teardrops: [
      { ...taper, end: "end" },
      { ...taper, route_segment_index: 3 },
    ],
  } satisfies PcbTraceInput
  expect(any_circuit_element.parse(input)).toEqual(input)
})

test("resolved polygon copper preserves board coordinates and winding", () => {
  const outline = [
    { x: 0, y: -0.3 },
    { x: 0.8, y: -0.1 },
    { x: 0.8, y: 0.1 },
    { x: 0, y: 0.3 },
  ]
  for (const vertices of [outline, [...outline].reverse()]) {
    const polygon = {
      route_segment_index: 0,
      end: "start",
      shape: "polygon",
      outline: vertices,
    } satisfies PcbTraceTeardrop
    expect(pcb_trace_teardrop.parse(polygon)).toEqual(polygon)
    expect(
      pcb_trace.parse({ ...trace, teardrops: [polygon] }).teardrops,
    ).toEqual([polygon])
  }
})

test("invalid dimensions and attachments are rejected, not silently defaulted", () => {
  for (const key of ["length", "width"] as const) {
    for (const value of [0, -1, NaN, Infinity, -Infinity, "-1mm", undefined]) {
      expect(
        pcb_trace_teardrop.safeParse({ ...taper, [key]: value }).success,
      ).toBe(false)
    }
  }
  for (const route_segment_index of [-1, 0.5, Infinity, NaN]) {
    expect(
      pcb_trace_teardrop.safeParse({ ...taper, route_segment_index }).success,
    ).toBe(false)
  }
  expect(
    pcb_trace_teardrop.safeParse({ ...taper, end: "either" }).success,
  ).toBe(false)
  expect(
    pcb_trace_teardrop.safeParse({ ...taper, shape: "automatic" }).success,
  ).toBe(false)
  expect(
    pcb_trace.safeParse({ ...trace, teardrops: [{ ...taper, width: 0 }] })
      .success,
  ).toBe(false)
})

test("polygon geometry rejects missing area, nonfinite coordinates, and mixed representations", () => {
  const polygon = { route_segment_index: 0, end: "start", shape: "polygon" }
  for (const outline of [
    [],
    [{ x: 0, y: 0 }],
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
    [
      { x: 0, y: 0 },
      { x: Infinity, y: 0 },
      { x: 0, y: 1 },
    ],
  ]) {
    expect(pcb_trace_teardrop.safeParse({ ...polygon, outline }).success).toBe(
      false,
    )
  }
  const outline = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ]
  expect(
    pcb_trace_teardrop.safeParse({ ...polygon, outline, length: 1 }).success,
  ).toBe(false)
  expect(pcb_trace_teardrop.safeParse({ ...taper, outline }).success).toBe(
    false,
  )
})
