import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import {
  pcb_noise_finite,
  pcb_noise_name,
  pcb_noise_positive,
  pcb_noise_time_interval,
  pcbNoiseUniqueNames,
  simulation_pcb_noise_contact,
} from "./simulation_pcb_noise_shared"

export const simulation_pcb_noise_waveform_source = z
  .discriminatedUnion("kind", [
    z.object({ kind: z.literal("dc"), voltage_v: pcb_noise_finite }).strict(),
    z
      .object({
        kind: z.literal("sine"),
        offset_voltage_v: pcb_noise_finite,
        amplitude_v: pcb_noise_positive,
        amplitude_convention: z.enum(["peak", "peak_to_peak"]),
        frequency_hz: pcb_noise_positive,
        phase_rad: pcb_noise_finite,
      })
      .strict(),
    z
      .object({
        kind: z.literal("pulse"),
        low_voltage_v: pcb_noise_finite,
        high_voltage_v: pcb_noise_finite,
        delay_s: pcb_noise_finite.nonnegative(),
        period_s: pcb_noise_positive,
        high_duration_s: pcb_noise_positive,
        rise_time_s: pcb_noise_positive,
        fall_time_s: pcb_noise_positive,
        edge_time_convention: z.literal("10_90"),
      })
      .strict(),
    z
      .object({
        kind: z.literal("pwl"),
        interpolation: z.literal("linear"),
        points: z
          .array(
            z
              .object({ time_s: pcb_noise_finite, voltage_v: pcb_noise_finite })
              .strict(),
          )
          .min(2),
      })
      .strict(),
    z
      .object({
        kind: z.literal("prbs"),
        order: z.union([
          z.literal(7),
          z.literal(9),
          z.literal(11),
          z.literal(15),
          z.literal(23),
          z.literal(31),
        ]),
        baud_rate_hz: pcb_noise_positive,
        low_voltage_v: pcb_noise_finite,
        high_voltage_v: pcb_noise_finite,
        rise_time_s: pcb_noise_positive,
        fall_time_s: pcb_noise_positive,
        edge_time_convention: z.literal("10_90"),
        seed: z.number().int().positive().safe(),
        algorithm: z.literal("lfsr_fibonacci"),
        algorithm_version: z.literal("1"),
      })
      .strict(),
  ])
  .superRefine((v, ctx) => {
    if (v.kind === "pwl")
      v.points.forEach((point, i) => {
        if (i > 0 && point.time_s <= v.points[i - 1]!.time_s)
          ctx.addIssue({
            code: "custom",
            path: ["points", i, "time_s"],
            message: "PWL times must strictly increase",
          })
      })
    if (
      v.kind === "pulse" &&
      (v.high_voltage_v <= v.low_voltage_v ||
        v.high_duration_s + (v.rise_time_s + v.fall_time_s) / 0.8 >= v.period_s)
    )
      ctx.addIssue({
        code: "custom",
        message: "Pulse levels and full edge ramp must fit the period",
      })
    if (v.kind !== "prbs") return
    if (v.seed >= 2 ** v.order)
      ctx.addIssue({
        code: "custom",
        path: ["seed"],
        message: "Seed must fit the nonzero LFSR state",
      })
    if (v.high_voltage_v <= v.low_voltage_v)
      ctx.addIssue({
        code: "custom",
        path: ["high_voltage_v"],
        message: "High voltage must exceed low voltage",
      })
    if (Math.max(v.rise_time_s, v.fall_time_s) / 0.8 >= 1 / v.baud_rate_hz)
      ctx.addIssue({
        code: "custom",
        message: "Full edge ramp must be shorter than a symbol",
      })
  })

