import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_trace,
  pcb_trace_route_point_teardrop,
  type PcbTrace,
  type PcbTraceInput,
  type PcbTraceRoutePointTeardrop,
} from "../src"

const route = [
  { route_type: "wire", x: 0, y: 0, width: 0.2, layer: "top" },
  { route_type: "wire", x: 4, y: 0, width: 0.2, layer: "top" },
] satisfies PcbTraceInput["route"]
const trace = { type: "pcb_trace", pcb_trace_id: "pcb_trace_1", route } as const
const taper = {
  route_type: "teardrop",
  start: { x: 0, y: 0 },
  end: { x: 0.8, y: 0 },
  start_width: 0.6,
  end_width: 0.2,
  width_interpolation_mode: "quadratic",
  layer: "top",
} satisfies PcbTraceRoutePointTeardrop

test("existing wire routes remain unchanged", () => {
  expect(pcb_trace.parse(trace)).toEqual(trace)
  expect(any_circuit_element.parse(trace)).toEqual(trace)
})

test("teardrop segments survive general circuit parsing and JSON round trips", () => {
  const input = { ...trace, route: [taper] } satisfies PcbTraceInput
  const parsed: PcbTrace = pcb_trace.parse(input)
  expect(parsed).toEqual(input)
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(parsed)))).toEqual(
    input,
  )
})

test("all profiles accept widening, narrowing and constant widths", () => {
  for (const width_interpolation_mode of ["linear", "quadratic"] as const) {
    for (const [start_width, end_width] of [
      [0.2, 0.6],
      [0.6, 0.2],
      [0.2, 0.2],
    ] as const) {
      const segment = {
        ...taper,
        width_interpolation_mode,
        start_width,
        end_width,
      }
      expect(pcb_trace_route_point_teardrop.parse(segment)).toEqual(segment)
    }
  }
})

test("coordinates and full widths accept distance strings", () => {
  const input = {
    ...trace,
    route: [
      {
        ...taper,
        start: { x: "1mm", y: "500um" },
        end: { x: "2mm", y: "500um" },
        start_width: "500um",
        end_width: "0.2mm",
      },
    ],
  } satisfies PcbTraceInput
  expect(pcb_trace.parse(input).route).toEqual([
    {
      ...taper,
      start: { x: 1, y: 0.5 },
      end: { x: 2, y: 0.5 },
      start_width: 0.5,
      end_width: 0.2,
    },
  ])
})

test("mixed routes preserve explicit segments across a via and through-pad transition", () => {
  const input = {
    ...trace,
    route_thickness_mode: "constant",
    route: [
      taper,
      { ...route[0]!, x: 0.8 },
      route[1]!,
      { route_type: "via", x: 4, y: 0, from_layer: "top", to_layer: "bottom" },
      {
        ...taper,
        start: { x: 4, y: 0 },
        end: { x: 4.8, y: 0 },
        layer: "bottom",
      },
      { route_type: "wire", x: 4.8, y: 0, width: 0.2, layer: "bottom" },
      { route_type: "wire", x: 6, y: 0, width: 0.2, layer: "bottom" },
      {
        route_type: "through_pad",
        start: { x: 6, y: 0 },
        end: { x: 6, y: 0 },
        width: 0.2,
        start_layer: "bottom",
        end_layer: "top",
        pcb_plated_hole_id: "pcb_plated_hole_1",
      },
    ],
  } satisfies PcbTraceInput
  expect(any_circuit_element.parse(input)).toEqual(input)
})

test("wire-style annotations and endpoint references are retained", () => {
  const annotated = {
    ...taper,
    start_pcb_port_id: "pcb_port_1",
    end_pcb_port_id: "pcb_port_2",
    copper_pour_id: "pcb_copper_pour_1",
    is_inside_copper_pour: false,
  }
  expect(pcb_trace_route_point_teardrop.parse(annotated)).toEqual(annotated)
})

test("invalid or missing widths and profiles are rejected", () => {
  for (const key of ["start_width", "end_width"] as const) {
    for (const value of [0, -1, NaN, Infinity, -Infinity, "-1mm", undefined]) {
      expect(
        pcb_trace_route_point_teardrop.safeParse({ ...taper, [key]: value })
          .success,
      ).toBe(false)
    }
  }
  for (const width_interpolation_mode of [
    undefined,
    "curved",
    "constant",
    "interpolated",
  ]) {
    expect(
      pcb_trace_route_point_teardrop.safeParse({
        ...taper,
        width_interpolation_mode,
      }).success,
    ).toBe(false)
  }
  expect(
    pcb_trace.safeParse({ ...trace, route: [{ ...taper, start_width: 0 }] })
      .success,
  ).toBe(false)
})

test("endpoints must describe a finite nonzero length", () => {
  for (const key of ["start", "end"] as const) {
    for (const axis of ["x", "y"] as const) {
      for (const value of [NaN, Infinity, -Infinity, undefined]) {
        expect(
          pcb_trace_route_point_teardrop.safeParse({
            ...taper,
            [key]: { ...taper[key], [axis]: value },
          }).success,
        ).toBe(false)
      }
    }
  }
  expect(
    pcb_trace_route_point_teardrop.safeParse({ ...taper, end: taper.start })
      .success,
  ).toBe(false)
  expect(
    pcb_trace_route_point_teardrop.safeParse({
      ...taper,
      start: { x: -Number.MAX_VALUE, y: 0 },
      end: { x: Number.MAX_VALUE, y: 0 },
    }).success,
  ).toBe(false)
})

test("removed smoothstep mode is rejected by trace and circuit schemas", () => {
  const input = {
    ...trace,
    route: [{ ...taper, width_interpolation_mode: "smoothstep" }],
  }
  expect(pcb_trace.safeParse(input).success).toBe(false)
  expect(any_circuit_element.safeParse(input).success).toBe(false)
})
