import { expect, test } from "bun:test"
import { any_circuit_element, type PcbKeepoutPolygon } from "src"
import { pcb_keepout_polygon } from "src/pcb/pcb_keepout"

test("parses filled keepout polygons without changing stroked outlines", () => {
  const polygon: PcbKeepoutPolygon = {
    type: "pcb_keepout",
    shape: "polygon",
    pcb_keepout_id: "region_keepout",
    layers: ["top", "inner1", "bottom"],
    points: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 3 },
      { x: 3, y: 3 },
      { x: 3, y: 10 },
      { x: 0, y: 10 },
    ],
    description: "Concave region",
    pcb_group_id: "group_1",
    subcircuit_id: "subcircuit_1",
    excluded_pcb_component_ids: ["component_1"],
    warning_only: false,
    allow_traces: true,
    allow_placements: false,
  }
  expect(pcb_keepout_polygon.parse(polygon)).toEqual(polygon)
  expect(any_circuit_element.parse(polygon)).toEqual(polygon)
  expect(
    pcb_keepout_polygon.parse({
      ...polygon,
      points: [{ x: "1in", y: "2mm" }, ...polygon.points.slice(1)],
    }).points[0],
  ).toEqual({ x: 25.4, y: 2 })
  for (const points of [
    [],
    polygon.points.slice(0, 1),
    polygon.points.slice(0, 2),
  ]) {
    expect(any_circuit_element.safeParse({ ...polygon, points }).success).toBe(
      false,
    )
  }
  expect(
    any_circuit_element.parse({
      type: "pcb_keepout",
      shape: "outline",
      pcb_keepout_id: "open_boundary",
      layers: ["top"],
      outline: polygon.points.slice(0, 2),
      stroke_width: 0.2,
    }),
  ).toHaveProperty("shape", "outline")
})
