import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export type SignalEndpoint =
  | { source_port_id: string; ibis_model_name?: string }
  | {
      p_source_port_id: string
      n_source_port_id: string
      p_ibis_model_name?: string
      n_ibis_model_name?: string
    }

export const signal_endpoint = z
  .union([
    z
      .object({
        source_port_id: z.string().min(1),
        ibis_model_name: z.string().min(1).optional(),
      })
      .strict(),
    z
      .object({
        p_source_port_id: z.string().min(1),
        n_source_port_id: z.string().min(1),
        p_ibis_model_name: z.string().min(1).optional(),
        n_ibis_model_name: z.string().min(1).optional(),
      })
      .strict(),
  ])
  .refine(
    (endpoint) =>
      "source_port_id" in endpoint ||
      endpoint.p_source_port_id !== endpoint.n_source_port_id,
    {
      path: ["n_source_port_id"],
      message: "Differential endpoints require distinct P and N ports",
    },
  )

/** A resolved signal, its traffic, and the receivers measured in one test. */
export interface SimulationSignal {
  type: "simulation_signal"
  simulation_signal_id: string
  simulation_signal_integrity_id: string
  name: string
  driver: SignalEndpoint
  receivers: SignalEndpoint[]
  bit_rate_bps: number
  pattern: string
  seed?: number
  offset_s: number
  driver_disabled?: boolean
}

export const simulation_signal = z
  .object({
    type: z.literal("simulation_signal"),
    simulation_signal_id: getZodPrefixedIdWithDefault("simulation_signal"),
    simulation_signal_integrity_id: z.string().min(1),
    name: z.string().min(1),
    driver: signal_endpoint,
    receivers: z.array(signal_endpoint).min(1),
    bit_rate_bps: z.number().finite().positive(),
    pattern: z.string().regex(/^(?:prbs7|prbs15|prbs31|clock|[01]+)$/),
    seed: z.number().finite().int().positive().optional(),
    offset_s: z.number().finite().nonnegative(),
    driver_disabled: z.boolean().optional(),
  })
  .strict()
  .refine(
    (signal) =>
      signal.receivers.every(
        (receiver) =>
          "source_port_id" in receiver === "source_port_id" in signal.driver,
      ),
    { path: ["receivers"], message: "Receivers must have the driver's shape" },
  )
  .superRefine((signal, context) => {
    const order = /^prbs(7|15|31)$/.exec(signal.pattern)?.[1]
    if (order) {
      const maxSeed = 2 ** Number(order) - 1
      if (signal.seed === undefined || signal.seed > maxSeed) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["seed"],
          message: `${signal.pattern} seed must be an integer in 1..${maxSeed}`,
        })
      }
    } else if (signal.seed !== undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["seed"],
        message: "Non-PRBS source records must omit seed",
      })
    }
  })
  .describe(
    "Defines resolved endpoints and traffic for one signal integrity test",
  )

export type SimulationSignalInput = z.input<typeof simulation_signal>
expectTypesMatch<SignalEndpoint, z.infer<typeof signal_endpoint>>(true)
expectTypesMatch<SimulationSignal, z.infer<typeof simulation_signal>>(true)