export const simulation_pcb_noise_eye_timing = z
  .discriminatedUnion("kind", [
    z
      .object({
        kind: z.literal("known_ui"),
        unit_interval_s: pcb_noise_positive,
        sample_offset_s: pcb_noise_finite,
        origin: z.discriminatedUnion("kind", [
          z
            .object({
              kind: z.literal("authored_epoch"),
              epoch_s: pcb_noise_finite,
            })
            .strict(),
          z
            .object({
              kind: z.literal("one_phase_estimate"),
              training_interval: pcb_noise_time_interval,
            })
            .strict(),
        ]),
      })
      .strict(),
    z
      .object({
        kind: z.literal("explicit_clock"),
        clock: z.discriminatedUnion("kind", [
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
        edge: z.enum(["rising", "falling", "both"]),
        threshold_v: pcb_noise_finite,
        ui_per_selected_edge: pcb_noise_positive,
        sample_offset_s: pcb_noise_finite,
        interpretation: z.enum(["actual_receiver_clock", "nominal_reference"]),
      })
      .strict(),
  ])
  .superRefine((v, ctx) => {
    if (
      v.kind === "known_ui" &&
      (v.sample_offset_s < 0 || v.sample_offset_s >= v.unit_interval_s)
    )
      ctx.addIssue({
        code: "custom",
        path: ["sample_offset_s"],
        message: "Sample offset must lie in one UI",
      })
    if (
      v.kind === "explicit_clock" &&
      v.clock.kind === "authored_edges" &&
      v.interpretation !== "nominal_reference"
    )
      ctx.addIssue({
        code: "custom",
        message: "Authored edges require nominal-reference timing",
      })
  })
export type SimulationPcbNoiseEyeTiming = z.infer<
  typeof simulation_pcb_noise_eye_timing
>

/** One resolved physical configuration per pcb_noise experiment. No electrical defaults. */
export const simulation_pcb_noise_configuration = z
  .object({
    type: z.literal("simulation_pcb_noise_configuration"),
    simulation_pcb_noise_configuration_id: getZodPrefixedIdWithDefault(
      "simulation_pcb_noise_configuration",
    ),
    simulation_experiment_id: pcb_noise_name,
    pcb_board_id: pcb_noise_name,
    duration_s: pcb_noise_positive,
    sample_interval_s: pcb_noise_positive,
    ports: z
      .array(
        z
          .object({
            name: pcb_noise_name,
            signal_contact: simulation_pcb_noise_contact,
            reference_contact: simulation_pcb_noise_contact,
          })
          .strict(),
      )
      .min(1),
    sources: z
      .array(
        z
          .object({
            name: pcb_noise_name,
            port_name: pcb_noise_name,
            role: z.enum(["aggressor", "victim"]),
            source_model: z
              .object({
                kind: z.literal("thevenin"),
                resistance_ohms: pcb_noise_positive,
              })
              .strict(),
            waveform: simulation_pcb_noise_waveform_source,
          })
          .strict(),
      )
      .min(1),
    terminations: z.array(
      z
        .object({
          name: pcb_noise_name,
          port_name: pcb_noise_name,
          model: z.discriminatedUnion("kind", [
            z
              .object({
                kind: z.literal("resistor"),
                resistance_ohms: pcb_noise_positive,
                bias_voltage_v: pcb_noise_finite,
              })
              .strict(),
            z
              .object({
                kind: z.literal("parallel_rc"),
                resistance_ohms: pcb_noise_positive,
                capacitance_f: pcb_noise_positive,
                bias_voltage_v: pcb_noise_finite,
              })
              .strict(),
          ]),
        })
        .strict(),
    ),
    observations: z
      .array(
        z
          .object({
            name: pcb_noise_name,
            port_name: pcb_noise_name,
            quantity: z.enum(["voltage", "current"]),
          })
          .strict(),
      )
      .min(1),
    baseline: z
      .object({
        kind: z.literal("quiet_sources"),
        source_names: z.array(pcb_noise_name).min(1),
        voltage_v: pcb_noise_finite,
      })
      .strict()
      .optional(),
    eyes: z
      .array(
        z
          .object({
            observation_name: pcb_noise_name,
            modulation: z.literal("nrz"),
            timing: simulation_pcb_noise_eye_timing,
          })
          .strict(),
      )
      .optional(),
  })
  .strict()
  .superRefine((v, ctx) => {
    for (const key of [
      "ports",
      "sources",
      "terminations",
      "observations",
    ] as const)
      pcbNoiseUniqueNames(v[key], ctx, [key])
    if (v.sample_interval_s >= v.duration_s)
      ctx.addIssue({
        code: "custom",
        path: ["sample_interval_s"],
        message: "Sample interval must be shorter than duration",
      })
    const ports = new Set(v.ports.map((p) => p.name))
    const sources = new Map(v.sources.map((s) => [s.name, s]))
    const observations = new Map(v.observations.map((o) => [o.name, o]))
    for (const key of ["sources", "terminations", "observations"] as const)
      v[key].forEach((entry, i) => {
        if (!ports.has(entry.port_name))
          ctx.addIssue({
            code: "custom",
            path: [key, i, "port_name"],
            message: "Unknown local port",
          })
      })
    const contactKey = (c: z.infer<typeof simulation_pcb_noise_contact>) =>
      `${c.contact_type}:${c.contact_type === "pcb_port" ? c.pcb_port_id : c.contact_type === "pcb_via" ? c.pcb_via_id : c.pcb_copper_pour_id}:${c.layer}`
    v.ports.forEach((p, i) => {
      if (contactKey(p.signal_contact) === contactKey(p.reference_contact))
        ctx.addIssue({
          code: "custom",
          path: ["ports", i],
          message: "Signal and reference contacts must differ",
        })
    })
    for (const key of ["sources", "terminations"] as const) {
      const occupied = new Set<string>()
      v[key].forEach((entry, i) => {
        if (occupied.has(entry.port_name))
          ctx.addIssue({
            code: "custom",
            path: [key, i, "port_name"],
            message: "Only one model per port is supported",
          })
        occupied.add(entry.port_name)
      })
    }
    if (v.baseline) {
      if (
        new Set(v.baseline.source_names).size !== v.baseline.source_names.length
      )
        ctx.addIssue({
          code: "custom",
          path: ["baseline", "source_names"],
          message: "Baseline source names must be unique",
        })
      for (const name of v.baseline.source_names)
        if (!sources.has(name))
          ctx.addIssue({
            code: "custom",
            path: ["baseline", "source_names"],
            message: `Unknown source ${name}`,
          })
    }
    const eyeNames = new Set<string>()
    v.eyes?.forEach((eye, i) => {
      if (eyeNames.has(eye.observation_name))
        ctx.addIssue({
          code: "custom",
          path: ["eyes", i],
          message: "Only one eye per observation is supported",
        })
      eyeNames.add(eye.observation_name)
      const observation = observations.get(eye.observation_name)
      if (!observation || observation.quantity !== "voltage")
        ctx.addIssue({
          code: "custom",
          path: ["eyes", i, "observation_name"],
          message: "Eye must reference a voltage observation",
        })
      const timing = eye.timing
      if (timing.kind === "explicit_clock") {
        const valid =
          timing.clock.kind === "observation"
            ? observations.get(timing.clock.observation_name)?.quantity ===
              "voltage"
            : sources.get(timing.clock.source_name)?.waveform.kind === "prbs"
        if (!valid)
          ctx.addIssue({
            code: "custom",
            path: ["eyes", i, "timing", "clock"],
            message:
              "Clock reference must identify a sampled voltage or digital source",
          })
        if (
          timing.clock.kind === "observation" &&
          observations.get(timing.clock.observation_name)?.port_name ===
            observation?.port_name
        )
          ctx.addIssue({
            code: "custom",
            path: ["eyes", i, "timing", "clock"],
            message:
              "Data observation cannot serve as its own timing reference",
          })
      } else if (
        timing.origin.kind === "one_phase_estimate" &&
        (timing.origin.training_interval.start_s < 0 ||
          timing.origin.training_interval.end_s > v.duration_s)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["eyes", i, "timing", "origin"],
          message: "Training interval must lie in the run",
        })
      }
    })
  })
  .describe(
    "Explicit physical noise ports, source and load models, observations and timing in SI units",
  )
export type SimulationPcbNoiseConfiguration = z.infer<
  typeof simulation_pcb_noise_configuration
>
export type SimulationPcbNoiseConfigurationInput = z.input<
  typeof simulation_pcb_noise_configuration
>
