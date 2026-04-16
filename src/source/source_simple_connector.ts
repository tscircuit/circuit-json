import {
  source_component_base,
  type SourceComponentBase,
} from "src/source/base/source_component_base"
import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_simple_connector = source_component_base.extend({
  ftype: z.literal("simple_connector"),
  standard: z.enum(["usb_c", "m2"]).optional(),
})

export type SourceSimpleConnectorInput = z.input<typeof source_simple_connector>
type InferredSourceSimpleConnector = z.infer<typeof source_simple_connector>

/**
 * Defines a simple connector component
 */
export interface SourceSimpleConnector extends SourceComponentBase {
  ftype: "simple_connector"
  standard?: "usb_c" | "m2"
}

expectTypesMatch<SourceSimpleConnector, InferredSourceSimpleConnector>(true)
