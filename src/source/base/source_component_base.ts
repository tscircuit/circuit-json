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
  display_name?: string
  are_pins_interchangeable?: boolean
  internally_connected_source_port_ids?: string[][]
  source_group_id?: string
  subcircuit_id?: string

  /** Selector for the pin/pad this component should be placed near */
  place_near_selector?: string
  /** Resolved source_port_id of the target pin */
  place_near_port_id?: string
  /** source_port_id of this component's pad that should face the target */
  facing_pad_port_id?: string
  /** Max center-to-center distance to the target pin (mm). Default: 5mm */
  place_near_max_distance?: number
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
  display_name: z.string().optional(),
  are_pins_interchangeable: z.boolean().optional(),
  internally_connected_source_port_ids: z.array(z.array(z.string())).optional(),
  source_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  place_near_selector: z.string().optional(),
  place_near_port_id: z.string().optional(),
  facing_pad_port_id: z.string().optional(),
  place_near_max_distance: z.number().optional(),
})

type InferredSourceComponentBase = z.infer<typeof source_component_base>

expectTypesMatch<SourceComponentBase, InferredSourceComponentBase>(true)
