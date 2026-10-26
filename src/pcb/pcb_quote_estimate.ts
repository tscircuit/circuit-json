import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

const cost = z.number().finite().nonnegative()

/** Itemized costs for the entire order quantity, in the declared currency.
 * Omitted costs are unknown; zero explicitly means no charge. Manufacturing
 * costs include predicted post-review charges. Shipping, duties, tax and
 * brokerage are separate. Discount is a positive deduction from the total.
 */
export const pcb_quote_estimate = z
  .object({
    type: z.literal("pcb_quote_estimate"),
    pcb_quote_estimate_id: getZodPrefixedIdWithDefault("pcb_quote_estimate"),
    pcb_board_id: z.string(),
    supplier_name: z.string(),
    currency: z.string().regex(/^[A-Z]{3}$/),
    quantity: z.number().int().positive(),
    assembled_quantity: z.number().int().nonnegative().optional(),
    estimated_at: z.string().datetime({ offset: true }),
    expires_at: z.string().datetime({ offset: true }).optional(),
    pricing_model_version: z.string().optional(),
    quote_request_hash: z
      .string()
      .regex(/^[a-f0-9]{64}$/)
      .optional(),
    destination_country_code: z
      .string()
      .regex(/^[A-Z]{2}$/)
      .optional(),
    shipping_service: z.string().optional(),
    is_manufacturing_cost_complete: z.boolean(),
    is_landed_cost_complete: z.boolean(),
    pcb_fabrication_cost: cost.optional(),
    pcb_setup_cost: cost.optional(),
    assembly_setup_cost: cost.optional(),
    assembly_placement_cost: cost.optional(),
    assembly_labor_cost: cost.optional(),
    stencil_cost: cost.optional(),
    packaging_cost: cost.optional(),
    parts_placement_confirmation_cost: cost.optional(),
    special_components_cost: cost.optional(),
    expedited_build_cost: cost.optional(),
    components_cost: cost.optional(),
    extended_component_loading_cost: cost.optional(),
    component_attrition_cost: cost.optional(),
    component_baking_cost: cost.optional(),
    hand_soldering_cost: cost.optional(),
    x_ray_inspection_cost: cost.optional(),
    small_hole_cost: cost.optional(),
    via_in_pad_cost: cost.optional(),
    via_filling_cost: cost.optional(),
    kelvin_test_cost: cost.optional(),
    impedance_control_cost: cost.optional(),
    surface_finish_cost: cost.optional(),
    panelization_cost: cost.optional(),
    engineering_cost: cost.optional(),
    other_manufacturing_cost: cost.optional(),
    shipping_cost: cost.optional(),
    duties_cost: cost.optional(),
    import_tax_cost: cost.optional(),
    customs_duties_and_taxes_cost: cost.optional(),
    tax_cost: cost.optional(),
    brokerage_cost: cost.optional(),
    discount_cost: cost.optional(),
    manufacturing_cost: cost.optional(),
    total_cost: cost.optional(),
    unit_cost: cost.optional(),
    assumptions: z.array(z.string()).optional(),
    warnings: z.array(z.string()).optional(),
  })
  .superRefine((quote, ctx) => {
    const issue = (message: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, message })
    if (
      quote.customs_duties_and_taxes_cost !== undefined &&
      (quote.duties_cost !== undefined || quote.import_tax_cost !== undefined)
    )
      issue(
        "Combined customs costs cannot also contain itemized duty/import tax",
      )
    if (
      quote.assembled_quantity !== undefined &&
      quote.assembled_quantity > quote.quantity
    )
      issue("assembled_quantity exceeds quantity")
    if (quote.is_landed_cost_complete && !quote.is_manufacturing_cost_complete)
      issue("Landed costs require complete manufacturing costs")
    if (
      !quote.is_landed_cost_complete &&
      (quote.total_cost !== undefined || quote.unit_cost !== undefined)
    )
      issue("Incomplete landed estimates cannot have total_cost or unit_cost")
    if (
      quote.expires_at &&
      Date.parse(quote.expires_at) <= Date.parse(quote.estimated_at)
    )
      issue("expires_at must follow estimated_at")
    if (
      quote.is_landed_cost_complete &&
      (!quote.destination_country_code ||
        !quote.shipping_service ||
        quote.total_cost === undefined)
    )
      issue(
        "Complete landed estimates require destination, shipping service and total_cost",
      )
  })
  .describe(
    "An itemized manufacturing quote estimate, including separately estimated delivery and import costs",
  )

/** Itemized estimate for an entire PCB order; all costs use currency major units.
 * Undefined costs are unknown, never implicitly zero. manufacturing_cost is the
 * sum of manufacturing attributes before discounts. total_cost adds delivery,
 * duties, tax and brokerage and subtracts discount_cost. unit_cost is total_cost
 * divided by quantity. Do not emit total_cost for an incomplete landed estimate.
 * Assembly costs apply to assembled_quantity; quantity is fabricated PCB count.
 * Destination is the shipping destination, not nationality or IP geolocation.
 */
export interface PcbQuoteEstimate {
  type: "pcb_quote_estimate"
  pcb_quote_estimate_id: string
  pcb_board_id: string
  supplier_name: string
  currency: string
  quantity: number
  assembled_quantity?: number
  estimated_at: string
  expires_at?: string
  pricing_model_version?: string
  quote_request_hash?: string
  destination_country_code?: string
  shipping_service?: string
  is_manufacturing_cost_complete: boolean
  is_landed_cost_complete: boolean
  pcb_fabrication_cost?: number
  pcb_setup_cost?: number
  assembly_setup_cost?: number
  assembly_placement_cost?: number
  assembly_labor_cost?: number
  stencil_cost?: number
  packaging_cost?: number
  parts_placement_confirmation_cost?: number
  special_components_cost?: number
  expedited_build_cost?: number
  components_cost?: number
  extended_component_loading_cost?: number
  component_attrition_cost?: number
  component_baking_cost?: number
  hand_soldering_cost?: number
  x_ray_inspection_cost?: number
  small_hole_cost?: number
  via_in_pad_cost?: number
  via_filling_cost?: number
  kelvin_test_cost?: number
  impedance_control_cost?: number
  surface_finish_cost?: number
  panelization_cost?: number
  engineering_cost?: number
  other_manufacturing_cost?: number
  shipping_cost?: number
  duties_cost?: number
  import_tax_cost?: number
  /** Use a supplier-combined import charge only when duty/import tax cannot be separated. */
  customs_duties_and_taxes_cost?: number
  /** Sales tax or domestic VAT, excluding import taxes. */
  tax_cost?: number
  brokerage_cost?: number
  discount_cost?: number
  manufacturing_cost?: number
  total_cost?: number
  unit_cost?: number
  assumptions?: string[]
  warnings?: string[]
}

export type PcbQuoteEstimateInput = z.input<typeof pcb_quote_estimate>
expectTypesMatch<PcbQuoteEstimate, z.infer<typeof pcb_quote_estimate>>(true)
