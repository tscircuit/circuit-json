import { expect, test } from "bun:test"
import { schematic_group, schematic_port, source_port } from "../src"
import reference from "./assets/cc2340r5-interface.json"

// Actual core output for ShiboSoftwareDev/cc2340r5-reference-design 1.4.0,
// release bff7bbb1-c0df-4b3e-8cb2-5f5c706caa87. The core companion preserves
// all 27 components and 16 original nets, adding eight GPIO nets and 13 exports.
test("CC2340R5 expanded interface preserves group ownership and terminal geometry", () => {
  const group = schematic_group.parse(reference.group)
  const sourcePort = source_port.parse(reference.sourcePort)
  const port = schematic_port.parse(reference.port)
  expect(group.show_boundary).toBe(true)
  expect(group.name).toBe("CC2340R5")
  expect(group.schematic_component_ids).toHaveLength(27)
  expect(sourcePort.name).toBe("RESET_N")
  expect(sourcePort.source_group_id).toBe(group.source_group_id)
  expect(port.schematic_group_id).toBe(group.schematic_group_id)
  expect(port.boundary_position!.x).toBeCloseTo(
    group.center.x - group.width / 2,
  )
  expect(port.center.x).toBeCloseTo(port.boundary_position!.x - 0.4)
  expect(port.source_port_id).toBe(sourcePort.source_port_id)
  expect(port.schematic_component_id).toBeUndefined()
  expect(
    schematic_port.parse(reference.componentPort).boundary_position,
  ).toBeUndefined()
})
