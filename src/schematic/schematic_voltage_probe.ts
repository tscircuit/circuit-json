import { voltage } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import { type Point, point } from "../common/point"

export interface SchematicVoltageProbe {
  type: "schematic_voltage_probe"
  schematic_voltage_probe_id: string
  position: Point
  schematic_trace_id: string
  voltage?: number
  subcircuit_id?: string
}

export const schematic_voltage_probe = z
  .object({
    type: z.literal("schematic_voltage_probe"),
    schematic_voltage_probe_id: z.string(),
    position: point,
    schematic_trace_id: z.string(),
    voltage: voltage.optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a voltage probe measurement point on a schematic trace")

export type SchematicVoltageProbeInput = z.input<typeof schematic_voltage_probe>
type InferredSchematicVoltageProbe = z.infer<typeof schematic_voltage_probe>

expectTypesMatch<SchematicVoltageProbe, InferredSchematicVoltageProbe>(true)
