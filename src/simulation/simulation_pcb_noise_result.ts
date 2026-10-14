import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import {
  pcb_noise_finite,
  pcb_noise_name,
  simulation_pcb_noise_asset,
} from "./simulation_pcb_noise_shared"

const result_base = z.object({
  type: z.literal("simulation_pcb_noise_result"),
  simulation_pcb_noise_result_id: getZodPrefixedIdWithDefault(
    "simulation_pcb_noise_result",
  ),
  simulation_experiment_id: pcb_noise_name,
  simulation_pcb_noise_configuration_id: pcb_noise_name,
  pcb_board_id: pcb_noise_name,
  run_id: pcb_noise_name,
})
const assetOf = (
  format: z.infer<typeof simulation_pcb_noise_asset>["data_format"],
) =>
  simulation_pcb_noise_asset.refine(
    (v) => v.data_format === format,
    `Expected ${format}`,
  )
const observation_asset = z.object({ observation_name: pcb_noise_name })

/** Failed/unsupported runs contain diagnostics and cannot contain completed assets. */
export const simulation_pcb_noise_result = z
  .discriminatedUnion("status", [
    result_base
      .extend({
        status: z.literal("completed"),
        observation_names: z.array(pcb_noise_name).min(1),
        model_tier: pcb_noise_name,
        validity_band_hz: z
          .object({
            min_hz: pcb_noise_finite.nonnegative(),
            max_hz: pcb_noise_finite.positive(),
          })
          .strict(),
        validation: z
          .object({
            state: z.enum(["validated", "unvalidated"]),
            residuals: z.array(
              z
                .object({
                  name: pcb_noise_name,
                  value: pcb_noise_finite.nonnegative(),
                  unit: pcb_noise_name,
                  limit: pcb_noise_finite.nonnegative().optional(),
                })
                .strict(),
            ),
          })
          .strict(),
        manifest_asset: assetOf("simulation_pcb_noise_manifest_json_v1"),
        network_asset: assetOf("simulation_pcb_noise_network_json_v1"),
        waveform_assets: z
          .array(
            observation_asset
              .extend({
                variant: z.enum(["total", "baseline", "difference"]),
                asset: assetOf("simulation_pcb_noise_waveform_json_v1"),
              })
              .strict(),
          )
          .min(1),
        eye_assets: z
          .array(
            observation_asset
              .extend({ asset: assetOf("simulation_pcb_noise_eye_json_v1") })
              .strict(),
          )
          .optional(),
        spectrum_assets: z
          .array(
            observation_asset
              .extend({
                asset: assetOf("simulation_pcb_noise_spectrum_json_v1"),
              })
              .strict(),
          )
          .optional(),
      })
      .strict(),
    result_base
      .extend({
        status: z.literal("failed"),
        diagnostics: z
          .array(
            z
              .object({ code: pcb_noise_name, message: pcb_noise_name })
              .strict(),
          )
          .min(1),
      })
      .strict(),
    result_base
      .extend({
        status: z.literal("unsupported"),
        diagnostics: z
          .array(
            z
              .object({ code: pcb_noise_name, message: pcb_noise_name })
              .strict(),
          )
          .min(1),
      })
      .strict(),
  ])
  .superRefine((v, ctx) => {
    if (v.status !== "completed") return
    if (v.validity_band_hz.max_hz <= v.validity_band_hz.min_hz)
      ctx.addIssue({
        code: "custom",
        path: ["validity_band_hz"],
        message: "Validity band must have positive width",
      })
    if (new Set(v.observation_names).size !== v.observation_names.length)
      ctx.addIssue({
        code: "custom",
        path: ["observation_names"],
        message: "Observation names must be unique",
      })
    const observations = new Set(v.observation_names)
    for (const key of [
      "waveform_assets",
      "eye_assets",
      "spectrum_assets",
    ] as const) {
      const seen = new Set<string>()
      v[key]?.forEach((a, i) => {
        if (!observations.has(a.observation_name))
          ctx.addIssue({
            code: "custom",
            path: [key, i],
            message: "Asset must belong to a result observation",
          })
        const identity = `${a.observation_name}:${"variant" in a ? a.variant : key}`
        if (seen.has(identity))
          ctx.addIssue({
            code: "custom",
            path: [key, i],
            message: "Asset observation and variant must be unique",
          })
        seen.add(identity)
      })
    }
    for (const name of v.observation_names)
      if (
        !v.waveform_assets.some(
          (a) => a.observation_name === name && a.variant === "total",
        )
      )
        ctx.addIssue({
          code: "custom",
          path: ["waveform_assets"],
          message: `Missing total waveform for ${name}`,
        })
    if (
      v.validation.state === "validated" &&
      (!v.validation.residuals.length ||
        v.validation.residuals.some(
          (r) => r.limit === undefined || r.value > r.limit,
        ))
    )
      ctx.addIssue({
        code: "custom",
        path: ["validation"],
        message:
          "Validated results require measured residuals within explicit limits",
      })
  })
  .describe(
    "Immutable noise run envelope with explicit model validity and hash-bearing assets",
  )
export type SimulationPcbNoiseResult = z.infer<
  typeof simulation_pcb_noise_result
>
export type SimulationPcbNoiseResultInput = z.input<
  typeof simulation_pcb_noise_result
>
