import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import {
  system_diagram_component,
  system_diagram_connection,
  system_diagram_port,
} from "../src/system_diagram"

test("system_diagram_component parses", () => {
  const component = system_diagram_component.parse({
    type: "system_diagram_component",
    source_component_id: "source_component_1",
    center: { x: 0, y: 0 },
    size: { width: 4, height: 2 },
    label: "MCU",
  })

  expect(component.system_diagram_component_id).toStartWith(
    "system_diagram_component_",
  )
  expect(component.label).toBe("MCU")
})

test("system_diagram_port parses", () => {
  const port = system_diagram_port.parse({
    type: "system_diagram_port",
    system_diagram_component_id: "system_diagram_component_1",
    source_port_id: "source_port_1",
    center: { x: 2, y: 0 },
    label: "SDA",
    side: "right",
    direction: "bidirectional",
  })

  expect(port.system_diagram_port_id).toStartWith("system_diagram_port_")
  expect(port.side).toBe("right")
})

test("system_diagram_connection parses", () => {
  const connection = system_diagram_connection.parse({
    type: "system_diagram_connection",
    from_system_diagram_port_id: "system_diagram_port_1",
    to_system_diagram_port_id: "system_diagram_port_2",
    points: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
    label: "I2C",
  })

  expect(connection.system_diagram_connection_id).toStartWith(
    "system_diagram_connection_",
  )
  expect(connection.points).toHaveLength(2)
})

test("any_circuit_element includes system_diagram elements", () => {
  const parsed = any_circuit_element.parse({
    type: "system_diagram_component",
    system_diagram_component_id: "system_diagram_component_1",
    center: { x: 0, y: 0 },
    size: { width: 4, height: 2 },
  })

  expect(parsed.type).toBe("system_diagram_component")
})
