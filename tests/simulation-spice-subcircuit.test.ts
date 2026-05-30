import { expect, test } from "bun:test"
import { any_circuit_element } from "src/any_circuit_element"
import {
  type SimulationSpiceSubcircuit,
  type SimulationSpiceSubcircuitInput,
  simulation_spice_subcircuit,
} from "../src/simulation/simulation_spice_subcircuit"

test("simulation_spice_subcircuit parses", () => {
  const input: SimulationSpiceSubcircuitInput = {
    type: "simulation_spice_subcircuit",
    source_component_id: "source_component_1",
    model_name: "RECTIFIER_DIODE",
    spice_pin_to_source_port_map: {
      ANODE: "source_port_1",
      CATHODE: "source_port_2",
    },
    subcircuit_source: [
      ".subckt RECTIFIER_DIODE ANODE CATHODE",
      "D1 ANODE CATHODE D_MODEL",
      ".model D_MODEL D",
      ".ends RECTIFIER_DIODE",
    ].join("\n"),
  }

  const result = simulation_spice_subcircuit.parse(input)
  const spiceSubcircuit = result as SimulationSpiceSubcircuit

  expect(spiceSubcircuit.type).toBe("simulation_spice_subcircuit")
  expect(spiceSubcircuit.simulation_spice_subcircuit_id).toBeString()
  expect(spiceSubcircuit.source_component_id).toBe("source_component_1")
  expect(spiceSubcircuit.model_name).toBe("RECTIFIER_DIODE")
  expect(spiceSubcircuit.spice_pin_to_source_port_map).toEqual({
    ANODE: "source_port_1",
    CATHODE: "source_port_2",
  })
  expect(spiceSubcircuit.subcircuit_source).toContain(
    ".subckt RECTIFIER_DIODE ANODE CATHODE",
  )
})

test("any_circuit_element includes simulation_spice_subcircuit", () => {
  const input: SimulationSpiceSubcircuitInput = {
    type: "simulation_spice_subcircuit",
    source_component_id: "source_component_1",
    model_name: "RECTIFIER_DIODE",
    spice_pin_to_source_port_map: {
      ANODE: "source_port_1",
      CATHODE: "source_port_2",
    },
    subcircuit_source: ".subckt RECTIFIER_DIODE ANODE CATHODE\n.ends",
  }

  expect(() => any_circuit_element.parse(input)).not.toThrow()
  const parsed = any_circuit_element.parse(input)
  expect(parsed.type).toBe("simulation_spice_subcircuit")
})
