import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_port = z.object({
  type: z.literal("source_port"),
  pin_number: z.number().optional(),
  port_hints: z.array(z.string()).optional(),
  name: z.string(),
  source_port_id: z.string(),
  source_component_id: z.string().optional(),
  source_group_id: z.string().optional(),
  most_frequently_referenced_by_name: z.string().optional(),
  subcircuit_id: z.string().optional(),
  subcircuit_connectivity_map_key: z.string().optional(),
  must_be_connected: z.boolean().optional(),
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

export type SourcePortInput = z.input<typeof source_port>
type InferredSourcePort = z.infer<typeof source_port>

/**
 * Defines a source port that can be connected to other components
 */
export interface SourcePort {
  type: "source_port"
  pin_number?: number
  port_hints?: string[]
  name: string
  source_port_id: string
  source_component_id?: string
  source_group_id?: string
  most_frequently_referenced_by_name?: string
  subcircuit_id?: string
  subcircuit_connectivity_map_key?: string
  must_be_connected?: boolean
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

expectTypesMatch<SourcePort, InferredSourcePort>(true)
