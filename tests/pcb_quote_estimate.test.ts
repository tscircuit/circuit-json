import { expect, test } from "bun:test"
import {
  pcb_quote_estimate,
  any_circuit_element,
  type PcbCircuitElement,
} from "../src"

test("itemized quote estimates round trip through Circuit JSON without inventing unknown costs", () => {
  const input = {
    type: "pcb_quote_estimate" as const,
    pcb_board_id: "pcb_board_0",
    supplier_name: "jlcpcb",
    currency: "USD",
    quantity: 5,
    assembled_quantity: 2,
    estimated_at: "2026-10-26T00:00:00Z",
    pricing_model_version: "jlcpcb_20261026",
    is_manufacturing_cost_complete: false,
    is_landed_cost_complete: false,
    assembly_setup_cost: 8,
    kelvin_test_cost: 54.18,
    destination_country_code: "US",
  }
  const parsed: PcbCircuitElement = pcb_quote_estimate.parse(input)
  expect(any_circuit_element.parse(parsed)).toEqual(parsed)
  expect(parsed.pcb_quote_estimate_id).toStartWith("pcb_quote_estimate")
  expect(parsed.assembly_setup_cost).toBe(8)
  expect(parsed.shipping_cost).toBeUndefined()
  expect(parsed.total_cost).toBeUndefined()
  for (const invalid of [
    { quantity: 0 },
    { assembled_quantity: 6 },
    { total_cost: 100 },
    { is_landed_cost_complete: true },
    { quantity: 1.5 },
    { assembly_setup_cost: -1 },
    { kelvin_test_cost: Infinity },
    { currency: "usd" },
    { destination_country_code: "USA" },
    { estimated_at: "yesterday" },
  ])
    expect(pcb_quote_estimate.safeParse({ ...input, ...invalid }).success).toBe(
      false,
    )
})
