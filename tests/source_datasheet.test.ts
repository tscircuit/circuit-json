import { expect, test } from "bun:test"
import {
  any_circuit_element,
  any_source_component,
  source_datasheet,
  type AnyCircuitElement,
  type AnySourceElement,
  type CircuitJson,
  type SourceDatasheet,
} from "../src"

const datasheet: SourceDatasheet = {
  type: "source_datasheet",
  source_datasheet_id: "source_datasheet_0",
  manufacturer_part_number: "RP2040",
  datasheet_pdf_urls: [
    "https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf",
  ],
  description: "Dual-core microcontroller with programmable I/O.",
}

test("source_datasheet is exported and accepted in source and circuit element unions", () => {
  const sourceElement: AnySourceElement = datasheet
  const circuitElement: AnyCircuitElement = datasheet
  const circuit: CircuitJson = [circuitElement]
  expect(source_datasheet.parse(datasheet)).toEqual(datasheet)
  expect(any_source_component.parse(sourceElement)).toEqual(datasheet)
  expect(any_circuit_element.array().parse(circuit)).toEqual([datasheet])
})

test("description is optional and an empty PDF URL list is allowed", () => {
  const { description, ...withoutDescription } = datasheet
  const value = { ...withoutDescription, datasheet_pdf_urls: [] }
  expect(source_datasheet.parse(value)).toEqual(value)
  expect(source_datasheet.parse(value).description).toBeUndefined()
})

test("the element requires its ID, manufacturer part number, and PDF URLs", () => {
  for (const key of [
    "source_datasheet_id",
    "manufacturer_part_number",
    "datasheet_pdf_urls",
  ] as const) {
    const value = { ...datasheet }
    delete (value as Partial<SourceDatasheet>)[key]
    expect(source_datasheet.safeParse(value).success).toBe(false)
  }
})

test("rejects invalid PDF URLs and non-string descriptions", () => {
  expect(
    source_datasheet.safeParse({
      ...datasheet,
      datasheet_pdf_urls: ["not a URL"],
    }).success,
  ).toBe(false)
  expect(
    source_datasheet.safeParse({ ...datasheet, description: 42 }).success,
  ).toBe(false)
  expect(
    source_datasheet.safeParse({ ...datasheet, description: null }).success,
  ).toBe(false)
})
