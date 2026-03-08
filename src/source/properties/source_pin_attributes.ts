import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_pin_attributes = z.object({
  must_be_connected: z.boolean().optional(),
  provides_power: z.boolean().optional(),
  requires_power: z.boolean().optional(),
  provides_ground: z.boolean().optional(),
  requires_ground: z.boolean().optional(),
  provides_voltage: z.union([z.string(), z.number()]).optional(),
  requires_voltage: z.union([z.string(), z.number()]).optional(),
  do_not_connect: z.boolean().optional(),
  include_in_board_pinout: z.boolean().optional(),
  can_use_internal_pullup: z.boolean().optional(),
  is_using_internal_pullup: z.boolean().optional(),
  needs_external_pullup: z.boolean().optional(),
  can_use_internal_pulldown: z.boolean().optional(),
  is_using_internal_pulldown: z.boolean().optional(),
  needs_external_pulldown: z.boolean().optional(),
  can_use_open_drain: z.boolean().optional(),
  is_using_open_drain: z.boolean().optional(),
  can_use_push_pull: z.boolean().optional(),
  is_using_push_pull: z.boolean().optional(),
  should_have_decoupling_capacitor: z.boolean().optional(),
  recommended_decoupling_capacitor_capacitance: z
    .union([z.string(), z.number()])
    .optional(),
  is_configured_for_i2c_sda: z.boolean().optional(),
  is_configured_for_i2c_scl: z.boolean().optional(),
  is_configured_for_spi_mosi: z.boolean().optional(),
  is_configured_for_spi_miso: z.boolean().optional(),
  is_configured_for_spi_sck: z.boolean().optional(),
  is_configured_for_spi_cs: z.boolean().optional(),
  is_configured_for_uart_tx: z.boolean().optional(),
  is_configured_for_uart_rx: z.boolean().optional(),
  supports_i2c_sda: z.boolean().optional(),
  supports_i2c_scl: z.boolean().optional(),
  supports_spi_mosi: z.boolean().optional(),
  supports_spi_miso: z.boolean().optional(),
  supports_spi_sck: z.boolean().optional(),
  supports_spi_cs: z.boolean().optional(),
  supports_uart_tx: z.boolean().optional(),
  supports_uart_rx: z.boolean().optional(),
})

type InferredSourcePinAttributes = z.infer<typeof source_pin_attributes>

export interface SourcePinAttributes {
  must_be_connected?: boolean
  provides_power?: boolean
  requires_power?: boolean
  provides_ground?: boolean
  requires_ground?: boolean
  provides_voltage?: string | number
  requires_voltage?: string | number
  do_not_connect?: boolean
  include_in_board_pinout?: boolean
  can_use_internal_pullup?: boolean
  is_using_internal_pullup?: boolean
  needs_external_pullup?: boolean
  can_use_internal_pulldown?: boolean
  is_using_internal_pulldown?: boolean
  needs_external_pulldown?: boolean
  can_use_open_drain?: boolean
  is_using_open_drain?: boolean
  can_use_push_pull?: boolean
  is_using_push_pull?: boolean
  should_have_decoupling_capacitor?: boolean
  recommended_decoupling_capacitor_capacitance?: string | number
  is_configured_for_i2c_sda?: boolean
  is_configured_for_i2c_scl?: boolean
  is_configured_for_spi_mosi?: boolean
  is_configured_for_spi_miso?: boolean
  is_configured_for_spi_sck?: boolean
  is_configured_for_spi_cs?: boolean
  is_configured_for_uart_tx?: boolean
  is_configured_for_uart_rx?: boolean
  supports_i2c_sda?: boolean
  supports_i2c_scl?: boolean
  supports_spi_mosi?: boolean
  supports_spi_miso?: boolean
  supports_spi_sck?: boolean
  supports_spi_cs?: boolean
  supports_uart_tx?: boolean
  supports_uart_rx?: boolean
}

expectTypesMatch<SourcePinAttributes, InferredSourcePinAttributes>(true)
