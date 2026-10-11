import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

/** Datasheet information for a manufacturer part number, supplied with Circuit JSON. */
export interface SourceDatasheet {
  type: "source_datasheet"
  source_datasheet_id: string
  manufacturer_part_number: string
  datasheet_pdf_urls: string[]
  description?: string
}

export const source_datasheet = z.object({
  type: z.literal("source_datasheet"),
  source_datasheet_id: z.string(),
  manufacturer_part_number: z.string(),
  datasheet_pdf_urls: z.array(z.string().url()),
  description: z.string().optional(),
})

type InferredSourceDatasheet = z.infer<typeof source_datasheet>
expectTypesMatch<SourceDatasheet, InferredSourceDatasheet>(true)
