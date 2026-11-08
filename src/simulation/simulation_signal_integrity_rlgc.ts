import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** Coupled lumped matrices in ohms, henries, farads and siemens, ordered by signal IDs. */
export interface SimulationSignalIntegrityRlgc {
  type: "simulation_signal_integrity_rlgc"
  simulation_signal_integrity_rlgc_id: string
  simulation_signal_integrity_id: string
  signal_order: string[]
  r_ohm: number[][]
  l_h: number[][]
  c_f: number[][]
  g_s: number[][]
}

const matrix = z.array(z.array(z.number().finite()))

export const simulation_signal_integrity_rlgc = z
  .object({
    type: z.literal("simulation_signal_integrity_rlgc"),
    simulation_signal_integrity_rlgc_id: getZodPrefixedIdWithDefault(
      "simulation_signal_integrity_rlgc",
    ),
    simulation_signal_integrity_id: z.string().min(1),
    signal_order: z.array(z.string().min(1)).min(1),
    r_ohm: matrix,
    l_h: matrix,
    c_f: matrix,
    g_s: matrix,
  })
  .superRefine((result, context) => {
    const size = result.signal_order.length
    for (const field of ["r_ohm", "l_h", "c_f", "g_s"] as const) {
      if (
        result[field].length !== size ||
        result[field].some((row) => row.length !== size)
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: "Matrix dimensions must match signal_order",
        })
      }
    }
    if (new Set(result.signal_order).size !== size) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["signal_order"],
        message: "Each signal must occur once in signal_order",
      })
    }
  })
  .describe("Stores coupled RLGC matrices and their simulation signal ID order")

export type SimulationSignalIntegrityRlgcInput = z.input<
  typeof simulation_signal_integrity_rlgc
>
expectTypesMatch<
  SimulationSignalIntegrityRlgc,
  z.infer<typeof simulation_signal_integrity_rlgc>
>(true)
