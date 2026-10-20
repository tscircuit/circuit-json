import { type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import {
  nonnegative_number,
  positive_length,
  positive_number,
} from "./validators"

export const pcb_stackup_dielectric_layer = z.object({
  layer_type: z.literal("dielectric").describe("Dielectric layer"),
  dielectric_type: z
    .enum(["core", "prepreg"])
    .optional()
    .describe("Core or prepreg construction"),
  material_name: z.string().optional().describe("Fabricator material name"),
  thickness: positive_length.describe("Dielectric thickness in mm"),
  relative_permittivity: positive_number
    .optional()
    .describe("Dielectric relative permittivity"),
  loss_tangent: nonnegative_number
    .optional()
    .describe("Dielectric loss tangent"),
  relative_permittivity_frequency: positive_number
    .optional()
    .describe("Frequency in Hz at which dielectric properties are specified"),
})

/** An insulating layer in the physical board stack. */
export interface PcbDielectricStackupLayer {
  layer_type: "dielectric"
  /** Core or prepreg construction. */
  dielectric_type?: "core" | "prepreg"
  /** Fabricator material name. */
  material_name?: string
  /** Dielectric thickness in mm. */
  thickness: Length
  /** Dielectric relative permittivity. */
  relative_permittivity?: number
  /** Dielectric loss tangent. */
  loss_tangent?: number
  /** Frequency in Hz at which dielectric properties are specified. */
  relative_permittivity_frequency?: number
}
expectTypesMatch<
  PcbDielectricStackupLayer,
  z.infer<typeof pcb_stackup_dielectric_layer>
>(true)
