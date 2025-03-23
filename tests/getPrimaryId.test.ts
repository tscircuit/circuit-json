import { expect, test } from "bun:test"
import { getPrimaryId } from "../src/getPrimaryId"
import type { CircuitElement } from "../src/getPrimaryId"

test("getPrimaryId", () => {
  // Test source elements
  const sourceComponent: CircuitElement = {
    type: "source_component",
    name: "R1",
    source_component_id: "comp1",
    ftype: "simple_resistor",
    resistance: 100,
  }
  expect(getPrimaryId(sourceComponent)).toBe("comp1")

  const sourcePort: CircuitElement = {
    type: "source_port",
    name: "1",
    source_port_id: "port1",
    source_component_id: "comp1",
  }
  expect(getPrimaryId(sourcePort)).toBe("port1")

  // Test PCB elements
  const pcbComponent: CircuitElement = {
    type: "pcb_component",
    source_component_id: "comp1",
    pcb_component_id: "pcb1",
    center: { x: 0, y: 0 },
    layer: "top",
    rotation: 0,
    width: 10,
    height: 10,
  }
  expect(getPrimaryId(pcbComponent)).toBe("pcb1")

  const pcbTrace: CircuitElement = {
    type: "pcb_trace",
    pcb_trace_id: "trace1",
    route: [
      {
        x: 0,
        y: 0,
        layer: "top",
        width: 1,
        route_type: "wire",
      },
    ],
  }
  expect(getPrimaryId(pcbTrace)).toBe("trace1")

  // Test schematic elements
  const schematicComponent: CircuitElement = {
    type: "schematic_component",
    source_component_id: "comp1",
    center: { x: 0, y: 0 },
    schematic_component_id: "sch1",
    size: { width: 10, height: 10 },
  }
  expect(getPrimaryId(schematicComponent)).toBe("sch1")

  const schematicPort: CircuitElement = {
    type: "schematic_port",
    source_port_id: "port1",
    center: { x: 0, y: 0 },
    schematic_port_id: "sch_port1",
  }
  expect(getPrimaryId(schematicPort)).toBe("sch_port1")

  // Test special cases
  const projectMetadata: CircuitElement = {
    type: "source_project_metadata",
  }
  expect(getPrimaryId(projectMetadata)).toBe("source_project_metadata")

  const debugObject: CircuitElement = {
    type: "schematic_debug_object",
    center: { x: 0, y: 0 },
    shape: "point",
  }
  expect(getPrimaryId(debugObject)).toBe("schematic_debug_object")

  // Test error cases
  const errorElement = {
    type: "invalid_type",
  } as unknown as CircuitElement
  expect(() => getPrimaryId(errorElement)).toThrow(
    "Unhandled element type: invalid_type",
  )

  // Test elements with multiple ID types
  const pcbComponentWithMultipleIds: CircuitElement = {
    type: "pcb_component",
    source_component_id: "source_comp1", // This is a secondary ID
    pcb_component_id: "pcb_comp1", // This is the primary ID
    center: { x: 0, y: 0 },
    layer: "top",
    rotation: 0,
    width: 10,
    height: 10,
  }
  expect(getPrimaryId(pcbComponentWithMultipleIds)).toBe("pcb_comp1") // Should return primary ID

  const schematicComponentWithMultipleIds: CircuitElement = {
    type: "schematic_component",
    source_component_id: "source_comp2", // This is a secondary ID
    schematic_component_id: "sch_comp2", // This is the primary ID
    center: { x: 0, y: 0 },
    size: { width: 10, height: 10 },
  }
  expect(getPrimaryId(schematicComponentWithMultipleIds)).toBe("sch_comp2") // Should return primary ID
})
