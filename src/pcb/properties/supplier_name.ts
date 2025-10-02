import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const supplier_name = z.enum([
  "jlcpcb",
  "macrofab",
  "pcbway",
  "digikey",
  "mouser",
  "lcsc",
])

type InferredSupplierName = z.infer<typeof supplier_name>

export type SupplierName =
  | "jlcpcb"
  | "macrofab"
  | "pcbway"
  | "digikey"
  | "mouser"
  | "lcsc"

expectTypesMatch<SupplierName, InferredSupplierName>(true)
