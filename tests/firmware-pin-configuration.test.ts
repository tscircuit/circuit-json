import { expect, test } from "bun:test"
import { bit_rate, source_pin_attributes, source_simple_chip } from "../src"

test("firmware declarations preserve intent without inventing settings", () => {
  const attributes = {
    is_gpio: true,
    is_output: true,
    initial_output_state: "low",
    interrupt_trigger: "none",
    do_not_configure: false,
  } as const
  expect(source_pin_attributes.parse(attributes)).toEqual(attributes)
  expect(source_pin_attributes.parse({})).toEqual({})
  expect(source_pin_attributes.parse({ i2c_max_bit_rate: 100000 })).toEqual({
    i2c_max_bit_rate: 100000,
  })
})

test("firmware fields reject invalid states and non-positive or fractional bit rates", () => {
  for (const attributes of [
    { initial_output_state: "default" },
    { interrupt_trigger: "edge" },
    { i2c_max_bit_rate: 0 },
    { i2c_max_bit_rate: -100 },
    { i2c_max_bit_rate: 0.5 },
    { i2c_max_bit_rate: "100kHz" },
    { do_not_configure: "true" },
  ])
    expect(source_pin_attributes.safeParse(attributes).success).toBe(false)
})

test("MCU-wide firmware choices survive source component parsing", () => {
  const chip = {
    type: "source_component",
    source_component_id: "mcu",
    ftype: "simple_chip",
    name: "U1",
    firmware_rtos: "nortos",
    firmware_lf_clock_source: "internal_rc",
  }
  expect(source_simple_chip.parse(chip)).toMatchObject(chip)
  expect(
    source_simple_chip.safeParse({ ...chip, firmware_rtos: "automatic" })
      .success,
  ).toBe(false)
  expect(
    source_simple_chip.safeParse({
      ...chip,
      firmware_lf_clock_source: "automatic",
    }).success,
  ).toBe(false)
})

test("bit rates normalize units and reject invalid or ambiguous quantities", () => {
  for (const bitRate of [
    100000,
    "100kbps",
    "100 kbit/s",
    "0.1Mbps",
    "100000 bit/s",
  ]) {
    expect(bit_rate.parse(bitRate)).toBe(100000)
  }
  for (const bitRate of [
    0,
    -1,
    Infinity,
    NaN,
    0.5,
    "100kHz",
    "100",
    "100KBps",
    "10oops",
    "1e999bps",
  ]) {
    expect(bit_rate.safeParse(bitRate).success).toBe(false)
  }
})
