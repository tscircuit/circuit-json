import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** Results of a simulation.pcbtransientchannelsimulation: the RLGC (resistance, inductance, conductance, capacitance) transmission line parameters the solver extracted for the coupled traces. RLGC is the standard telegrapher's-equation line model (Pozar, Microwave Engineering, ch. 2): R is copper loss, L is inductance, G is dielectric leakage, C is capacitance. Impedance ≈ √(L/C) and delay ≈ √(LC) for low-loss lines; off-diagonal matrix terms describe crosstalk between traces. Values are totals for the whole section, not per-metre values. */
export interface SimulationPcbTransientChannelResult {
  type: "simulation_pcb_transient_channel_result"
  simulation_pcb_transient_channel_result_id: string
  simulation_signal_integrity_id: string
  /** Physical conductor order for every matrix row and column. */
  conductors: {
    simulation_pcb_driver_receiver_channel_id: string
    source_port_id: string
  }[]
  matrices: {
    frequency_hz: number
    /** Total loop resistance, including the return path, in ohms. */
    resistance_ohms: number[][]
    /** Total loop inductance, including the return path, in henries. */
    inductance_henries: number[][]
    /** Ground-referenced Maxwell capacitance totals in farads. */
    capacitance_farads: number[][]
    /** Ground-referenced dielectric leakage conductance totals in siemens. */
    conductance_siemens: number[][]
  }[]
}

const matrix = z.array(z.array(z.number().finite()))

export const simulation_pcb_transient_channel_result = z
  .object({
    type: z.literal("simulation_pcb_transient_channel_result"),
    simulation_pcb_transient_channel_result_id: getZodPrefixedIdWithDefault(
      "simulation_pcb_transient_channel_result",
    ),
    simulation_signal_integrity_id: z.string().min(1),
    conductors: z
      .array(
        z
          .object({
            simulation_pcb_driver_receiver_channel_id: z.string().min(1),
            source_port_id: z.string().min(1),
          })
          .strict(),
      )
      .min(1),
    matrices: z
      .array(
        z.object({
          frequency_hz: z.number().finite().positive(),
          resistance_ohms: matrix,
          inductance_henries: matrix,
          capacitance_farads: matrix,
          conductance_siemens: matrix,
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
      for (const field of [
        "resistance_ohms",
        "inductance_henries",
        "capacitance_farads",
        "conductance_siemens",
      ] as const) {
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
      for (const field of [
        "capacitance_farads",
        "conductance_siemens",
      ] as const) {
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
    for (const {
      simulation_pcb_driver_receiver_channel_id,
      source_port_id,
    } of result.conductors) {
      portsBySignal.set(simulation_pcb_driver_receiver_channel_id, [
        ...(portsBySignal.get(simulation_pcb_driver_receiver_channel_id) ?? []),
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
    "Stores coupled resistance, inductance, conductance and capacitance totals at each frequency in physical conductor order",
  )

export type SimulationPcbTransientChannelResultInput = z.input<
  typeof simulation_pcb_transient_channel_result
>
expectTypesMatch<
  SimulationPcbTransientChannelResult,
  z.infer<typeof simulation_pcb_transient_channel_result>
>(true)
