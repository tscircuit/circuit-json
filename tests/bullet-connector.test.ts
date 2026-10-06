import { expect, test } from "bun:test"
import { source_simple_connector } from "../src/source/source_simple_connector"

test("bullet connector size and gender survive Circuit JSON parsing", () => {
  const connector = {
    type: "source_component" as const,
    source_component_id: "source_component_0",
    name: "J_POWER",
    ftype: "simple_connector" as const,
    standard: "bullet" as const,
    pin_count: 1,
    bullet_diameter: 3.5,
    bullet_gender: "female" as const,
  }
  expect(source_simple_connector.parse(connector)).toMatchObject(connector)
  expect(source_simple_connector.safeParse({ ...connector, bullet_gender: "socket" }).success).toBe(false)
  expect(source_simple_connector.safeParse({ ...connector, bullet_diameter: Infinity }).success).toBe(false)
})
