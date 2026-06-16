import { z } from "zod"
import { point, type Point } from "../common/point"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { current } from "src/units"
import {
  ninePointAnchor,
  type NinePointAnchor,
} from "src/common/NinePointAnchor"

export interface SchematicCurrentProbe {
  type: "schematic_current_probe"
  schematic_current_probe_id: string
  source_component_id?: string
  name?: string
  position: Point
  schematic_trace_id: string
  current?: number
  subcircuit_id?: string
  color?: string
  label_alignment?: NinePointAnchor
}

export const schematic_current_probe = z
  .object({
    type: z.literal("schematic_current_probe"),
    schematic_current_probe_id: z.string(),
    source_component_id: z.string().optional(),
    name: z.string().optional(),
    position: point,
    schematic_trace_id: z.string(),
    current: current.optional(),
    subcircuit_id: z.string().optional(),
    color: z.string().optional(),
    label_alignment: ninePointAnchor.optional(),
  })
  .describe("Defines a current probe measurement point on a schematic trace")

export type SchematicCurrentProbeInput = z.input<typeof schematic_current_probe>
type InferredSchematicCurrentProbe = z.infer<typeof schematic_current_probe>

expectTypesMatch<SchematicCurrentProbe, InferredSchematicCurrentProbe>(true)
