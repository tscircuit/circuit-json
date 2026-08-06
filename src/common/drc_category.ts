import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const drc_category = z.enum([
  "netlist",
  "pin_specification",
  "placement",
  "routing",
])

export type DrcCategory = z.infer<typeof drc_category>

expectTypesMatch<
  DrcCategory,
  "netlist" | "pin_specification" | "placement" | "routing"
>(true)
