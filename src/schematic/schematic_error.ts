import { z } from "zod"

export const schematic_error = z
  .object({
    schematic_error_id: z.string(),
    type: z.literal("schematic_error"),
    // eventually each error type should be broken out into a dir of files
    error_type: z.literal("schematic_port_not_found"),
    message: z.string(),
  })
  .describe("Defines a schematic error on the schematic")

export type SchematicErrorInput = z.input<typeof schematic_error>
export type SchematicError = z.infer<typeof schematic_error>
