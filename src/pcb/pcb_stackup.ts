import { getZodPrefixedIdWithDefault } from "src/common"
import { type LayerRef, layer_ref } from "src/pcb/properties/layer_ref"
import { type Length, length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

const positive_length = length.pipe(z.number().finite().positive())
const nonnegative_length = length.pipe(z.number().finite().nonnegative())
const positive_number = z.number().finite().positive()
const nonnegative_number = z.number().finite().nonnegative()

export const pcb_stackup_soldermask_layer = z.object({
  layer_type: z.literal("soldermask").describe("Soldermask layer"),
  thickness: positive_length
    .optional()
    .describe("Soldermask thickness in mm, omitted when unknown"),
  relative_permittivity: positive_number
    .optional()
    .describe("Soldermask relative permittivity"),
})

/** A soldermask layer in the physical board stack. */
export interface PcbSoldermaskStackupLayer {
  layer_type: "soldermask"
  /** Soldermask thickness in mm, omitted when unknown. */
  thickness?: Length
  /** Soldermask relative permittivity. */
  relative_permittivity?: number
}
expectTypesMatch<
  PcbSoldermaskStackupLayer,
  z.infer<typeof pcb_stackup_soldermask_layer>
>(true)

export const pcb_stackup_copper_layer = z.object({
  layer_type: z.literal("copper").describe("Copper layer"),
  layer: layer_ref.describe("PCB copper layer, such as top, inner1 or bottom"),
  thickness: positive_length.describe("Copper thickness in mm"),
  electrical_conductivity_s_per_m: positive_number
    .optional()
    .describe(
      "Electrical conductivity in S/m, consumers may assume 5.8e7 (annealed copper) when omitted",
    ),
  rms_surface_roughness: nonnegative_length
    .optional()
    .describe("RMS copper surface roughness in mm"),
})

/** A copper layer in the physical board stack. */
export interface PcbCopperStackupLayer {
  layer_type: "copper"
  /** PCB copper layer, such as top, inner1 or bottom. */
  layer: LayerRef
  /** Copper thickness in mm. */
  thickness: Length
  /** Electrical conductivity in S/m, consumers may assume 5.8e7 (annealed copper) when omitted. */
  electrical_conductivity_s_per_m?: number
  /** RMS copper surface roughness in mm. */
  rms_surface_roughness?: Length
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
  material_name: z
    .string()
    .optional()
    .describe("Fabricator material name, such as FR-4 or 7628"),
  thickness: positive_length.describe("Dielectric thickness in mm"),
  relative_permittivity: positive_number
    .optional()
    .describe("Dielectric relative permittivity, Dk"),
  loss_tangent: nonnegative_number
    .optional()
    .describe("Dielectric loss tangent, Df"),
  dielectric_properties_frequency_hz: positive_number
    .optional()
    .describe(
      "Frequency in Hz at which relative_permittivity and loss_tangent were measured",
    ),
})

/** An insulating layer in the physical board stack. */
export interface PcbDielectricStackupLayer {
  layer_type: "dielectric"
  /** Core or prepreg construction. */
  dielectric_type?: "core" | "prepreg"
  /** Fabricator material name, such as FR-4 or 7628. */
  material_name?: string
  /** Dielectric thickness in mm. */
  thickness: Length
  /** Dielectric relative permittivity, Dk. */
  relative_permittivity?: number
  /** Dielectric loss tangent, Df. */
  loss_tangent?: number
  /** Frequency in Hz at which relative_permittivity and loss_tangent were measured. */
  dielectric_properties_frequency_hz?: number
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
    type: z.literal("pcb_stackup"),
    pcb_stackup_id: getZodPrefixedIdWithDefault("pcb_stackup"),
    pcb_board_id: z.string().describe("Board described by this stackup"),
    subcircuit_id: z.string().optional(),
    plated_hole_copper_thickness: positive_length
      .optional()
      .describe("Copper thickness of plated hole and via barrel walls in mm"),
    layers: z
      .array(pcb_stackup_layer)
      .min(1)
      .describe("Physical layers ordered from top to bottom"),
  })
  .describe("Physical layer construction and material data for a PCB board")

export type PcbStackupInput = z.input<typeof pcb_stackup>

/** Physical layer construction and material data for a PCB board. */
export interface PcbStackup {
  type: "pcb_stackup"
  pcb_stackup_id: string
  /** Board described by this stackup. */
  pcb_board_id: string
  subcircuit_id?: string
  /** Copper thickness of plated hole and via barrel walls in mm. */
  plated_hole_copper_thickness?: Length
  /** Physical layers ordered from top to bottom. */
  layers: PcbStackupLayer[]
}
expectTypesMatch<PcbStackup, z.infer<typeof pcb_stackup>>(true)
