import { expect, test } from "bun:test"
import curves from "../docs/proposals/system-block-curved-routes.json"
import example from "../docs/system-block-example.json"
import {
  any_circuit_element,
  system_block_connection,
  system_block_route_point,
  type CircuitJson,
  type Point,
  type SystemBlockRoutePoint,
  type SystemBlockRoutePointInput,
} from "../src"

const connection = system_block_connection.parse(example[6])
const origin = { x: 0, y: 0 }
const control = { x: 5, y: 10 }

function expectInvalidRoute(route: unknown) {
  const record = { ...connection, route }
  expect(system_block_connection.safeParse(record).success).toBe(false)
  expect(any_circuit_element.safeParse(record).success).toBe(false)
}

test("straight and mixed circular-corner routes survive public JSON round trips", () => {
  const corner: SystemBlockRoutePointInput = {
    x: 18,
    y: 6,
    cubic_bezier_control_points: [
      { x: 15.313708, y: 0 },
      { x: 18, y: 2.686292 },
    ],
  }
  const endpoint: SystemBlockRoutePoint = system_block_route_point.parse(corner)
  const point: Point = endpoint
  expect(point).toEqual(corner)
  const records = [
    connection,
    {
      ...connection,
      route: [origin, { x: 12, y: 0 }, endpoint, { x: 18, y: 24 }],
    },
    ...curves,
  ]
  const circuit: CircuitJson = records.map((record) =>
    any_circuit_element.parse(record),
  )
  expect<unknown>(circuit).toEqual(records)
  expect(
    JSON.parse(JSON.stringify(circuit)).map((record: unknown) =>
      any_circuit_element.parse(record),
    ),
  ).toEqual(records)
})

test("controls must be exactly two finite points", () => {
  const invalidControls: unknown[] = [
    null,
    [],
    [control],
    [control, control, control],
    { 0: control, 1: control },
  ]
  for (const index of [0, 1]) {
    for (const invalidPoint of [null, {}, [0, 0], { x: 0 }, { y: 0 }]) {
      const controls: unknown[] = [control, control]
      controls[index] = invalidPoint
      invalidControls.push(controls)
    }
    for (const axis of ["x", "y"]) {
      for (const value of [Infinity, -Infinity, NaN, "1mm", null, undefined]) {
        const controls: unknown[] = [control, control]
        controls[index] = { ...control, [axis]: value }
        invalidControls.push(controls)
      }
    }
  }
  for (const cubic_bezier_control_points of invalidControls) {
    const endpoint = { x: 10, y: 0, cubic_bezier_control_points }
    expect(system_block_route_point.safeParse(endpoint).success).toBe(false)
    expectInvalidRoute([origin, endpoint])
  }
})

test("controls on the first endpoint fail with a useful issue path", () => {
  const route = [
    { ...origin, cubic_bezier_control_points: [control, control] },
    control,
  ]
  expectInvalidRoute(route)
  const result = system_block_connection.safeParse({ ...connection, route })
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues[0]?.path).toEqual([
      "route",
      0,
      "cubic_bezier_control_points",
    ])
  }
})

test("closed cubic loops need at least one control distinct from their endpoint", () => {
  for (const controls of [
    [origin, control],
    [control, origin],
    [control, control],
  ]) {
    const record = {
      ...connection,
      to_system_block_component_id: connection.from_system_block_component_id,
      route: [origin, { ...origin, cubic_bezier_control_points: controls }],
    }
    expect<unknown>(system_block_connection.parse(record)).toEqual(record)
    expect<unknown>(any_circuit_element.parse(record)).toEqual(record)
  }
  for (const route of [
    [],
    [origin],
    [origin, origin],
    [origin, { ...origin, cubic_bezier_control_points: [origin, origin] }],
    [control, origin, origin],
    [
      control,
      origin,
      { ...origin, cubic_bezier_control_points: [origin, origin] },
    ],
  ]) {
    expectInvalidRoute(route)
  }
})

test("distinct endpoints may have handles coincident with either endpoint", () => {
  for (const controls of [
    [origin, origin],
    [origin, control],
    [control, origin],
    [control, control],
  ]) {
    const record = {
      ...connection,
      route: [origin, { ...control, cubic_bezier_control_points: controls }],
    }
    expect<unknown>(system_block_connection.parse(record)).toEqual(record)
  }
})
