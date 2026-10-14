import { z } from "zod"
import {
  pcb_noise_count,
  pcb_noise_json,
  pcb_noise_name,
  pcb_noise_sha256,
  simulation_pcb_noise_asset,
} from "./simulation_pcb_noise_shared"

const digest = z
  .object({ sha256: pcb_noise_sha256, canonical_sha256: pcb_noise_sha256 })
  .strict()

/** Full resolved inputs live in the manifest; original-byte and nested canonical hashes remain distinct. */
export const simulation_pcb_noise_manifest_json = z
  .object({
    format: z.literal("simulation_pcb_noise_manifest_json_v1"),
    canonicalization: z.literal("sorted-json-significant-12-v1"),
    run_id: pcb_noise_name,
    experiment_id: pcb_noise_name,
    configuration_id: pcb_noise_name,
    board_id: pcb_noise_name,
    inputs: z
      .object({
        geometry: digest,
        configuration: digest,
        sources: digest,
        loads: digest,
      })
      .strict(),
    resolved_inputs: z
      .object({
        geometry: pcb_noise_json,
        configuration: pcb_noise_json,
        sources: pcb_noise_json,
        loads: pcb_noise_json,
      })
      .strict(),
    solver: z
      .object({
        backend: pcb_noise_name,
        version: pcb_noise_name,
        unit_adapter_version: pcb_noise_name,
        settings: pcb_noise_json,
      })
      .strict(),
    artifacts: z.array(
      z
        .object({
          name: pcb_noise_name,
          data_format: simulation_pcb_noise_asset.innerType().shape.data_format,
          sha256: pcb_noise_sha256,
          encoded_sha256: pcb_noise_sha256,
          canonical_sha256: pcb_noise_sha256,
          byte_length: pcb_noise_count,
          decoded_byte_length: pcb_noise_count,
        })
        .strict(),
    ),
  })
  .strict()
  .superRefine((v, ctx) => {
    if (new Set(v.artifacts.map((a) => a.name)).size !== v.artifacts.length)
      ctx.addIssue({
        code: "custom",
        path: ["artifacts"],
        message: "Manifest artifact names must be unique",
      })
    if (
      v.artifacts.some(
        (a) => a.data_format === "simulation_pcb_noise_manifest_json_v1",
      )
    )
      ctx.addIssue({
        code: "custom",
        path: ["artifacts"],
        message: "Manifest cannot include a recursive self hash",
      })
  })
  .describe(
    "Complete reproducible noise run manifest with explicit canonicalization and effective solver inputs",
  )
export type SimulationPcbNoiseManifestJson = z.infer<
  typeof simulation_pcb_noise_manifest_json
>
