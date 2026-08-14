import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_connector_standards = [
  "usb_c",
  "m2",
  "jst_sh",
  "jst_gh",
  "jst_zh",
  "jst_ph",
  "jst_xh",
  "jst_vh",
] as const

export type SourceSimpleConnectorStandard =
  (typeof source_simple_connector_standards)[number]

export const source_simple_connector = source_component_base.extend({
  ftype: z.literal("simple_connector"),
  standard: z.enum(source_simple_connector_standards).optional(),
  pin_count: z.number().int().positive().optional(),
})

export type SourceSimpleConnectorInput = z.input<typeof source_simple_connector>
type InferredSourceSimpleConnector = z.infer<typeof source_simple_connector>

/**
 * Defines a simple connector component
 */
export interface SourceSimpleConnector extends SourceComponentBase {
  ftype: "simple_connector"
  /** Connector interface or product family, such as usb_c, m2, or jst_ph */
  standard?: SourceSimpleConnectorStandard
  /** Number of electrical circuits in the connector */
  pin_count?: number
}

expectTypesMatch<SourceSimpleConnector, InferredSourceSimpleConnector>(true)
