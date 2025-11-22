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
  subcircuit_id: z.string().optional(),
  subcircuit_connectivity_map_key: z.string().optional(),

  // DRC attributes
  must_be_connected: z.boolean().optional(),
  requires_power: z.boolean().optional(),
  requires_ground: z.boolean().optional(),
  requires_voltage: z.union([z.string(), z.number()]).optional(),
  do_not_connect: z.boolean().optional(),
  include_in_board_pinout: z.boolean().optional(),
  highlight_color: z.string().optional(),
  provides_power: z.boolean().optional(),
  provides_ground: z.boolean().optional(),
  provides_voltage: z.union([z.string(), z.number()]).optional(),
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
  subcircuit_id?: string
  subcircuit_connectivity_map_key?: string

  // DRC attributes
  must_be_connected?: boolean
  requires_power?: boolean
  requires_ground?: boolean
  requires_voltage?: string | number
  do_not_connect?: boolean
  include_in_board_pinout?: boolean
  highlight_color?: string
  provides_power?: boolean
  provides_ground?: boolean
  provides_voltage?: string | number
}

expectTypesMatch<SourcePort, InferredSourcePort>(true)
