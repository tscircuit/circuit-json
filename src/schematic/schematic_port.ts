import { z } from "zod"
import { distance } from "../units"
import { point } from "../common"

export const schematic_port = z
  .object({
    type: z.literal("schematic_port"),
    schematic_port_id: z.string(),
    source_port_id: z.string(),
    schematic_component_id: z.string().optional(),
    center: point,
    facing_direction: z.enum(["up", "down", "left", "right"]).optional(),
  })
  .describe("Defines a port on a schematic component")

export type SchematicPortInput = z.input<typeof schematic_port>
export type SchematicPort = z.infer<typeof schematic_port>
