import { test, expect } from "bun:test"
import { source_simple_current_probe } from "src/source/source_simple_current_probe"
import { schematic_current_probe } from "src/schematic/schematic_current_probe"
import { simulation_current_probe } from "src/simulation/simulation_current_probe"

test("source_simple_current_probe", () => {
  const currentProbe = source_simple_current_probe.parse({
    type: "source_component",
    ftype: "simple_current_probe",
    source_component_id: "source_current_probe_1",
    name: "CP1",
  })

  expect(currentProbe.type).toBe("source_component")
  expect(currentProbe.ftype).toBe("simple_current_probe")
  expect(currentProbe.source_component_id).toBe("source_current_probe_1")
  expect(currentProbe.name).toBe("CP1")
})

test("source_simple_current_probe links to schematic and simulation", () => {
  const sourceCurrentProbe = source_simple_current_probe.parse({
    type: "source_component",
    ftype: "simple_current_probe",
    source_component_id: "source_cp_1",
    name: "CP1",
  })

  const schematicProbe = schematic_current_probe.parse({
    type: "schematic_current_probe",
    schematic_current_probe_id: "schematic_cp_1",
    source_component_id: "source_cp_1",
    position: { x: 0, y: 0 },
    schematic_trace_id: "trace_1",
    name: "CP1",
  })

  const simulationProbe = simulation_current_probe.parse({
    type: "simulation_current_probe",
    simulation_current_probe_id: "simulation_cp_1",
    source_component_id: "source_cp_1",
    target_source_port_id: "port_1",
    name: "CP1",
  })

  expect(schematicProbe.source_component_id).toBe(
    sourceCurrentProbe.source_component_id,
  )
  expect(schematicProbe.name).toBe("CP1")
  expect(simulationProbe.source_component_id).toBe(
    sourceCurrentProbe.source_component_id,
  )
  expect(simulationProbe.name).toBe("CP1")
})
