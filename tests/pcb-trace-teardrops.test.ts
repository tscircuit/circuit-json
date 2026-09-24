import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_trace,
  pcb_trace_route_point_wire,
  type PcbTrace,
  type PcbTraceInput,
} from "../src"

const start = {
  route_type: "wire",
  x: 0,
  y: 0,
  width: 0.6,
  start_width: 0.6,
  end_width: 0.2,
  width_interpolation_mode: "quadratic",
  layer: "top",
} as const
const end = {
  route_type: "wire",
  x: 0.8,
  y: 0,
  width: 0.2,
  layer: "top",
} as const
const trace = {
  type: "pcb_trace",
  pcb_trace_id: "trace",
  route: [start, end],
} satisfies PcbTraceInput

test("ordinary wire routes are unchanged", () => {
  const old = {
    ...trace,
    route: [{ route_type: "wire", x: 0, y: 0, width: 0.2, layer: "top" }, end],
  } satisfies PcbTraceInput
  expect(pcb_trace.parse(old)).toEqual(old)
})
test("wire taper fields survive circuit parsing and round trips", () => {
  const parsed: PcbTrace = pcb_trace.parse(trace)
  expect(parsed).toEqual(trace)
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(parsed)))).toEqual(
    trace,
  )
})
test("both profiles accept narrowing, widening and equal widths", () => {
  for (const mode of ["linear", "quadratic"] as const) {
    for (const [a, b] of [
      [0.6, 0.2],
      [0.2, 0.6],
      [0.2, 0.2],
    ] as const) {
      const input = {
        ...trace,
        route: [
          {
            ...start,
            width: a,
            start_width: a,
            end_width: b,
            width_interpolation_mode: mode,
          },
          { ...end, width: b },
        ],
      }
      expect(pcb_trace.parse(input)).toEqual(input)
    }
  }
})
test("wire taper inputs convert units and retain annotations", () => {
  const input = {
    ...trace,
    route: [
      {
        ...start,
        x: "0mm",
        width: "600um",
        start_width: "0.6mm",
        end_width: "200um",
        start_pcb_port_id: "port1",
        end_pcb_port_id: "port2",
        copper_pour_id: "pour",
        is_inside_copper_pour: false,
      },
      { ...end, x: "800um" },
    ],
  } satisfies PcbTraceInput
  expect(pcb_trace.parse(input).route).toEqual([
    {
      ...start,
      start_pcb_port_id: "port1",
      end_pcb_port_id: "port2",
      copper_pour_id: "pour",
      is_inside_copper_pour: false,
    },
    end,
  ])
})
test("tapers can terminate at vias and through-pads", () => {
  for (const endpoint of [
    { route_type: "via", x: 0.8, y: 0, from_layer: "top", to_layer: "bottom" },
    {
      route_type: "through_pad",
      start: { x: 0.8, y: 0 },
      end: { x: 1, y: 0 },
      width: 0.2,
      start_layer: "top",
      end_layer: "bottom",
    },
  ] as const)
    expect(
      pcb_trace.parse({ ...trace, route: [start, endpoint] }).route,
    ).toEqual([start, endpoint])
})
test("taper fields must be supplied as a complete group", () => {
  for (const key of ["start_width", "end_width", "width_interpolation_mode"]) {
    expect(
      pcb_trace_route_point_wire.safeParse({ ...start, [key]: undefined })
        .success,
    ).toBe(false)
  }
  expect(
    pcb_trace_route_point_wire.safeParse({ ...start, width: 0.4 }).success,
  ).toBe(false)
})
test("invalid widths, coordinates, and modes are rejected", () => {
  for (const field of ["start_width", "end_width"]) {
    for (const value of [0, -1, NaN, Infinity, "-1mm"])
      expect(
        pcb_trace_route_point_wire.safeParse({ ...start, [field]: value })
          .success,
      ).toBe(false)
  }
  expect(
    pcb_trace.safeParse({
      ...trace,
      route: [{ ...start, width_interpolation_mode: "smoothstep" }, end],
    }).success,
  ).toBe(false)
  expect(
    pcb_trace.safeParse({ ...trace, route: [{ ...start, x: Infinity }, end] })
      .success,
  ).toBe(false)
})
test("outgoing taper needs a distinct finite endpoint on its layer", () => {
  for (const route of [
    [start],
    [start, { ...end, x: 0 }],
    [start, { ...end, x: Infinity }],
    [start, { ...end, layer: "bottom" }],
    [
      start,
      {
        route_type: "via",
        x: 0.8,
        y: 0,
        from_layer: "bottom",
        to_layer: "top",
      },
    ],
  ]) {
    expect(pcb_trace.safeParse({ ...trace, route }).success).toBe(false)
  }
})
