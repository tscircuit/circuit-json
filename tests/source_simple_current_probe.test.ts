import { test, expect } from "bun:test"
import { source_simple_current_probe } from "src/source/source_simple_current_probe"
import { schematic_current_probe } from "src/schematic/schematic_current_probe"
import { simulation_current_probe } from "src/simulation/simulation_current_probe"
import { any_circuit_element } from "src/any_circuit_element"

test("source_simple_current_probe", () => {
  const currentProbe = source_simple_current_probe.parse({
    type: "source_component",
    ftype: "simple_current_probe",
    source_component_id: "source_current_probe_1",
    name: "IP1",
  })

  expect(currentProbe.type).toBe("source_component")
  expect(currentProbe.ftype).toBe("simple_current_probe")
  expect(currentProbe.source_component_id).toBe("source_current_probe_1")
  expect(currentProbe.name).toBe("IP1")
  expect(() => any_circuit_element.parse(currentProbe)).not.toThrow()
})

test("source_simple_current_probe links to schematic and simulation", () => {
  const sourceCurrentProbe = source_simple_current_probe.parse({
    type: "source_component",
    ftype: "simple_current_probe",
    source_component_id: "source_ip_1",
    name: "IP1",
  })

  const schematicProbe = schematic_current_probe.parse({
    type: "schematic_current_probe",
    schematic_current_probe_id: "schematic_ip_1",
    source_component_id: "source_ip_1",
    position: { x: 0, y: 0 },
    schematic_trace_id: "trace_1",
    current: "10mA",
    name: "IP1",
  })

  const simulationProbe = simulation_current_probe.parse({
    type: "simulation_current_probe",
    simulation_current_probe_id: "simulation_ip_1",
    source_component_id: "source_ip_1",
    positive_source_port_id: "port_1",
    negative_source_port_id: "port_2",
    name: "IP1",
  })

  expect(schematicProbe.source_component_id).toBe(
    sourceCurrentProbe.source_component_id,
  )
  expect(schematicProbe.current).toBe(0.01)
  expect(schematicProbe.name).toBe("IP1")
  expect(() => any_circuit_element.parse(schematicProbe)).not.toThrow()
  expect(simulationProbe.source_component_id).toBe(
    sourceCurrentProbe.source_component_id,
  )
  expect(simulationProbe.name).toBe("IP1")
})
