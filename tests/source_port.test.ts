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
