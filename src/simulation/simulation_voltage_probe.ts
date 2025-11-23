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
    source_port_ids: z.array(z.string()).optional(),
    source_net_ids: z.array(z.string()).optional(),
    subcircuit_id: z.string().optional(),
    color: z.string().optional(),
  })
  .describe(
    "Defines a voltage probe for simulation, connected to one or more ports/nets. If one port/net is provided, it's measured against ground. If two are provided, it's a differential measurement.",
  )
  .refine(
    (data) => !!data.source_port_ids?.length !== !!data.source_net_ids?.length,
    {
      message:
        "Exactly one of source_port_ids or source_net_ids must be provided to simulation_voltage_probe",
    },
  )

export type SimulationVoltageProbeInput = z.input<
  typeof simulation_voltage_probe
>
type InferredSimulationVoltageProbe = z.infer<typeof simulation_voltage_probe>

/**
 * Defines a voltage probe for simulation, connected to one or more ports/nets.
 * If one port/net is provided, it's measured against ground. If two are provided,
 * it's a differential measurement.
 */
export interface SimulationVoltageProbe {
  type: "simulation_voltage_probe"
  simulation_voltage_probe_id: string
  source_component_id?: string
  name?: string
  source_port_ids?: string[]
  source_net_ids?: string[]
  subcircuit_id?: string
  color?: string
}

expectTypesMatch<SimulationVoltageProbe, InferredSimulationVoltageProbe>(true)
