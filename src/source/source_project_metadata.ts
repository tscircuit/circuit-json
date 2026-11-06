import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import { timestamp } from "src/units"

/** A complete native project tied to the exact Circuit JSON it represents.
 * Consumers must verify both hashes and must not silently regenerate a project
 * if an advertised native artifact is missing, stale or corrupt.
 */
export const native_kicad_project_artifact = z.object({
  url: z
    .string()
    .url()
    .refine((value) => {
      try {
        const url = new URL(value)
        return url.protocol === "https:" && !url.username && !url.password
      } catch {
        return false
      }
    }, "Use HTTPS without embedded credentials"),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  circuit_json_sha256: z.string().regex(/^[a-f0-9]{64}$/),
  project_file: z
    .string()
    .endsWith(".kicad_pro")
    .refine(
      (value) =>
        !value.includes("\\") &&
        !value.includes(":") &&
        value.split("/").every((part) => part && part !== "." && part !== ".."),
      "Use a relative ZIP member path without traversal",
    ),
})
export type NativeKicadProjectArtifact = z.infer<
  typeof native_kicad_project_artifact
>

export interface SourceProjectMetadata {
  type: "source_project_metadata"
  name?: string
  software_used_string?: string
  project_url?: string
  source_filesystem_md5_hash?: string
  native_kicad_project?: NativeKicadProjectArtifact
  created_at?: string // ISO8601 timestamp
}

export const source_project_metadata = z.object({
  type: z.literal("source_project_metadata"),
  name: z.string().optional(),
  software_used_string: z.string().optional(),
  project_url: z.string().optional(),
  source_filesystem_md5_hash: z.string().optional(),
  native_kicad_project: native_kicad_project_artifact.optional(),
  created_at: timestamp.optional(),
})

export type InferredProjectMetadata = z.infer<typeof source_project_metadata>
expectTypesMatch<SourceProjectMetadata, InferredProjectMetadata>(true)
