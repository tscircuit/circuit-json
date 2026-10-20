import { getZodPrefixedIdWithDefault } from "src/common"
import { type LayerRef, layer_ref } from "src/pcb/properties/layer_ref"
import {
  type SupplierName,
  supplier_name,
} from "src/pcb/properties/supplier_name"
import { type Length, length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

const positive_length = length.pipe(z.number().finite().positive())
const nonnegative_length = length.pipe(z.number().finite().nonnegative())
const positive_number = z.number().finite().positive()
const nonnegative_number = z.number().finite().nonnegative()

export const pcb_stackup_soldermask_layer = z.object({
  layer_type: z.literal("soldermask").describe("Soldermask layer"),
  thickness: positive_length.optional().describe("Soldermask thickness in mm"),
  relative_permittivity: positive_number
    .optional()
    .describe("Soldermask relative permittivity"),
})

/** A soldermask layer in the physical board stack. */
export interface PcbSoldermaskStackupLayer {
  layer_type: "soldermask"
  /** Soldermask thickness in mm. */
  thickness?: Length
  /** Relative permittivity of the soldermask. */
  relative_permittivity?: number
}
expectTypesMatch<
  PcbSoldermaskStackupLayer,
  z.infer<typeof pcb_stackup_soldermask_layer>
>(true)

export const pcb_stackup_copper_layer = z.object({
  layer_type: z.literal("copper").describe("Copper layer"),
  layer: layer_ref.describe("PCB copper layer name"),
  thickness: positive_length.describe("Copper thickness in mm"),
  conductivity: positive_number
    .optional()
    .describe(
      "Electrical conductivity in S/m; use 5.8e7 for annealed copper when omitted",
    ),
  copper_weight_oz: positive_number
    .optional()
    .describe("Copper weight in oz/ft²"),
  surface_roughness: nonnegative_length
    .optional()
    .describe("RMS copper surface roughness in mm"),
})

/** A conductive layer in the physical board stack. */
export interface PcbCopperStackupLayer {
  layer_type: "copper"
  /** PCB copper layer name, such as top, inner1, or bottom. */
  layer: LayerRef
  /** Copper thickness in mm. */
  thickness: Length
  /** Conductivity in S/m; consumers may use annealed copper 5.8e7 when omitted. */
  conductivity?: number
  /** Copper weight in oz/ft². */
  copper_weight_oz?: number
  /** RMS copper surface roughness in mm. */
  surface_roughness?: Length
}
expectTypesMatch<
  PcbCopperStackupLayer,
  z.infer<typeof pcb_stackup_copper_layer>
>(true)

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

export const pcb_stackup_layer = z.discriminatedUnion("layer_type", [
  pcb_stackup_soldermask_layer,
  pcb_stackup_copper_layer,
  pcb_stackup_dielectric_layer,
])

export type PcbStackupLayer =
  | PcbSoldermaskStackupLayer
  | PcbCopperStackupLayer
  | PcbDielectricStackupLayer
expectTypesMatch<PcbStackupLayer, z.infer<typeof pcb_stackup_layer>>(true)

export const pcb_stackup = z
  .object({
    type: z.literal("pcb_stackup").describe("PCB stackup element"),
    pcb_stackup_id:
      getZodPrefixedIdWithDefault("pcb_stackup").describe("Unique stackup ID"),
    pcb_board_id: z.string().describe("Board described by this stackup"),
    subcircuit_id: z.string().optional().describe("Owning subcircuit ID"),
    fabricator: supplier_name.optional().describe("Fabricator name"),
    stackup_template_code: z
      .string()
      .optional()
      .describe("Fabricator's public stackup template code"),
    fabricator_template_id: z
      .string()
      .optional()
      .describe("Fabricator's internal stackup template ID"),
    nominal_board_thickness: positive_length
      .optional()
      .describe("Nominal finished board thickness in mm"),
    plated_hole_copper_thickness: positive_length
      .optional()
      .describe("Via and plated-hole barrel copper thickness in mm"),
    layers: z
      .array(pcb_stackup_layer)
      .min(1)
      .describe("Resolved physical layers ordered from top to bottom"),
  })
  .describe("Resolved PCB construction and material data")

export type PcbStackupInput = z.input<typeof pcb_stackup>

/** Resolved physical PCB construction, ordered from top to bottom. */
export interface PcbStackup {
  type: "pcb_stackup"
  pcb_stackup_id: string
  /** Board described by this stackup. */
  pcb_board_id: string
  /** Owning subcircuit, if any. */
  subcircuit_id?: string
  /** Fabricator that supplied the template. */
  fabricator?: SupplierName
  /** Fabricator's public stackup template code. */
  stackup_template_code?: string
  /** Fabricator's internal stackup template ID. */
  fabricator_template_id?: string
  /** Nominal finished board thickness in mm. */
  nominal_board_thickness?: Length
  /** Via and plated-hole barrel copper thickness in mm. */
  plated_hole_copper_thickness?: Length
  /** Resolved physical layers ordered from top to bottom. */
  layers: PcbStackupLayer[]
}
expectTypesMatch<PcbStackup, z.infer<typeof pcb_stackup>>(true)
