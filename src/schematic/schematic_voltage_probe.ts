import { z } from "zod"
import { point, type Point } from "../common/point"
import { expectTypesMatch } from "src/utils/expect-types-match"

export interface SchematicVoltageProbe {
  type: "schematic_voltage_probe"
  schematic_voltage_probe_id: string
  position: Point
  schematic_trace_id: string
}

export const schematic_voltage_probe = z
  .object({
    type: z.literal("schematic_voltage_probe"),
    schematic_voltage_probe_id: z.string(),
    position: point,
    schematic_trace_id: z.string(),
  })
  .describe("Defines a voltage probe measurement point on a schematic trace")

export type SchematicVoltageProbeInput = z.input<typeof schematic_voltage_probe>
type InferredSchematicVoltageProbe = z.infer<typeof schematic_voltage_probe>

expectTypesMatch<SchematicVoltageProbe, InferredSchematicVoltageProbe>(true)
