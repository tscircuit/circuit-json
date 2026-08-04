import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { source_differential_pair_not_point_to_point_error } from "../src/source/source_differential_pair_not_point_to_point_error"

const errorInput = {
  type: "source_differential_pair_not_point_to_point_error" as const,
  message:
    'Differential pair "USB_DATA" positiveConnection resolves to net.DP, which is not point-to-point.',
  subcircuit_id: "subcircuit_1",
  differential_pair_name: "USB_DATA",
  connection_polarity: "positive" as const,
  connection_selector: "net.DP",
  subcircuit_connectivity_map_key: "connectivity_net_1",
  source_net_id: "source_net_1",
  connected_source_port_ids: [
    "source_port_1",
    "source_port_2",
    "source_port_3",
  ],
}

test("source_differential_pair_not_point_to_point_error schema parses and defaults its identifiers", () => {
  const error =
    source_differential_pair_not_point_to_point_error.parse(errorInput)

  expect(error.error_type).toBe(
    "source_differential_pair_not_point_to_point_error",
  )
  expect(error.source_differential_pair_not_point_to_point_error_id).toMatch(
    /^source_differential_pair_not_point_to_point_error_/,
  )
  expect(error.connection_polarity).toBe("positive")
  expect(error.connected_source_port_ids).toEqual([
    "source_port_1",
    "source_port_2",
    "source_port_3",
  ])
})

test("any_circuit_element includes source_differential_pair_not_point_to_point_error", () => {
  const parsed = any_circuit_element.parse(errorInput)

  expect(parsed.type).toBe("source_differential_pair_not_point_to_point_error")
})

test("source_differential_pair_not_point_to_point_error validates polarity", () => {
  expect(() =>
    source_differential_pair_not_point_to_point_error.parse({
      ...errorInput,
      connection_polarity: "neutral",
    }),
  ).toThrow()
})
