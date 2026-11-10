import { expect, test } from "bun:test"
import { pcb_trace, pcb_trace_route_point_via, pcb_via } from "../src"

const via = { type: "pcb_via", x: 1, y: 2, layers: ["top", "bottom"] }
const routeVia = {
  route_type: "via",
  x: 1,
  y: 2,
  from_layer: "top",
  to_layer: "bottom",
}

test("preserves physical via ownership independently of trace ownership", () => {
  for (const owner of ["pcb_component_via", null, undefined]) {
    const fields = owner === undefined ? {} : { pcb_component_id: owner }
    const entity = pcb_via.parse({ ...via, ...fields })
    const trace = pcb_trace.parse({
      type: "pcb_trace",
      pcb_component_id: "pcb_component_trace",
      route: [{ ...routeVia, ...fields }],
    })
    const point = trace.route[0]
    if (point?.route_type !== "via")
      throw new Error("Expected a via route point")
    expect(entity).toMatchObject(fields)
    expect(point).toMatchObject(fields)
    expect(Object.hasOwn(entity, "pcb_component_id")).toBe(owner !== undefined)
    expect(Object.hasOwn(point, "pcb_component_id")).toBe(owner !== undefined)
    expect(trace.pcb_component_id).toBe("pcb_component_trace")
  }
})

test("rejects empty physical via owner IDs", () => {
  expect(pcb_via.safeParse({ ...via, pcb_component_id: "" }).success).toBe(
    false,
  )
  expect(
    pcb_trace_route_point_via.safeParse({
      ...routeVia,
      pcb_component_id: "",
    }).success,
  ).toBe(false)
})
