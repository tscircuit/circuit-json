import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** Frequency-indexed total loop R/L and ground-referenced Maxwell C/G in physical conductor order. */
export interface SimulationSignalIntegrityRlgc {
  type: "simulation_signal_integrity_rlgc"
  simulation_signal_integrity_rlgc_id: string
  simulation_signal_integrity_id: string
  conductors: { simulation_signal_id: string; source_port_id: string }[]
  matrices: {
    frequency_hz: number
    r_ohm: number[][]
    l_h: number[][]
    c_f: number[][]
    g_s: number[][]
  }[]
}

const matrix = z.array(z.array(z.number().finite()))

export const simulation_signal_integrity_rlgc = z
  .object({
    type: z.literal("simulation_signal_integrity_rlgc"),
    simulation_signal_integrity_rlgc_id: getZodPrefixedIdWithDefault(
      "simulation_signal_integrity_rlgc",
    ),
    simulation_signal_integrity_id: z.string().min(1),
    conductors: z
      .array(
        z
          .object({
            simulation_signal_id: z.string().min(1),
            source_port_id: z.string().min(1),
          })
          .strict(),
      )
      .min(1),
    matrices: z
      .array(
        z.object({
          frequency_hz: z.number().finite().positive(),
          r_ohm: matrix,
          l_h: matrix,
          c_f: matrix,
          g_s: matrix,
        }),
      )
      .min(1),
  })
  .superRefine((result, context) => {
    const size = result.conductors.length
    for (const [index, entry] of result.matrices.entries()) {
      if (
        index > 0 &&
        entry.frequency_hz <= result.matrices[index - 1]!.frequency_hz
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["matrices", index, "frequency_hz"],
          message: "Frequencies must be unique and increasing",
        })
      }
      for (const field of ["r_ohm", "l_h", "c_f", "g_s"] as const) {
        if (
          entry[field].length !== size ||
          entry[field].some((row) => row.length !== size)
        ) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["matrices", index, field],
            message: "Matrix dimensions must match conductors",
          })
        }
      }
      for (const field of ["c_f", "g_s"] as const) {
        const values = entry[field]
        // Allow roundoff up to 1e-9 of this matrix's largest absolute entry.
        const tolerance =
          values.reduce(
            (max, row) =>
              row.reduce((max, value) => Math.max(max, Math.abs(value)), max),
            0,
          ) * 1e-9
        if (
          values.some((row, i) =>
            row.some(
              (value, j) =>
                j < i &&
                Math.abs(value - (values[j]?.[i] ?? value)) > tolerance,
            ),
          )
        ) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["matrices", index, field],
            message: "Maxwell matrices must be symmetric",
          })
        }
        if (
          entry[field].some((row, i) =>
            row.some((value, j) => (i === j ? value < 0 : value > 0)),
          )
        ) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["matrices", index, field],
            message:
              "Maxwell matrices require nonnegative diagonals and nonpositive mutual entries",
          })
        }
      }
    }
    const portsBySignal = new Map<string, string[]>()
    for (const { simulation_signal_id, source_port_id } of result.conductors) {
      portsBySignal.set(simulation_signal_id, [
        ...(portsBySignal.get(simulation_signal_id) ?? []),
        source_port_id,
      ])
    }
    if (
      [...portsBySignal.values()].some(
        (ports) => ports.length > 2 || new Set(ports).size !== ports.length,
      )
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["conductors"],
        message:
          "Each signal must list one conductor or two distinct source ports",
      })
    }
  })
  .describe(
    "Stores coupled RLGC totals at each frequency in physical conductor order",
  )

export type SimulationSignalIntegrityRlgcInput = z.input<
  typeof simulation_signal_integrity_rlgc
>
expectTypesMatch<
  SimulationSignalIntegrityRlgc,
  z.infer<typeof simulation_signal_integrity_rlgc>
>(true)
