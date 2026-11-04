import { expect, test } from "bun:test"
import { source_simple_connector } from "../src/source/source_simple_connector"

test("physical connector model strings survive Circuit JSON parsing without a standard", () => {
  const connector = {
    type: "source_component" as const,
    source_component_id: "source_component_0",
    name: "J_PHASES",
    ftype: "simple_connector" as const,
    pin_count: 3,
    modelprinter_string: "bullet3_d3.5mm_gmale",
  }
  expect(source_simple_connector.parse(connector)).toEqual(connector)
  expect(
    source_simple_connector.safeParse({ ...connector, standard: "bullet" })
      .success,
  ).toBe(false)
  expect(
    source_simple_connector.safeParse({
      ...connector,
      modelprinter_string: 3.5,
    }).success,
  ).toBe(false)
  expect(
    source_simple_connector.parse({
      ...connector,
      standard: "jst_ph",
      modelprinter_string: "jst_ph_pins3",
    }),
  ).toMatchObject({ standard: "jst_ph", modelprinter_string: "jst_ph_pins3" })
})
