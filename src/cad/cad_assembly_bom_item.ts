import { z } from "zod"
import {
  supplier_name,
  type SupplierName,
} from "../pcb/properties/supplier_name"
import { expectTypesMatch } from "../utils/expect-types-match"

export const cad_assembly_bom_item = z
  .object({
    type: z.literal("cad_assembly_bom_item"),
    cad_assembly_bom_item_id: z.string().min(1),
    name: z.string().trim().min(1),
    quantity: z.number().int().positive().safe(),
    parent_cad_assembly_bom_item_id: z.string().min(1).optional(),
    source_component_id: z.string().min(1).optional(),
    cad_component_ids: z.array(z.string().min(1)).optional(),
    supplier_part_numbers: z
      .record(supplier_name, z.array(z.string()))
      .optional(),
    purchase_urls: z
      .array(
        z
          .string()
          .url()
          .refine((value) => /^https?:\/\//i.test(value), {
            message: "Purchase URLs must use HTTP or HTTPS",
          }),
      )
      .optional(),
  })
  .describe(
    "A bill-of-materials entry for a physical assembly, with optional geometry and purchasing references.",
  )

/** A bill-of-materials entry for a physical assembly. */
export interface CadAssemblyBomItem {
  type: "cad_assembly_bom_item"
  cad_assembly_bom_item_id: string
  /** Human-readable item or subassembly name. */
  name: string
  /** Individual item count per parent assembly, or per root build when unparented. */
  quantity: number
  /** Parent BOM entry for nesting; independent of electrical group membership. */
  parent_cad_assembly_bom_item_id?: string
  /** Optional link to the authored component. BOM-only materials may omit it. */
  source_component_id?: string
  /** Optional associated geometry; its count does not determine the quantity. */
  cad_component_ids?: string[]
  /** Existing supplier identifiers for parts-engine lookup. */
  supplier_part_numbers?: Partial<Record<SupplierName, string[]>>
  /** Optional product listings, including stores outside the parts engine. */
  purchase_urls?: string[]
}

export type CadAssemblyBomItemInput = z.input<typeof cad_assembly_bom_item>
expectTypesMatch<CadAssemblyBomItem, z.infer<typeof cad_assembly_bom_item>>(
  true,
)
