import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const simulation_voltage_probe = z
  .object({
    type: z.literal("simulation_voltage_probe"),
    simulation_voltage_probe_id: getZodPrefixedIdWithDefault(
      "simulation_voltage_probe",
    ),
    source_component_id: z.string().optional(),
    name: z.string().optional(),
    signal_input_source_port_id: z.string().optional(),
    signal_input_source_net_id: z.string().optional(),
    reference_input_source_port_id: z.string().optional(),
    reference_input_source_net_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    color: z.string().optional(),
  })
  .describe(
    "Defines a voltage probe for simulation. If a reference input is not provided, it measures against ground. If a reference input is provided, it measures the differential voltage between two points.",
  )
  .superRefine((data, ctx) => {
    const is_differential =
      data.reference_input_source_port_id || data.reference_input_source_net_id

    if (is_differential) {
      const has_ports =
        !!data.signal_input_source_port_id ||
        !!data.reference_input_source_port_id
      const has_nets =
        !!data.signal_input_source_net_id ||
        !!data.reference_input_source_net_id

      if (has_ports && has_nets) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Cannot mix port and net connections in a differential probe.",
        })
      } else if (has_ports) {
        if (
          !data.signal_input_source_port_id ||
          !data.reference_input_source_port_id
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Differential port probe requires both signal_input_source_port_id and reference_input_source_port_id.",
          })
        }
      } else if (has_nets) {
        if (
          !data.signal_input_source_net_id ||
          !data.reference_input_source_net_id
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Differential net probe requires both signal_input_source_net_id and reference_input_source_net_id.",
          })
        }
      }
    } else {
      // Single-ended probe
      if (
        !!data.signal_input_source_port_id === !!data.signal_input_source_net_id
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "A voltage probe must have exactly one of signal_input_source_port_id or signal_input_source_net_id.",
        })
      }
    }
  })

export type SimulationVoltageProbeInput = z.input<
  typeof simulation_voltage_probe
>
type InferredSimulationVoltageProbe = z.infer<typeof simulation_voltage_probe>

/**
 * Defines a voltage probe for simulation. If a reference input is not provided,
 * it measures against ground. If a reference input is provided, it measures
 * the differential voltage between two points.
 */
export interface SimulationVoltageProbe {
  type: "simulation_voltage_probe"
  simulation_voltage_probe_id: string
  source_component_id?: string
  name?: string
  signal_input_source_port_id?: string
  signal_input_source_net_id?: string
  reference_input_source_port_id?: string
  reference_input_source_net_id?: string
  subcircuit_id?: string
  color?: string
}

expectTypesMatch<SimulationVoltageProbe, InferredSimulationVoltageProbe>(true)
