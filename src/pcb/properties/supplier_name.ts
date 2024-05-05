import { z } from "zod"

export const supplier_name = z.enum([
  "jlcpcb",
  "macrofab",
  "pcbway",
  "digikey",
  "mouser",
  "lcsc",
])

export type SupplierName = z.infer<typeof supplier_name>
