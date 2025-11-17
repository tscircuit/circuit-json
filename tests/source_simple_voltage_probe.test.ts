import { test, expect } from "bun:test"
import { source_simple_voltage_probe } from "src/source/source_simple_voltage_probe"
import { schematic_voltage_probe } from "src/schematic/schematic_voltage_probe"
import { simulation_voltage_probe } from "src/simulation/simulation_voltage_probe"

test("source_simple_voltage_probe", () => {
  const voltageProbe = source_simple_voltage_probe.parse({
    type: "source_component",
    ftype: "simple_voltage_probe",
    source_component_id: "source_voltage_probe_1",
    name: "VP1",
  })

  expect(voltageProbe.type).toBe("source_component")
  expect(voltageProbe.ftype).toBe("simple_voltage_probe")
  expect(voltageProbe.source_component_id).toBe("source_voltage_probe_1")
  expect(voltageProbe.name).toBe("VP1")
})

test("source_simple_voltage_probe links to schematic and simulation", () => {
  // Create a source component
  const sourceVoltageProbe = source_simple_voltage_probe.parse({
    type: "source_component",
    ftype: "simple_voltage_probe",
    source_component_id: "source_vp_1",
    name: "VP1",
  })

  // Create a schematic voltage probe linked to the source component
  const schematicProbe = schematic_voltage_probe.parse({
    type: "schematic_voltage_probe",
    schematic_voltage_probe_id: "schematic_vp_1",
    source_component_id: "source_vp_1",
    position: { x: 0, y: 0 },
    schematic_trace_id: "trace_1",
    name: "VP1",
  })

  // Create a simulation voltage probe linked to the source component
  const simulationProbe = simulation_voltage_probe.parse({
    type: "simulation_voltage_probe",
    simulation_voltage_probe_id: "simulation_vp_1",
    source_component_id: "source_vp_1",
    source_port_id: "port_1",
    name: "VP1",
  })

  // Verify the linking
  expect(schematicProbe.source_component_id).toBe(
    sourceVoltageProbe.source_component_id,
  )
  expect(schematicProbe.name).toBe("VP1")
  expect(simulationProbe.source_component_id).toBe(
    sourceVoltageProbe.source_component_id,
  )
  expect(simulationProbe.name).toBe("VP1")
})
