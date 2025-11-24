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
    probe_type: z.enum(["voltage", "differential_voltage"]).default("voltage"),
    signal_input_source_port_id: z.string().optional(),
    signal_input_source_net_id: z.string().optional(),
    reference_input_source_port_id: z.string().optional(),
    reference_input_source_net_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    color: z.string().optional(),
  })
  .describe(
    "Defines a voltage probe for simulation. A 'voltage' probe_type measures against ground. A 'differential_voltage' probe_type measures between two points.",
  )
  .superRefine((data, ctx) => {
    if (data.probe_type === "voltage") {
      if (
        data.reference_input_source_port_id ||
        data.reference_input_source_net_id
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "A single-ended voltage probe cannot have a reference input.",
        })
      }
      if (
        !!data.signal_input_source_port_id === !!data.signal_input_source_net_id
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "A single-ended voltage probe must have exactly one of signal_input_source_port_id or signal_input_source_net_id.",
        })
      }
    } else if (data.probe_type === "differential_voltage") {
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
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Differential probe requires either two port ids or two net ids.",
        })
      }
    }
  })

export type SimulationVoltageProbeInput = z.input<
  typeof simulation_voltage_probe
>
type InferredSimulationVoltageProbe = z.infer<typeof simulation_voltage_probe>

/**
 * Defines a voltage probe for simulation.
 * A 'voltage' probe_type measures against ground. A 'differential_voltage'
 * probe_type measures between two points.
 */
export interface SimulationVoltageProbe {
  type: "simulation_voltage_probe"
  simulation_voltage_probe_id: string
  source_component_id?: string
  name?: string
  probe_type: "voltage" | "differential_voltage"
  signal_input_source_port_id?: string
  signal_input_source_net_id?: string
  reference_input_source_port_id?: string
  reference_input_source_net_id?: string
  subcircuit_id?: string
  color?: string
}

expectTypesMatch<SimulationVoltageProbe, InferredSimulationVoltageProbe>(true)
