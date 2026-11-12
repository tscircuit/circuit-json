import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
import { model } from "./fixtures/simulation-ibis"

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
