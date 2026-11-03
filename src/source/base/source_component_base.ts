import {
  supplier_name,
  type SupplierName,
} from "src/pcb/properties/supplier_name"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export interface SourceComponentBase {
  type: "source_component"
  ftype?: string
  source_component_id: string
  name: string
  manufacturer_part_number?: string
  supplier_part_numbers?: Partial<Record<SupplierName, string[]>>
  /** Product listing URLs, including suppliers outside the parts engine. */
  supplier_part_urls?: string[]
  display_value?: string
  display_name?: string
  are_pins_interchangeable?: boolean
  internally_connected_source_port_ids?: string[][]
  source_group_id?: string
  subcircuit_id?: string
  /** Physical assembly parent; independent of electrical group membership. */
  parent_source_component_id?: string
  /** Number required per parent assembly; omission means one. */
  bom_quantity?: number
}

export const source_component_base = z.object({
  type: z.literal("source_component"),
  ftype: z.string().optional(),
  source_component_id: z.string(),
  name: z.string(),
  manufacturer_part_number: z.string().optional(),
  supplier_part_numbers: z
    .record(supplier_name, z.array(z.string()))
    .optional(),
  supplier_part_urls: z
    .array(
      z
        .string()
        .url()
        .refine((value) => /^https?:\/\//i.test(value), {
          message: "Supplier product URLs must use HTTP or HTTPS",
        }),
    )
    .optional(),
  display_value: z.string().optional(),
  display_name: z.string().optional(),
  are_pins_interchangeable: z.boolean().optional(),
  internally_connected_source_port_ids: z.array(z.array(z.string())).optional(),
  source_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  parent_source_component_id: z.string().optional(),
  bom_quantity: z.number().int().positive().finite().optional(),
})

type InferredSourceComponentBase = z.infer<typeof source_component_base>

expectTypesMatch<SourceComponentBase, InferredSourceComponentBase>(true)
