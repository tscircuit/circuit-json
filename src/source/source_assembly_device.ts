import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_assembly_device = z
  .object({
    type: z.literal("source_assembly_device"),
    source_assembly_device_id: z.string(),
    name: z.string().optional(),
  })
  .describe("Defines a product-level physical assembly in the source domain")

export type SourceAssemblyDeviceInput = z.input<typeof source_assembly_device>
type InferredSourceAssemblyDevice = z.infer<typeof source_assembly_device>

/**
 * Defines a product-level physical assembly in the source domain.
 */
export interface SourceAssemblyDevice {
  type: "source_assembly_device"
  source_assembly_device_id: string
  name?: string
}

expectTypesMatch<SourceAssemblyDevice, InferredSourceAssemblyDevice>(true)
