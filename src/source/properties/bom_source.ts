import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** A purchasing option, independent of a live price or stock quote. */
export interface BomSource {
  supplier_name: string
  supplier_part_number?: string
  url?: string
  /** Number of individual items in one purchasable pack. Omission means one. */
  pack_quantity?: number
}

export const bom_source = z
  .object({
    supplier_name: z.string().trim().min(1),
    supplier_part_number: z.string().trim().min(1).optional(),
    url: z
      .string()
      .url()
      .refine((value) => /^https?:\/\//i.test(value), {
        message: "BOM product URLs must use HTTP or HTTPS",
      })
      .optional(),
    pack_quantity: z.number().int().positive().finite().optional(),
  })
  .refine((source) => source.url || source.supplier_part_number, {
    message: "A BOM source requires a product URL or supplier part number",
  })

expectTypesMatch<BomSource, z.infer<typeof bom_source>>(true)
