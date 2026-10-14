import { z } from "zod"
import {
  pcb_noise_count,
  pcb_noise_finite,
  pcb_noise_name,
  pcb_noise_positive,
  pcb_noise_sha256,
  pcb_noise_time_interval,
} from "./simulation_pcb_noise_shared"

const resolved_timing = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("known_ui"),
      unit_interval_s: pcb_noise_positive,
      epoch_s: pcb_noise_finite,
      sample_offset_s: pcb_noise_finite,
    })
    .strict(),
  z
    .object({
      kind: z.literal("explicit_clock"),
      unit_interval_s: pcb_noise_positive,
      epoch_s: pcb_noise_finite.optional(),
      sample_offset_s: pcb_noise_finite,
      clock_edges_s: z.array(pcb_noise_finite).min(2),
      edge_polarity: z.enum(["rising", "falling", "both"]),
      symbol_mapping: z.literal("one_edge_per_symbol"),
      clock_waveform_sha256: pcb_noise_sha256.optional(),
      interpretation: z.enum(["actual_receiver_clock", "nominal_reference"]),
      clock_source: z.discriminatedUnion("kind", [
        z
          .object({
            kind: z.literal("observation"),
            observation_name: pcb_noise_name,
          })
          .strict(),
        z
          .object({
            kind: z.literal("authored_edges"),
            source_name: pcb_noise_name,
          })
          .strict(),
      ]),
    })
    .strict(),
])

/** A finite-record density on physical two-UI/voltage axes; counts are not BER probabilities. */
export const simulation_pcb_noise_eye_json = z
  .object({
    format: z.literal("simulation_pcb_noise_eye_json_v1"),
    run_id: pcb_noise_name,
    observation_name: pcb_noise_name,
    waveform_sha256: pcb_noise_sha256,
    timing_sha256: pcb_noise_sha256,
    modulation: z.literal("nrz"),
    unit_interval_s: pcb_noise_positive,
    extent_ui: z.literal(2),
    time_bins: pcb_noise_count,
    voltage_bins: pcb_noise_count,
    min_voltage_v: pcb_noise_finite,
    max_voltage_v: pcb_noise_finite,
    counts: z.array(pcb_noise_finite.nonnegative()).min(1),
    complete_window_count: pcb_noise_count.min(64),
    transition_count: z.number().int().nonnegative().safe(),
    excluded_intervals_s: z.array(pcb_noise_time_interval),
    resolved_timing,
    metrics: z
      .object({
        eye_height_v: pcb_noise_finite.nonnegative().optional(),
        eye_width_s: pcb_noise_finite.nonnegative().optional(),
        jitter_rms_s: pcb_noise_finite.nonnegative().optional(),
        jitter_peak_to_peak_s: pcb_noise_finite.nonnegative().optional(),
        offset_s: pcb_noise_finite.optional(),
        tie_rms_s: pcb_noise_finite.nonnegative().optional(),
      })
      .strict(),
    metric_definitions: z.record(pcb_noise_name).optional(),
  })
  .strict()
  .superRefine((v, ctx) => {
    if (v.max_voltage_v <= v.min_voltage_v)
      ctx.addIssue({
        code: "custom",
        path: ["max_voltage_v"],
        message: "Voltage axis must have positive extent",
      })
    const count = v.time_bins * v.voltage_bins
    if (!Number.isSafeInteger(count) || v.counts.length !== count)
      ctx.addIssue({
        code: "custom",
        path: ["counts"],
        message: "Histogram length must match safe bin dimensions",
      })
    if (!v.counts.some((c) => c > 0))
      ctx.addIssue({
        code: "custom",
        path: ["counts"],
        message: "A successful eye must contain samples",
      })
    if (v.resolved_timing.unit_interval_s !== v.unit_interval_s)
      ctx.addIssue({
        code: "custom",
        path: ["resolved_timing"],
        message: "Resolved UI must match physical eye axis",
      })
    if (
      v.resolved_timing.sample_offset_s < 0 ||
      v.resolved_timing.sample_offset_s >= v.unit_interval_s
    )
      ctx.addIssue({
        code: "custom",
        path: ["resolved_timing", "sample_offset_s"],
        message: "Sample offset must lie in one UI",
      })
    if (v.resolved_timing.kind === "explicit_clock")
      v.resolved_timing.clock_edges_s.forEach((t, i) => {
        if (
          i &&
          t <=
            (v.resolved_timing.kind === "explicit_clock"
              ? v.resolved_timing.clock_edges_s[i - 1]!
              : t)
        )
          ctx.addIssue({
            code: "custom",
            path: ["resolved_timing", "clock_edges_s", i],
            message: "Clock edge times must strictly increase",
          })
      })
    if (
      v.resolved_timing.kind === "explicit_clock" &&
      v.resolved_timing.clock_source.kind === "authored_edges" &&
      v.resolved_timing.interpretation !== "nominal_reference"
    )
      ctx.addIssue({
        code: "custom",
        path: ["resolved_timing"],
        message: "Authored edges require nominal-reference timing",
      })
  })
  .describe(
    "Validated finite-record NRZ eye density with persisted physical timing and metric definitions",
  )
