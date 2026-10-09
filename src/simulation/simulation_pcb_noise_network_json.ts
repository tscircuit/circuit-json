import { z } from "zod"
import {
  pcb_noise_finite,
  pcb_noise_name,
  pcb_noise_positive,
  pcb_noise_sha256,
  simulation_pcb_noise_contact,
} from "./simulation_pcb_noise_shared"

const complex = z
  .object({ real: pcb_noise_finite, imag: pcb_noise_finite })
  .strict()
/** Bare passive network; frequency/output-port/input-port order, peak exp(+j omega t) phasors. */
export const simulation_pcb_noise_network_json = z
  .object({
    format: z.literal("simulation_pcb_noise_network_json_v1"),
    run_id: pcb_noise_name,
    input_sha256: pcb_noise_sha256,
    model_sha256: pcb_noise_sha256,
    ports: z
      .array(
        z
          .object({
            port_name: pcb_noise_name,
            signal_contact: simulation_pcb_noise_contact,
            reference_contact: simulation_pcb_noise_contact,
            reference_impedance_ohms: pcb_noise_positive,
            reference_plane: pcb_noise_name,
            polarity: z.literal("signal_minus_reference"),
          })
          .strict(),
      )
      .min(1),
    frequencies_hz: z.array(pcb_noise_finite.nonnegative()).min(1),
    representation: z.enum(["s", "y", "z"]),
    matrix_units: z.union([
      z.literal("dimensionless"),
      z.literal("S"),
      z.literal("ohm"),
    ]),
    matrices: z.array(z.array(z.array(complex).min(1)).min(1)).min(1),
    phasor_convention: z.literal("exp_positive_j_omega_t"),
    current_sign_convention: z.literal("into_pcb"),
    dc: z.discriminatedUnion("kind", [
      z.object({ kind: z.literal("included") }).strict(),
      z
        .object({ kind: z.literal("unavailable"), reason: pcb_noise_name })
        .strict(),
    ]),
    extraction: z
      .object({
        provider: pcb_noise_name,
        version: pcb_noise_name,
        normalization: pcb_noise_name,
      })
      .strict(),
  })
  .strict()
  .superRefine((v, ctx) => {
    const size = v.ports.length
    if (new Set(v.ports.map((p) => p.port_name)).size !== size)
      ctx.addIssue({
        code: "custom",
        path: ["ports"],
        message: "Network port names must be unique",
      })
    if (
      v.matrices.length !== v.frequencies_hz.length ||
      v.matrices.some(
        (m) => m.length !== size || m.some((row) => row.length !== size),
      )
    )
      ctx.addIssue({
        code: "custom",
        path: ["matrices"],
        message: "One full square port matrix is required per frequency",
      })
    v.frequencies_hz.forEach((f, i) => {
      if (i && f <= v.frequencies_hz[i - 1]!)
        ctx.addIssue({
          code: "custom",
          path: ["frequencies_hz", i],
          message: "Frequencies must strictly increase",
        })
    })
    if (
      v.matrix_units !==
      ({ s: "dimensionless", y: "S", z: "ohm" } as const)[v.representation]
    )
      ctx.addIssue({
        code: "custom",
        path: ["matrix_units"],
        message: "Units must match representation",
      })
    if ((v.dc.kind === "included") !== (v.frequencies_hz[0] === 0))
      ctx.addIssue({
        code: "custom",
        path: ["dc"],
        message: "DC included requires the actual zero-frequency endpoint",
      })
    if (
      v.frequencies_hz[0] === 0 &&
      v.matrices[0]!.some((row) => row.some((c) => c.imag !== 0))
    )
      ctx.addIssue({
        code: "custom",
        path: ["matrices", 0],
        message: "DC matrix must be real",
      })
  })
  .describe(
    "Versioned ordered full complex PCB network with contact and normalization provenance",
  )
export type SimulationPcbNoiseNetworkJson = z.infer<
  typeof simulation_pcb_noise_network_json
>
