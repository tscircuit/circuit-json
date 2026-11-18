import { expect, test } from "bun:test"
import {
  any_circuit_element,
  any_source_component,
  simulation_dc_operating_point_voltage,
  simulation_parameter_sweep,
  simulation_switch,
  source_simple_rotary_switch,
} from "../src"

test("parses source_simple_rotary_switch with default and explicit pole/position counts", () => {
  const fourByThree = source_simple_rotary_switch.parse({
    type: "source_component",
    source_component_id: "source_component_0",
    ftype: "simple_rotary_switch",
    name: "SW1",
    poles: 4,
    positions: 3,
    manufacturer_part_number: "SR2611F-0403",
  })

  expect(fourByThree.poles).toBe(4)
  expect(fourByThree.positions).toBe(3)
  expect(any_source_component.parse(fourByThree).type).toBe("source_component")
  expect(any_circuit_element.parse(fourByThree).type).toBe("source_component")

  const singlePole = source_simple_rotary_switch.parse({
    type: "source_component",
    source_component_id: "source_component_1",
    ftype: "simple_rotary_switch",
    name: "SW2",
    positions: 12,
  })
  expect(singlePole.poles).toBe(1)
  expect(singlePole.positions).toBe(12)
})

test("rejects invalid rotary switch pole or position counts", () => {
  expect(() =>
    source_simple_rotary_switch.parse({
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_rotary_switch",
      name: "SW1",
      poles: 0,
      positions: 3,
    }),
  ).toThrow()

  expect(() =>
    source_simple_rotary_switch.parse({
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_rotary_switch",
      name: "SW1",
      poles: 2,
      positions: 1,
    }),
  ).toThrow()

  expect(() =>
    source_simple_rotary_switch.parse({
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_rotary_switch",
      name: "SW1",
      poles: 1.5,
      positions: 3,
    }),
  ).toThrow()
})

test("parses simulation_switch selected_position and position parameter sweeps", () => {
  const simSwitch = simulation_switch.parse({
    type: "simulation_switch",
    source_component_id: "source_component_0",
    selected_position: 2,
  })
  expect(simSwitch.selected_position).toBe(2)

  expect(() =>
    simulation_switch.parse({
      type: "simulation_switch",
      source_component_id: "source_component_0",
      selected_position: 0,
    }),
  ).toThrow()

  const positionSweep = simulation_parameter_sweep.parse({
    type: "simulation_parameter_sweep",
    simulation_experiment_id: "simulation_experiment_0",
    parameter_type: "position",
    switch_source_component_id: "source_component_0",
    parameter_values: [1, 2, 3],
    parameter_unit: "",
  })
  expect(any_circuit_element.parse(positionSweep).type).toBe(
    "simulation_parameter_sweep",
  )

  const operatingPoint = simulation_dc_operating_point_voltage.parse({
    type: "simulation_dc_operating_point_voltage",
    simulation_experiment_id: "simulation_experiment_0",
    simulation_voltage_probe_id: "simulation_voltage_probe_0",
    voltage: 2.5,
    simulation_parameter_sweep_coordinate: {
      simulation_parameter_sweep_id:
        positionSweep.simulation_parameter_sweep_id,
      sweep_index: 1,
      parameter_value: 2,
      parameter_unit: "",
    },
  })
  expect(
    operatingPoint.simulation_parameter_sweep_coordinate?.parameter_value,
  ).toBe(2)
  expect(
    operatingPoint.simulation_parameter_sweep_coordinate?.parameter_unit,
  ).toBe("")

  expect(() =>
    simulation_parameter_sweep.parse({
      type: "simulation_parameter_sweep",
      simulation_experiment_id: "simulation_experiment_0",
      parameter_type: "position",
      switch_source_component_id: "source_component_0",
      parameter_values: [0, 1],
      parameter_unit: "",
    }),
  ).toThrow()

  expect(() =>
    simulation_parameter_sweep.parse({
      type: "simulation_parameter_sweep",
      simulation_experiment_id: "simulation_experiment_0",
      parameter_type: "position",
      switch_source_component_id: "source_component_0",
      parameter_values: [1.5],
      parameter_unit: "",
    }),
  ).toThrow()
})
