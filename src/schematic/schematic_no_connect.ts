import { z } from "zod"
import { type Point, point } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

/** Marks a schematic point as deliberately unconnected. */
export interface SchematicNoConnect {
  type: "schematic_no_connect"
  schematic_no_connect_id: string
  schematic_sheet_id?: string
  source_port_id?: string
  center: Point
  subcircuit_id?: string
}

export const schematic_no_connect = z
  .object({
    type: z.literal("schematic_no_connect"),
    schematic_no_connect_id: z.string(),
    schematic_sheet_id: z.string().optional(),
    source_port_id: z.string().optional(),
    center: point,
    subcircuit_id: z.string().optional(),
  })
  .describe("Marks a schematic point as deliberately unconnected")

export type SchematicNoConnectInput = z.input<typeof schematic_no_connect>
type InferredSchematicNoConnect = z.infer<typeof schematic_no_connect>

expectTypesMatch<SchematicNoConnect, InferredSchematicNoConnect>(true)
