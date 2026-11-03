import { z } from "zod"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const copper_pour_clearance_object_type = z.enum([
  "smtpad",
  "plated_hole",
  "via",
  "trace",
  "copper_pour",
  "copper_region",
  "hole",
])

export type CopperPourClearanceObjectType = z.infer<
  typeof copper_pour_clearance_object_type
>

export const copper_pour_clearance_rule = z.object({
  clearance: length.pipe(z.number().finite().nonnegative()),
  source_net_ids: z.array(z.string()).optional(),
  object_types: z.array(copper_pour_clearance_object_type).optional(),
})

/** A clearance exception for foreign-net copper; the first matching rule wins. */
export interface CopperPourClearanceRule {
  clearance: Length
  /** Target nets. Omitted matches every net; an empty array matches none. */
  source_net_ids?: string[]
  /** Target copper objects. Omitted matches every kind. */
  object_types?: CopperPourClearanceObjectType[]
}

export const copper_pour_clearance_properties = z.object({
  clearance: length.pipe(z.number().finite().nonnegative()).optional(),
  clearance_rules: z.array(copper_pour_clearance_rule).optional(),
  is_static: z.boolean().optional(),
  board_edge_margin: length.pipe(z.number().finite().nonnegative()).optional(),
})

export interface CopperPourClearanceProperties {
  /** Default foreign-copper spacing in mm when regenerating this pour. */
  clearance?: Length
  /** Ordered, per-net and per-object exceptions to the default spacing. */
  clearance_rules?: CopperPourClearanceRule[]
  /** Authored fixed copper, whose geometry must not be regenerated or trimmed. */
  is_static?: boolean
  /** Explicit physical board-edge spacing in mm for regenerated copper. */
  board_edge_margin?: Length
}

expectTypesMatch<
  CopperPourClearanceRule,
  z.infer<typeof copper_pour_clearance_rule>
>(true)
expectTypesMatch<
  CopperPourClearanceProperties,
  z.infer<typeof copper_pour_clearance_properties>
>(true)
