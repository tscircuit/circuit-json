import { expect, test } from "bun:test"
import { any_circuit_element, source_net } from "../src"

const net = {
  type: "source_net" as const,
  source_net_id: "power",
  name: "VCC",
  member_source_group_ids: [],
  source_net_class_ids: ["power_class", "default_class"],
}

test("snapshot the parsed net class assignments", () => {
  expect(source_net.parse(net)).toMatchSnapshot()
})

test("named net classes and ordered assignments survive JSON parsing", () => {
  const netClass = {
    type: "source_net_class",
    source_net_class_id: "power_class",
    name: "Power",
    trace_width: 0.8,
    priority: 1,
    subcircuit_id: "board",
  }
  expect<unknown>(any_circuit_element.parse(netClass)).toEqual(netClass)
  expect(source_net.parse(JSON.parse(JSON.stringify(net)))).toEqual(net)
})

test("classes reject invalid widths and priorities without adding defaults", () => {
  const netClass = {
    type: "source_net_class",
    source_net_class_id: "inherited",
    name: "Inherited",
  }
  expect<unknown>(any_circuit_element.parse(netClass)).toEqual(netClass)
  for (const trace_width of [0, -1, Infinity, NaN]) {
    expect(
      any_circuit_element.safeParse({ ...netClass, trace_width }).success,
    ).toBe(false)
  }
  expect(
    any_circuit_element.safeParse({ ...netClass, priority: -1 }).success,
  ).toBe(false)
})
