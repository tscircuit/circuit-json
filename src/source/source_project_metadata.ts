import { z } from "zod"
import {
  source_component_base,
  type SourceComponentBase,
} from "./base/source_component_base"
import { expectTypesMatch } from "src/utils/expect-types-match"

export interface SourceProjectMetadata extends SourceComponentBase {
  ftype: "source_project_metadata"
  created_at?: string
}

export const source_project_metadata = source_component_base.extend({
  ftype: z.literal("source_project_metadata"),
  created_at: z.string().datetime().optional(),
})

type InferredSourceProjectMetadata = z.infer<typeof source_project_metadata>
expectTypesMatch<SourceProjectMetadata, InferredSourceProjectMetadata>(true)
