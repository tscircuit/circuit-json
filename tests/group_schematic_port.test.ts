import { test, expect } from "bun:test"
import { group_schematic_port } from "src/schematic/group_schematic_port"
import { any_circuit_element } from "src/any_circuit_element"

test("group_schematic_port parses", () => {
  const port = group_schematic_port.parse({
    type: "group_schematic_port",
    source_port_id: "source_port_1",
    schematic_group_id: "schematic_group_1",
    center: { x: 0, y: 0 },
    facing_direction: "up",
    pin_number: 1,
    display_pin_label: "A1",
    side_of_component: "left",
  })

  expect(port.group_schematic_port_id).toBeDefined()
  expect(port.facing_direction).toBe("up")
  expect(port.schematic_group_id).toBe("schematic_group_1")
  expect(port.pin_number).toBe(1)
  expect(port.display_pin_label).toBe("A1")
  expect(port.side_of_component).toBe("left")
})

test("any_circuit_element includes group_schematic_port", () => {
  const parsed = any_circuit_element.parse({
    type: "group_schematic_port",
    source_port_id: "source_port_1",
    schematic_group_id: "schematic_group_1",
    center: { x: 0, y: 0 },
    facing_direction: "up",
    pin_number: 1,
  })

  expect(parsed.type).toBe("group_schematic_port")
  if (parsed.type === "group_schematic_port") {
    expect(parsed.pin_number).toBe(1)
  }
})
