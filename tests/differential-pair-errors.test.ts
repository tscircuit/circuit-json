import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_autorouting_error,
  pcb_bus_length_skew_error,
} from "../src"

const autorouting = {
  type: "pcb_autorouting_error",
  message: "USB positive lane is 1.200mm longer (21.200 vs 20.000); max 0.1mm",
  differential_pair_length_skew: {
    source_bus_id: "usb",
    positive_length: 21.2,
    negative_length: 20,
  },
}
const drc = {
  type: "pcb_bus_length_skew_error",
  message: "USB copper exceeds skew",
  source_bus_id: "usb",
  source_trace_ids: ["dp1", "dp2", "dm1"],
  pcb_trace_ids: ["pcb_dp1", "pcb_dp2", "pcb_dm1"],
  actual_length_skew: 1.2,
  maximum_length_skew: 0.1,
  differential_pair_lengths: { positive_length: 21.2, negative_length: 20 },
}

test("pair failure payloads round-trip through public error and element schemas", () => {
  const failed = pcb_autorouting_error.parse(autorouting)
  const copper = pcb_bus_length_skew_error.parse(drc)
  expect(failed.differential_pair_length_skew).toEqual(
    autorouting.differential_pair_length_skew,
  )
  expect(copper.differential_pair_lengths).toEqual(
    drc.differential_pair_lengths,
  )
  for (const error of [failed, copper]) {
    expect(
      any_circuit_element.parse(JSON.parse(JSON.stringify(error))),
    ).toEqual(error)
  }
})

test("lane lengths must both be present, finite and nonnegative", () => {
  for (const key of ["positive_length", "negative_length"]) {
    for (const value of [undefined, -1, Infinity, -Infinity, NaN, "1mm"]) {
      expect(
        pcb_autorouting_error.safeParse({
          ...autorouting,
          differential_pair_length_skew: {
            ...autorouting.differential_pair_length_skew,
            [key]: value,
          },
        }).success,
      ).toBe(false)
      expect(
        pcb_bus_length_skew_error.safeParse({
          ...drc,
          differential_pair_lengths: {
            ...drc.differential_pair_lengths,
            [key]: value,
          },
        }).success,
      ).toBe(false)
    }
  }
  expect(
    pcb_autorouting_error.safeParse({
      ...autorouting,
      differential_pair_length_skew: { positive_length: 1, negative_length: 0 },
    }).success,
  ).toBe(false)
  expect(
    pcb_autorouting_error.safeParse({
      ...autorouting,
      differential_pair_length_skew: {
        source_bus_id: "usb",
        positive_length: 0,
        negative_length: 0,
      },
    }).success,
  ).toBe(true)
})

test("DRC skew must match the absolute lane difference within 1e-9 mm", () => {
  expect(
    pcb_bus_length_skew_error.safeParse({ ...drc, actual_length_skew: 0 })
      .success,
  ).toBe(false)
  expect(
    pcb_bus_length_skew_error.safeParse({
      ...drc,
      actual_length_skew: 1.2 + 0.5e-9,
    }).success,
  ).toBe(true)
  expect(
    pcb_bus_length_skew_error.safeParse({
      ...drc,
      actual_length_skew: 1.2 + 2e-9,
    }).success,
  ).toBe(false)
  expect(
    pcb_bus_length_skew_error.safeParse({
      ...drc,
      differential_pair_lengths: { positive_length: 20, negative_length: 21.2 },
    }).success,
  ).toBe(true)
})

test("ordinary errors still accept omitted pair payloads", () => {
  const { differential_pair_length_skew, ...ordinaryAutorouting } = autorouting
  const { differential_pair_lengths, ...ordinaryDrc } = drc
  expect(
    pcb_autorouting_error.parse(ordinaryAutorouting)
      .differential_pair_length_skew,
  ).toBeUndefined()
  expect(
    pcb_bus_length_skew_error.parse(ordinaryDrc).differential_pair_lengths,
  ).toBeUndefined()
})
