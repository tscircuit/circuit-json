import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
import { model } from "./fixtures/simulation-ibis"

test.each([
  "ibis_pin_name_to_model_name",
  "ibis_pin_name_to_reference_source_port_ids",
] as const)("%s only references bound IBIS pins", (field) => {
  const value = model[field].A1
  const valid = {
    ...model,
    ibis_pin_name_to_source_port_id: {
      A1: "source_port_tx",
      A2: "source_port_rx",
    },
    [field]: { A2: value },
  }
  expect(any_circuit_element.parse(valid)).toMatchObject(valid)
  for (const pin of ["B2", "toString"]) {
    const result = any_circuit_element.safeParse({
      ...model,
      [field]: { A1: value, [pin]: value },
    })
    expect(result.success).toBe(false)
    if (result.success) throw new Error("Expected an unbound pin to fail")
    expect(result.error.issues).toContainEqual({
      code: "custom",
      path: [field, pin],
      message: `IBIS pin "${pin}" must be bound in ibis_pin_name_to_source_port_id`,
    })
  }
})

test("IBIS pin selection and reference maps may be omitted or empty", () => {
  for (const value of [undefined, {}]) {
    expect(
      any_circuit_element.safeParse({
        ...model,
        ibis_pin_name_to_model_name: value,
        ibis_pin_name_to_reference_source_port_ids: value,
      }).success,
    ).toBe(true)
  }
})

test.each(Object.keys(model.ibis_pin_name_to_reference_source_port_ids.A1))(
  "IBIS supply/clamp reference role %s survives a JSON roundtrip",
  (role) => {
    const references = { A1: { [role]: "source_port_reference" } }
    const record = any_circuit_element.parse({
      ...model,
      ibis_pin_name_to_reference_source_port_ids: references,
    })
    expect(record).toMatchObject({
      ibis_pin_name_to_reference_source_port_ids: references,
    })
    expect(
      any_circuit_element.parse(JSON.parse(JSON.stringify(record))),
    ).toEqual(record)
  },
)

test("IBIS supply/clamp reference maps reject unknown roles", () => {
  expect(
    any_circuit_element.safeParse({
      ...model,
      ibis_pin_name_to_reference_source_port_ids: {
        A1: {
          ...model.ibis_pin_name_to_reference_source_port_ids.A1,
          invalid_reference_source_port_id: "source_port_reference",
        },
      },
    }).success,
  ).toBe(false)
})
