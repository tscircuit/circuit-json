import { test, expect } from "bun:test"
import { any_circuit_element } from "src/any_circuit_element"
import { source_component_base } from "src/source/base/source_component_base"

test("pins_are_interchangeable property on source component", () => {
  // Test with pins_are_interchangeable set to true
  const componentWithInterchangeablePins = source_component_base.parse({
    type: "source_component",
    source_component_id: "test_component_1",
    name: "Test Component 1",
    pins_are_interchangeable: true
  })
  
  expect(componentWithInterchangeablePins.pins_are_interchangeable).toBe(true)
  
  // Test with pins_are_interchangeable set to false
  const componentWithNonInterchangeablePins = source_component_base.parse({
    type: "source_component",
    source_component_id: "test_component_2",
    name: "Test Component 2",
    pins_are_interchangeable: false
  })
  
  expect(componentWithNonInterchangeablePins.pins_are_interchangeable).toBe(false)
  
  // Test with pins_are_interchangeable not set (should be undefined)
  const componentWithoutProperty = source_component_base.parse({
    type: "source_component",
    source_component_id: "test_component_3",
    name: "Test Component 3"
  })
  
  expect(componentWithoutProperty.pins_are_interchangeable).toBeUndefined()
  
  // Test that the property works through any_circuit_element
  const parsedComponent = any_circuit_element.parse({
    type: "source_component",
    source_component_id: "test_component_4",
    name: "Test Component 4",
    pins_are_interchangeable: true
  })
  
  expect(parsedComponent).toHaveProperty("pins_are_interchangeable", true)
})
