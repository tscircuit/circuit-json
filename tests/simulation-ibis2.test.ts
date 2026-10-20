import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
import { model } from "./fixtures/simulation-ibis"
test("IBIS models require the shared Asset fields and explicit model settings", () => {
  for (const change of [
    { ibis_model_asset: { url: model.ibis_model_asset.url } },
    { ibis_model_asset: { ...model.ibis_model_asset, mimetype: undefined } },
    { ibis_pin_name_to_source_port_id: {} },
    { model_value_corner: undefined },
    { model_value_corner: "fastest" },
    { include_package_parasitics: "vendor" },
  ])
    expect(any_circuit_element.safeParse({ ...model, ...change }).success).toBe(
      false,
    )
})
