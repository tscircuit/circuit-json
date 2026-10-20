import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
import { eye, model, stimulus } from "./fixtures/simulation-ibis"

test("stimulus and eye time fields reject non-time units", () => {
  for (const [record, fields] of [
    [stimulus, ["bit_duration_ms", "start_time_ms"]],
    [
      eye,
      ["unit_interval_ms", "time_origin_ms", "start_time_ms", "end_time_ms"],
    ],
  ] as const) {
    for (const field of fields) {
      for (const value of ["2.5V", "3A", "1mm", "1Hz", "1invalid", ""]) {
        expect(
          any_circuit_element.safeParse({ ...record, [field]: value }).success,
        ).toBe(false)
      }
      for (const [value, milliseconds] of [
        [0.0000025, 0.0000025],
        ["2.5ns", 0.0000025],
        ["1us", 0.001],
        ["0.5ms", 0.5],
      ] as const) {
        const parsed = any_circuit_element.parse({
          ...record,
          // Keep the eye's measurement gate ordered for every valid input.
          start_time_ms: 0,
          end_time_ms: "1s",
          [field]: value,
        })
        expect(Reflect.get(parsed, field)).toBeCloseTo(milliseconds, 14)
      }
    }
  }
})

test("digital stimulus limits string and array patterns to 65536 bits", () => {
  for (const length of [65536, 65537]) {
    for (const bits of [
      "01".repeat(length).slice(0, length),
      Array(length).fill(0),
    ]) {
      expect(
        any_circuit_element.safeParse({
          ...stimulus,
          transmission_pattern: { ...stimulus.transmission_pattern, bits },
        }).success,
      ).toBe(length === 65536)
    }
  }
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
