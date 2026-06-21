import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const simulation_current_probe = z
  .object({
    type: z.literal("simulation_current_probe"),
    simulation_current_probe_id: getZodPrefixedIdWithDefault(
      "simulation_current_probe",
    ),
    source_component_id: z.string().optional(),
    name: z.string().optional(),
    positive_source_port_id: z.string().optional(),
    negative_source_port_id: z.string().optional(),
    positive_source_net_id: z.string().optional(),
    negative_source_net_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    color: z.string().optional(),
    display_name: z.string().optional(),
    display_center_value: z.number().optional(),
    display_center_offset_divs: z.number().optional(),
    amps_per_div: z.number().optional(),
  })
  .describe(
    "Defines a current probe for simulation. It measures current flowing from the positive endpoint to the negative endpoint.",
  )
  .superRefine((data, ctx) => {
    const hasPositivePort = !!data.positive_source_port_id
    const hasNegativePort = !!data.negative_source_port_id
    const hasPositiveNet = !!data.positive_source_net_id
    const hasNegativeNet = !!data.negative_source_net_id
    const hasPorts = hasPositivePort || hasNegativePort
    const hasNets = hasPositiveNet || hasNegativeNet

    if (hasPorts && hasNets) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cannot mix port and net connections in a current probe.",
      })
      return
    }

    if (hasPorts) {
      if (!hasPositivePort || !hasNegativePort) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Current probe using source ports requires both positive_source_port_id and negative_source_port_id.",
        })
      }
      return
    }

    if (hasNets) {
      if (!hasPositiveNet || !hasNegativeNet) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Current probe using source nets requires both positive_source_net_id and negative_source_net_id.",
        })
      }
      return
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "A current probe must have either positive/negative source port ids or positive/negative source net ids.",
    })
  })

export type SimulationCurrentProbeInput = z.input<
  typeof simulation_current_probe
>
type InferredSimulationCurrentProbe = z.infer<typeof simulation_current_probe>

/**
 * Defines a current probe for simulation. It measures current flowing from the
 * positive endpoint to the negative endpoint.
 *
 * Scope display fields map measured amps into display divisions using
 * display_div = display_center_offset_divs + (raw_current - display_center_value) / amps_per_div.
 * They describe visual scaling only, not the measured signal itself.
 */
export interface SimulationCurrentProbe {
  type: "simulation_current_probe"
  simulation_current_probe_id: string
  source_component_id?: string
  name?: string
  positive_source_port_id?: string
  negative_source_port_id?: string
  positive_source_net_id?: string
  negative_source_net_id?: string
  subcircuit_id?: string
  color?: string
  display_name?: string
  display_center_value?: number
  display_center_offset_divs?: number
  amps_per_div?: number
}

expectTypesMatch<SimulationCurrentProbe, InferredSimulationCurrentProbe>(true)
