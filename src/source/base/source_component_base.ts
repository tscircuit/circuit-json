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
  display_value?: string
  are_pins_interchangeable?: boolean
  internally_connected_source_port_ids?: string[][]
  source_group_id?: string
  subcircuit_id?: string
  do_not_place: boolean
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
  display_value: z.string().optional(),
  are_pins_interchangeable: z.boolean().optional(),
  internally_connected_source_port_ids: z.array(z.array(z.string())).optional(),
  source_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  do_not_place: z.boolean().default(false),
})

type InferredSourceComponentBase = z.infer<typeof source_component_base>

expectTypesMatch<SourceComponentBase, InferredSourceComponentBase>(true)
