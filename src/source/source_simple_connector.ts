import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "./base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_connector = source_component_base.extend({
  ftype: z.literal("simple_connector"),

  connector_standard: z
    .enum(["usb_c", "m2"])
    .optional()
    .describe(
      "The connector standard (e.g., 'usb_c', 'm2'). When specified, enables automatic pin mapping and parts engine lookup.",
    ),

  pin_count: z
    .number()
    .optional()
    .describe("Number of contacts/pins on the connector"),

  gender: z
    .enum(["male", "female"])
    .optional()
    .describe("Gender of the connector"),
})

export interface SourceSimpleConnector extends SourceComponentBase {
  ftype: "simple_connector"
  connector_standard?: "usb_c" | "m2"
  pin_count?: number
  gender?: "male" | "female"
}

export type SourceSimpleConnectorInput = z.input<typeof source_simple_connector>
type InferredSourceSimpleConnector = z.infer<typeof source_simple_connector>

expectTypesMatch<SourceSimpleConnector, InferredSourceSimpleConnector>(true)
