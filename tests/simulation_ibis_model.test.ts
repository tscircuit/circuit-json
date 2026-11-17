import { expect, test } from "bun:test"
import { any_circuit_element, type SimulationIbisModelInput } from "../src"

const references = {
  pullup_reference_source_port_id: "source_port_vcc",
  pulldown_reference_source_port_id: "source_port_gnd",
  power_clamp_reference_source_port_id: "source_port_vcc",
  ground_clamp_reference_source_port_id: "source_port_gnd",
  external_reference_source_port_id: "source_port_vref",
}
const asset = {
  project_relative_path: "models/chip.ibs",
  url: "https://example.com/chip.ibs",
  mimetype: "text/plain",
}
const model = {
  type: "simulation_ibis_model",
  source_component_id: "source_component_tx",
  ibis_model_asset: asset,
  ibis_component_name: "CHIP",
  ibis_pin_name_to_source_port_id: { A1: "source_port_tx" },
  ibis_pin_name_to_model_name: { A1: "OUTPUT" },
  ibis_pin_name_to_reference_source_port_ids: { A1: references },
} satisfies SimulationIbisModelInput

const parses = (change: object) =>
  any_circuit_element.safeParse({ ...model, ...change }).success

test("simulation_ibis_model", () => {
  const record = any_circuit_element.parse(model)
  expect(record).toMatchObject(model)

  for (const change of [
    {
      ibis_pin_name_to_model_name: undefined,
      ibis_pin_name_to_reference_source_port_ids: {},
    },
    { ibis_model_asset: { ...asset, url: "../models/chip.ibs" } },
    { ibis_model_asset: { ...asset, url: "assets/vendor models/chip.ibs" } },
    { ibis_model_asset: { ...asset, project_relative_path: "./chip.ibs" } },
  ])
    expect(parses(change)).toBe(true)

  for (const change of [
    { ibis_model_asset: { url: asset.url } },
    { ibis_pin_name_to_source_port_id: {} },
    { ibis_pin_name_to_model_name: { A1: "OUTPUT", B2: "OUTPUT" } },
    { ibis_pin_name_to_model_name: { toString: "OUTPUT" } },
    { ibis_pin_name_to_reference_source_port_ids: { B2: references } },
    {
      ibis_pin_name_to_reference_source_port_ids: {
        A1: { invalid_reference_source_port_id: "source_port_vcc" },
      },
    },
    ...[
      "javascript:alert(1)",
      "JaVaScRiPt:alert(1)",
      "file:///etc/passwd",
      "data:text/plain,IBIS",
      "//example.com/chip.ibs",
      "/etc/passwd",
      "C:\\models\\chip.ibs",
      "\\\\example.com\\chip.ibs",
      " javascript:alert(1)",
      "https://",
      "",
    ].flatMap((value) => [
      { ibis_model_asset: { ...asset, url: value } },
      { ibis_model_asset: { ...asset, project_relative_path: value } },
    ]),
  ])
    expect(parses(change)).toBe(false)
})
