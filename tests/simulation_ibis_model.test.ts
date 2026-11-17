import { expect, test } from "bun:test"
import { any_circuit_element, type SimulationIbisModelInput } from "../src"

const model = {
  type: "simulation_ibis_model",
  source_component_id: "source_component_tx",
  ibis_model_asset: {
    project_relative_path: "models/chip.ibs",
    url: "https://example.com/chip.ibs",
    mimetype: "text/plain",
  },
  ibis_component_name: "CHIP",
  ibis_pin_name_to_source_port_id: { A1: "source_port_tx" },
  ibis_pin_name_to_model_name: { A1: "OUTPUT" },
  ibis_pin_name_to_reference_source_port_ids: {
    A1: {
      pullup_reference_source_port_id: "source_port_vcc",
      pulldown_reference_source_port_id: "source_port_gnd",
      power_clamp_reference_source_port_id: "source_port_vcc",
      ground_clamp_reference_source_port_id: "source_port_gnd",
      external_reference_source_port_id: "source_port_vref",
    },
  },
} satisfies SimulationIbisModelInput

test("IBIS model corner and package policy belong to the channel simulation", () => {
  for (const change of [
    { model_value_corner: "typical" },
    { include_package_parasitics: true },
  ]) {
    expect(any_circuit_element.safeParse({ ...model, ...change }).success).toBe(
      false,
    )
  }
})

test("IBIS model assets and named physical pin bindings survive the public union", () => {
  const record = any_circuit_element.parse(model)
  expect(record).toMatchObject(model)
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(record)))).toEqual(
    record,
  )
})

test("IBIS models require the shared Asset fields and physical pin bindings", () => {
  for (const change of [
    { ibis_model_asset: { url: model.ibis_model_asset.url } },
    { ibis_model_asset: { ...model.ibis_model_asset, mimetype: undefined } },
    { ibis_pin_name_to_source_port_id: {} },
  ])
    expect(any_circuit_element.safeParse({ ...model, ...change }).success).toBe(
      false,
    )
})

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

test("IBIS asset URLs accept HTTP(S) and relative asset paths", () => {
  for (const url of [
    "https://example.com/chip.ibs?version=1",
    "http://example.com/chip.ibs",
    "models/chip.ibs",
    "./assets/chip.ibs",
    "../models/chip.ibs",
    "assets/vendor models/chip.ibs",
  ]) {
    expect(
      any_circuit_element.safeParse({
        ...model,
        ibis_model_asset: { ...model.ibis_model_asset, url },
      }).success,
    ).toBe(true)
  }
  for (const project_relative_path of [
    "./models/chip.ibs",
    "assets/vendor models/chip.ibs",
  ]) {
    expect(
      any_circuit_element.safeParse({
        ...model,
        ibis_model_asset: { ...model.ibis_model_asset, project_relative_path },
      }).success,
    ).toBe(true)
  }
})

test("IBIS asset locations reject unsupported schemes and absolute paths", () => {
  for (const field of ["url", "project_relative_path"]) {
    for (const value of [
      "javascript:alert(1)",
      "JaVaScRiPt:alert(1)",
      "file:///etc/passwd",
      "data:text/plain,IBIS",
      "ftp://example.com/chip.ibs",
      "//example.com/chip.ibs",
      "/etc/passwd",
      "C:\\models\\chip.ibs",
      "\\\\example.com\\chip.ibs",
      " javascript:alert(1)",
      "java\nscript:alert(1)",
      "",
    ]) {
      expect(
        any_circuit_element.safeParse({
          ...model,
          ibis_model_asset: { ...model.ibis_model_asset, [field]: value },
        }).success,
      ).toBe(false)
    }
  }
  expect(
    any_circuit_element.safeParse({
      ...model,
      ibis_model_asset: { ...model.ibis_model_asset, url: "https://" },
    }).success,
  ).toBe(false)
})
