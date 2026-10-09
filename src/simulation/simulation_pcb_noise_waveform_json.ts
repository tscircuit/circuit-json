import { z } from "zod"
import {
  pcb_noise_count,
  pcb_noise_finite,
  pcb_noise_name,
  pcb_noise_positive,
  pcb_noise_sha256,
  pcb_noise_time_interval,
} from "./simulation_pcb_noise_shared"

/** Full-resolution scalar samples. Seconds are never the legacy graph milliseconds. */
export const simulation_pcb_noise_waveform_json = z
  .object({
    format: z.literal("simulation_pcb_noise_waveform_json_v1"),
    run_id: pcb_noise_name,
    observation_name: pcb_noise_name,
    unit: z.union([z.literal("V"), z.literal("A")]),
    variant: z.enum(["total", "baseline", "difference"]),
    full_resolution: z.literal(true),
    time: z.discriminatedUnion("kind", [
      z
        .object({
          kind: z.literal("uniform"),
          start_s: pcb_noise_finite,
          step_s: pcb_noise_positive,
          count: pcb_noise_count.min(2),
        })
        .strict(),
      z
        .object({
          kind: z.literal("explicit"),
          times_s: z.array(pcb_noise_finite).min(2),
        })
        .strict(),
    ]),
    values: z.array(pcb_noise_finite).min(2),
    valid_intervals_s: z.array(pcb_noise_time_interval).min(1),
    bandwidth_hz: pcb_noise_positive,
    input_sha256: pcb_noise_sha256,
    source_sha256: pcb_noise_sha256,
    comparison_identity: pcb_noise_name.optional(),
  })
  .strict()
  .superRefine((v, ctx) => {
    const time = v.time
    const count = time.kind === "uniform" ? time.count : time.times_s.length
    if (v.values.length !== count)
      ctx.addIssue({
        code: "custom",
        path: ["values"],
        message: "Sample count must match time base",
      })
    const at = (i: number) =>
      time.kind === "uniform"
        ? time.start_s + i * time.step_s
        : time.times_s[i]!
    if (!Number.isFinite(at(count - 1)))
      ctx.addIssue({
        code: "custom",
        path: ["time"],
        message: "Time span must be finite",
      })
    if (time.kind === "explicit")
      time.times_s.forEach((t, i) => {
        if (i && t <= time.times_s[i - 1]!)
          ctx.addIssue({
            code: "custom",
            path: ["time", "times_s", i],
            message: "Timestamps must strictly increase",
          })
      })
    v.valid_intervals_s.forEach((interval, i) => {
      if (
        interval.start_s < at(0) ||
        interval.end_s > at(count - 1) ||
        (i && interval.start_s <= v.valid_intervals_s[i - 1]!.end_s)
      )
        ctx.addIssue({
          code: "custom",
          path: ["valid_intervals_s", i],
          message:
            "Valid intervals must be ordered, disjoint, and within the capture",
        })
    })
    let intervalIndex = 0
    for (let i = 0; i < count; i++) {
      const t = at(i)
      while (
        intervalIndex < v.valid_intervals_s.length &&
        t > v.valid_intervals_s[intervalIndex]!.end_s
      )
        intervalIndex++
      const interval = v.valid_intervals_s[intervalIndex]
      if (!interval || t < interval.start_s) {
        ctx.addIssue({
          code: "custom",
          path: ["time"],
          message: "Every sample must belong to a valid continuous interval",
        })
        break
      }
    }
  })
  .describe(
    "Strict full-resolution terminal waveform with explicit valid intervals and SI units",
  )
export type SimulationPcbNoiseWaveformJson = z.infer<
  typeof simulation_pcb_noise_waveform_json
>
