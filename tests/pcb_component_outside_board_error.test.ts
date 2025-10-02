import { expect, test } from "bun:test"
import { any_circuit_element } from "src/any_circuit_element"
import { pcb_component_outside_board_error } from "src/pcb/pcb_component_outside_board_error"

test("pcb_component_outside_board_error parses", () => {
  const errorData = {
    type: "pcb_component_outside_board_error",
    pcb_component_outside_board_error_id: "error_1",
    message:
      "Component R1 (pcb_component_1) is placed outside board boundaries at (15, 20)",
    pcb_component_id: "pcb_component_1",
    pcb_board_id: "pcb_board_1",
    component_center: { x: 15, y: 20 },
    component_bounds: {
      min_x: 10,
      max_x: 20,
      min_y: 15,
      max_y: 25,
    },
    source_component_id: "source_component_1",
  }

  const parsed = pcb_component_outside_board_error.parse(errorData)

  expect(parsed.type).toBe("pcb_component_outside_board_error")
  expect(parsed.error_type).toBe("pcb_component_outside_board_error")
  expect(parsed.message).toContain("Component R1")
  expect(parsed.pcb_component_id).toBe("pcb_component_1")
  expect(parsed.pcb_board_id).toBe("pcb_board_1")
  expect(parsed.component_center.x).toBe(15)
  expect(parsed.component_center.y).toBe(20)
  expect(parsed.component_bounds.min_x).toBe(10)
  expect(parsed.component_bounds.max_x).toBe(20)
})

test("any_circuit_element includes pcb_component_outside_board_error", () => {
  const errorData = {
    type: "pcb_component_outside_board_error",
    pcb_component_outside_board_error_id: "error_1",
    message: "Component outside board",
    pcb_component_id: "pcb_component_1",
    pcb_board_id: "pcb_board_1",
    component_center: { x: 15, y: 20 },
    component_bounds: {
      min_x: 10,
      max_x: 20,
      min_y: 15,
      max_y: 25,
    },
  }

  expect(() => any_circuit_element.parse(errorData)).not.toThrow()
})
