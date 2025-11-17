import { z } from "zod"
import { point, type Point } from "../common/point"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { voltage } from "src/units"

export interface SchematicVoltageProbe {
  type: "schematic_voltage_probe"
  schematic_voltage_probe_id: string
  source_component_id?: string
  name?: string
  position: Point
  schematic_trace_id: string
  voltage?: number
  subcircuit_id?: string
  color?: string
}

export const schematic_voltage_probe = z
  .object({
    type: z.literal("schematic_voltage_probe"),
    schematic_voltage_probe_id: z.string(),
    source_component_id: z.string().optional(),
    name: z.string().optional(),
    position: point,
    schematic_trace_id: z.string(),
    voltage: voltage.optional(),
    subcircuit_id: z.string().optional(),
    color: z.string().optional(),
  })
  .describe("Defines a voltage probe measurement point on a schematic trace")

export type SchematicVoltageProbeInput = z.input<typeof schematic_voltage_probe>
type InferredSchematicVoltageProbe = z.infer<typeof schematic_voltage_probe>

expectTypesMatch<SchematicVoltageProbe, InferredSchematicVoltageProbe>(true)
