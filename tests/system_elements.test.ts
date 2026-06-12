import { expect, test } from "bun:test"
import {
  any_circuit_element,
  system_component,
  system_connection,
  system_diagram,
  system_port,
} from "../src"

test("system block diagram elements parse with ids and geometry", () => {
  const diagram = system_diagram.parse({
    type: "system_diagram",
    name: "Power Tree",
    width: 20,
    height: 12,
  })

  expect(diagram.system_diagram_id.startsWith("system_diagram_")).toBe(true)
  expect(diagram.name).toBe("Power Tree")

  const component = system_component.parse({
    type: "system_component",
    system_diagram_id: diagram.system_diagram_id,
    center: { x: 0, y: 0 },
    size: { width: 4, height: 2 },
    label: "Regulator",
    schematic_component_ids: ["schematic_component_1"],
  })

  expect(component.system_component_id.startsWith("system_component_")).toBe(
    true,
  )
  expect(component.schematic_component_ids).toEqual(["schematic_component_1"])

  const port = system_port.parse({
    type: "system_port",
    system_diagram_id: diagram.system_diagram_id,
    system_component_id: component.system_component_id,
    center: { x: 2, y: 0 },
    label: "VOUT",
    side_of_component: "right",
    facing_direction: "right",
  })

  expect(port.system_port_id.startsWith("system_port_")).toBe(true)
  expect(port.center).toEqual({ x: 2, y: 0 })

  const connection = system_connection.parse({
    type: "system_connection",
    system_diagram_id: diagram.system_diagram_id,
    source_system_port_id: port.system_port_id,
    path: [
      { x: 2, y: 0 },
      { x: 5, y: 0 },
      { x: 5, y: -2 },
    ],
    label: "3V3",
  })

  expect(connection.system_connection_id.startsWith("system_connection_")).toBe(
    true,
  )
  expect(connection.path).toEqual([
    { x: 2, y: 0 },
    { x: 5, y: 0 },
    { x: 5, y: -2 },
  ])
})

test("system elements are included in any_circuit_element", () => {
  const parsed = any_circuit_element.parse({
    type: "system_connection",
    system_connection_id: "system_connection_1",
    system_port_ids: ["system_port_1", "system_port_2"],
    path: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ],
  })

  expect(parsed.type).toBe("system_connection")
})
