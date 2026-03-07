import { expect, test } from "bun:test"
import { source_port } from "../src/source/source_port"

test("source_port parses with most_frequently_referenced_by_name", () => {
  const parsed = source_port.parse({
    type: "source_port",
    name: "A",
    source_port_id: "source_port_1",
    most_frequently_referenced_by_name: "GND",
  })

  expect(parsed.most_frequently_referenced_by_name).toBe("GND")
})

test("source_port parses without most_frequently_referenced_by_name", () => {
  const parsed = source_port.parse({
    type: "source_port",
    name: "B",
    source_port_id: "source_port_2",
  })

  expect(parsed.most_frequently_referenced_by_name).toBeUndefined()
})

test("source_port parses configuration and support protocol flags", () => {
  const parsed = source_port.parse({
    type: "source_port",
    name: "IO1",
    source_port_id: "source_port_3",
    is_configured_for_i2c_sda: true,
    is_configured_for_i2c_scl: false,
    is_configured_for_spi_mosi: true,
    is_configured_for_spi_miso: false,
    is_configured_for_spi_sck: true,
    is_configured_for_spi_cs: false,
    is_configured_for_uart_tx: true,
    is_configured_for_uart_rx: false,
    supports_i2c_sda: true,
    supports_i2c_scl: true,
    supports_spi_mosi: true,
    supports_spi_miso: true,
    supports_spi_sck: true,
    supports_spi_cs: true,
    supports_uart_tx: true,
    supports_uart_rx: true,
  })

  expect(parsed.is_configured_for_i2c_sda).toBe(true)
  expect(parsed.is_configured_for_i2c_scl).toBe(false)
  expect(parsed.is_configured_for_spi_mosi).toBe(true)
  expect(parsed.is_configured_for_spi_miso).toBe(false)
  expect(parsed.is_configured_for_spi_sck).toBe(true)
  expect(parsed.is_configured_for_spi_cs).toBe(false)
  expect(parsed.is_configured_for_uart_tx).toBe(true)
  expect(parsed.is_configured_for_uart_rx).toBe(false)
  expect(parsed.supports_i2c_sda).toBe(true)
  expect(parsed.supports_i2c_scl).toBe(true)
  expect(parsed.supports_spi_mosi).toBe(true)
  expect(parsed.supports_spi_miso).toBe(true)
  expect(parsed.supports_spi_sck).toBe(true)
  expect(parsed.supports_spi_cs).toBe(true)
  expect(parsed.supports_uart_tx).toBe(true)
  expect(parsed.supports_uart_rx).toBe(true)
})

test("source_port parses pin attributes", () => {
  const parsed = source_port.parse({
    type: "source_port",
    name: "IO2",
    source_port_id: "source_port_4",
    provides_power: false,
    requires_power: true,
    provides_ground: false,
    requires_ground: true,
    provides_voltage: "3.3V",
    requires_voltage: 3.3,
    do_not_connect: false,
    include_in_board_pinout: true,
    highlight_color: "#22aa66",
    must_be_connected: true,
    can_use_internal_pullup: true,
    is_using_internal_pullup: false,
    needs_external_pullup: false,
    can_use_internal_pulldown: true,
    is_using_internal_pulldown: false,
    needs_external_pulldown: false,
    can_use_open_drain: true,
    is_using_open_drain: false,
    can_use_push_pull: true,
    is_using_push_pull: true,
    should_have_decoupling_capacitor: true,
    recommended_decoupling_capacitor_capacitance: "100nF",
  })

  expect(parsed.provides_power).toBe(false)
  expect(parsed.requires_power).toBe(true)
  expect(parsed.provides_ground).toBe(false)
  expect(parsed.requires_ground).toBe(true)
  expect(parsed.provides_voltage).toBe("3.3V")
  expect(parsed.requires_voltage).toBe(3.3)
  expect(parsed.do_not_connect).toBe(false)
  expect(parsed.include_in_board_pinout).toBe(true)
  expect(parsed.highlight_color).toBe("#22aa66")
  expect(parsed.must_be_connected).toBe(true)
  expect(parsed.can_use_internal_pullup).toBe(true)
  expect(parsed.is_using_internal_pullup).toBe(false)
  expect(parsed.needs_external_pullup).toBe(false)
  expect(parsed.can_use_internal_pulldown).toBe(true)
  expect(parsed.is_using_internal_pulldown).toBe(false)
  expect(parsed.needs_external_pulldown).toBe(false)
  expect(parsed.can_use_open_drain).toBe(true)
  expect(parsed.is_using_open_drain).toBe(false)
  expect(parsed.can_use_push_pull).toBe(true)
  expect(parsed.is_using_push_pull).toBe(true)
  expect(parsed.should_have_decoupling_capacitor).toBe(true)
  expect(parsed.recommended_decoupling_capacitor_capacitance).toBe("100nF")
})
