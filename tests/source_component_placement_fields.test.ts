import { test, expect } from "bun:test"
import { source_component_base } from "src/source/base/source_component_base"
import { source_simple_capacitor } from "src/source/source_simple_capacitor"

test("source_component_base accepts placement fields", () => {
  const data = {
    type: "source_component",
    source_component_id: "source_component_1",
    name: "C1",
    place_near_selector: "U1.VCC",
    place_near_port_id: "source_port_5",
    facing_pad_port_id: "source_port_10",
    place_near_max_distance: 0.005,
  }

  const parsed = source_component_base.parse(data)

  expect(parsed.place_near_selector).toBe("U1.VCC")
  expect(parsed.place_near_port_id).toBe("source_port_5")
  expect(parsed.facing_pad_port_id).toBe("source_port_10")
  expect(parsed.place_near_max_distance).toBeCloseTo(0.005)
})

test("source_simple_capacitor inherits placement fields", () => {
  const data = {
    type: "source_component",
    ftype: "simple_capacitor",
    source_component_id: "source_component_1",
    name: "C1",
    capacitance: "100nF",
    place_near_selector: "U1.VCC",
    facing_pad_port_id: "source_port_10",
    place_near_max_distance: 0.002,
    max_decoupling_trace_length: "5mm",
  }

  const parsed = source_simple_capacitor.parse(data)

  expect(parsed.place_near_selector).toBe("U1.VCC")
  expect(parsed.facing_pad_port_id).toBe("source_port_10")
  expect(parsed.place_near_max_distance).toBeCloseTo(0.002)
  expect(parsed.max_decoupling_trace_length).toBeCloseTo(0.005)
})

test("placement fields are optional on source_component_base", () => {
  const data = {
    type: "source_component",
    source_component_id: "source_component_1",
    name: "R1",
  }

  const parsed = source_component_base.parse(data)

  expect(parsed.place_near_selector).toBeUndefined()
  expect(parsed.place_near_port_id).toBeUndefined()
  expect(parsed.facing_pad_port_id).toBeUndefined()
  expect(parsed.place_near_max_distance).toBeUndefined()
})
