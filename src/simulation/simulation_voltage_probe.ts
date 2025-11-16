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
    source_port_id: z.string().optional(),
    source_net_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    color: z.string().optional(),
  })
  .describe(
    "Defines a voltage probe for simulation, connected to a port or a net",
  )
  .refine(
    (data) => Boolean(data.source_port_id) !== Boolean(data.source_net_id),
    {
      message:
        "Exactly one of source_port_id or source_net_id must be provided to simulation_voltage_probe",
    },
  )

export type SimulationVoltageProbeInput = z.input<
  typeof simulation_voltage_probe
>
type InferredSimulationVoltageProbe = z.infer<typeof simulation_voltage_probe>

/**
 * Defines a voltage probe for simulation, connected to a port or a net.
 */
export interface SimulationVoltageProbe {
  type: "simulation_voltage_probe"
  simulation_voltage_probe_id: string
  source_component_id?: string
  source_port_id?: string
  source_net_id?: string
  subcircuit_id?: string
  color?: string
}

expectTypesMatch<SimulationVoltageProbe, InferredSimulationVoltageProbe>(true)
