import { expect, test } from "bun:test"
import { schematic_group, schematic_port, source_port } from "../src"

test("expanded groups preserve public port identity and boundary geometry", () => {
  const group = schematic_group.parse({
    type: "schematic_group",
    schematic_group_id: "schematic_group_filter",
    source_group_id: "source_group_filter",
    is_subcircuit: true,
    show_boundary: true,
    center: { x: 10, y: -3 },
    width: 8,
    height: 6,
    schematic_component_ids: ["schematic_component_r1"],
  })
  const sourcePort = source_port.parse({
    type: "source_port",
    source_port_id: "source_port_input",
    source_group_id: group.source_group_id,
    name: "IN",
  })
  const port = schematic_port.parse({
    type: "schematic_port",
    schematic_port_id: "schematic_port_input",
    source_port_id: sourcePort.source_port_id,
    schematic_group_id: group.schematic_group_id,
    center: { x: 5.6, y: -2 },
    boundary_position: { x: 6, y: -2 },
    facing_direction: "left",
    display_pin_label: "IN",
  })
  expect(group.show_boundary).toBe(true)
  expect(group.schematic_component_ids).toEqual(["schematic_component_r1"])
  expect(port.schematic_group_id).toBe(group.schematic_group_id)
  expect(port.boundary_position).toEqual({ x: 6, y: -2 })
  expect(port.source_port_id).toBe(sourcePort.source_port_id)
  expect(port.schematic_component_id).toBeUndefined()
  expect(
    schematic_port.parse({
      type: "schematic_port",
      schematic_port_id: "legacy",
      source_port_id: "pin",
      schematic_component_id: "component",
      center: { x: 0, y: 0 },
    }).boundary_position,
  ).toBeUndefined()
})
