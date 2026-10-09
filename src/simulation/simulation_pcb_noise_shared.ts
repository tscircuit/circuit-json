import { z } from "zod"
import { asset } from "../common"
import { simulation_return_current_contact } from "./simulation_return_current_contact"

export const pcb_noise_name = z.string().min(1)
export const pcb_noise_finite = z.number().finite()
export const pcb_noise_positive = pcb_noise_finite.positive()
export const pcb_noise_count = z.number().int().positive().safe()
export const pcb_noise_sha256 = z.string().regex(/^[a-f0-9]{64}$/)

/** Positions remain PCB millimeters; electrical values and times use SI. */
export const simulation_pcb_noise_contact = z.discriminatedUnion(
  "contact_type",
  [
    simulation_return_current_contact.options[0].strict(),
    simulation_return_current_contact.options[1].strict(),
    simulation_return_current_contact.options[2].strict(),
  ],
)
export type SimulationPcbNoiseContact = z.infer<
  typeof simulation_pcb_noise_contact
>

export const pcb_noise_time_interval = z
  .object({
    start_s: pcb_noise_finite,
    end_s: pcb_noise_finite,
  })
  .strict()
  .refine((v) => v.end_s > v.start_s, "Interval end must follow start")

/** Hashes cover exact decoded bytes, exact encoded bytes, and canonical JSON separately. */
export const simulation_pcb_noise_asset = z
  .object({
    asset: asset
      .extend({
        project_relative_path: pcb_noise_name,
        url: z.string().url(),
        mimetype: z.union([
          z.literal("application/json"),
          z.literal("application/gzip"),
        ]),
      })
      .strict(),
    sha256: pcb_noise_sha256,
    encoded_sha256: pcb_noise_sha256,
    canonical_sha256: pcb_noise_sha256,
    byte_length: pcb_noise_count,
    decoded_byte_length: pcb_noise_count,
    data_format: z.enum([
      "simulation_pcb_noise_manifest_json_v1",
      "simulation_pcb_noise_network_json_v1",
      "simulation_pcb_noise_waveform_json_v1",
      "simulation_pcb_noise_eye_json_v1",
      "simulation_pcb_noise_spectrum_json_v1",
    ]),
  })
  .strict()
  .superRefine((v, ctx) => {
    if (v.asset.url.startsWith("data:")) {
      const mime = /^data:([^;,]*)(?:;[^,]*)?,/i.exec(v.asset.url)?.[1]
      if (mime?.toLowerCase() !== v.asset.mimetype)
        ctx.addIssue({
          code: "custom",
          path: ["asset", "url"],
          message: "Data URL MIME must match asset MIME",
        })
    }
    if (
      v.asset.mimetype === "application/json" &&
      v.byte_length !== v.decoded_byte_length
    )
      ctx.addIssue({
        code: "custom",
        message: "Uncompressed byte lengths must match",
      })
  })
export type SimulationPcbNoiseAsset = z.infer<typeof simulation_pcb_noise_asset>

export const pcb_noise_json: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.null(),
    z.boolean(),
    pcb_noise_finite,
    z.string(),
    z.array(pcb_noise_json),
    z.record(pcb_noise_json),
  ]),
)

export function pcbNoiseUniqueNames(
  values: { name: string }[],
  ctx: z.RefinementCtx,
  path: string[],
) {
  const seen = new Set<string>()
  values.forEach((v, i) => {
    if (seen.has(v.name))
      ctx.addIssue({
        code: "custom",
        path: [...path, i, "name"],
        message: "Names must be unique",
      })
    seen.add(v.name)
  })
}
