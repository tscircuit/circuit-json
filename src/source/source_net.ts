import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_net = z.object({
  type: z.literal("source_net"),
  source_net_id: z.string(),
  name: z.string(),
  member_source_group_ids: z.array(z.string()),
  is_power: z.boolean().optional(),
  is_ground: z.boolean().optional(),
  is_digital_signal: z.boolean().optional(),
  is_analog_signal: z.boolean().optional(),
  is_positive_voltage_source: z.boolean().optional(),
  trace_width: z.number().optional(),
  min_trace_clearance: z.number().finite().nonnegative().optional(),
  subcircuit_id: z.string().optional(),
  subcircuit_connectivity_map_key: z.string().optional(),
  metadata: z
    .object({
      kicad_net: z
        .object({ name: z.string(), circuit_json_name: z.string() })
        .optional(),
    })
    .optional(),
})

export type SourceNetInput = z.input<typeof source_net>
type InferredSourceNet = z.infer<typeof source_net>

export interface SourceNet {
  type: "source_net"
  source_net_id: string
  name: string
  member_source_group_ids: string[]
  is_power?: boolean
  is_ground?: boolean
  is_digital_signal?: boolean
  is_analog_signal?: boolean
  is_positive_voltage_source?: boolean
  trace_width?: number
  /**
   * Minimum edge-to-edge clearance in mm from a trace to a different net's
   * trace, pad, or via copper on a shared layer. Use the largest applicable
   * existing minimum or requirement from either net.
   */
  min_trace_clearance?: number
  subcircuit_id?: string
  subcircuit_connectivity_map_key?: string
  metadata?: {
    /** Original KiCad name and its imported alias, for faithful re-export. */
    kicad_net?: { name: string; circuit_json_name: string }
  }
}

expectTypesMatch<SourceNet, InferredSourceNet>(true)