export type SimulationPcbNoiseEyeJson = z.infer<
  typeof simulation_pcb_noise_eye_json
>

export const simulation_pcb_noise_spectrum_json = z
  .object({
    format: z.literal("simulation_pcb_noise_spectrum_json_v1"),
    run_id: pcb_noise_name,
    observation_name: pcb_noise_name,
    waveform_sha256: pcb_noise_sha256,
    frequencies_hz: z.array(pcb_noise_finite).min(1),
    values: z.array(pcb_noise_finite.nonnegative()).min(1),
    kind: z.enum(["psd", "amplitude_peak", "amplitude_rms"]),
    unit: z.union([
      z.literal("V"),
      z.literal("A"),
      z.literal("V^2/Hz"),
      z.literal("A^2/Hz"),
    ]),
    sidedness: z.enum(["one_sided", "two_sided"]),
    window: z.enum(["rectangular", "hann"]),
    coherent_gain: pcb_noise_positive,
    enbw_hz: pcb_noise_positive,
    dc_treatment: z.enum(["included", "mean_removed"]),
    fft_length: pcb_noise_count.min(2),
    sample_rate_hz: pcb_noise_positive,
    integrated_power: pcb_noise_finite.nonnegative(),
    windowed_mean_square: pcb_noise_finite.nonnegative(),
    parseval_relative_error: pcb_noise_finite.nonnegative(),
  })
  .strict()
  .superRefine((v, ctx) => {
    if (v.values.length !== v.frequencies_hz.length)
      ctx.addIssue({
        code: "custom",
        path: ["values"],
        message: "Spectrum arrays must have equal length",
      })
    if ((v.kind === "psd") !== v.unit.endsWith("^2/Hz"))
      ctx.addIssue({
        code: "custom",
        path: ["unit"],
        message: "PSD and amplitude require distinct units",
      })
    v.frequencies_hz.forEach((f, i) => {
      if (
        (i && f <= v.frequencies_hz[i - 1]!) ||
        (v.sidedness === "one_sided" && f < 0) ||
        Math.abs(f) > v.sample_rate_hz / 2
      )
        ctx.addIssue({
          code: "custom",
          path: ["frequencies_hz", i],
          message:
            "Frequencies must be ordered inside the sampled Nyquist band",
        })
    })
    const expected =
      v.sidedness === "one_sided"
        ? Math.floor(v.fft_length / 2) + 1
        : v.fft_length
    if (v.values.length !== expected)
      ctx.addIssue({
        code: "custom",
        path: ["values"],
        message: "Spectrum count must match FFT length and sidedness",
      })
  })
  .describe(
    "Versioned spectrum with explicit PSD/amplitude units, normalization and Parseval diagnostics",
  )
export type SimulationPcbNoiseSpectrumJson = z.infer<
  typeof simulation_pcb_noise_spectrum_json
>
