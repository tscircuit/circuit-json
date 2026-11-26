import { expect, test } from "bun:test"
import { pcb_trace_route_point_via, pcb_via } from "../src"

const via = { type: "pcb_via", x: 1, y: 2, layers: ["top", "bottom"] }
const routeVia = {
  route_type: "via",
  x: 1,
  y: 2,
  from_layer: "top",
  to_layer: "bottom",
}

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
