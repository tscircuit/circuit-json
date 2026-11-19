import { expect, test } from "bun:test"
import { simulation_current_source } from "../src/simulation/simulation_current_source"
import { source_simple_current_source } from "../src/source/source_simple_current_source"

test("current-source records retain explicit pulse timing", () => {
  const pulse = {
    current: "0.5A",
    peak_to_peak_current: "0.5A",
    wave_shape: "square",
    pulse_delay: "20ms",
    rise_time: "10us",
    fall_time: "10us",
    pulse_width: "10ms",
    period: "20ms",
  }
  expect(
    simulation_current_source.parse({
      ...pulse,
      type: "simulation_current_source",
      simulation_current_source_id: "load",
      is_dc_source: false,
    }),
  ).toMatchSnapshot()
  expect(
    source_simple_current_source.parse({
      ...pulse,
      type: "source_component",
      source_component_id: "load",
      ftype: "simple_current_source",
      name: "LOAD",
    }),
  ).toMatchSnapshot()
})
