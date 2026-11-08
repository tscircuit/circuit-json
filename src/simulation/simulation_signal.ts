import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export type SignalEndpoint =
  | { kind: "single"; source_port_id: string; ibis_model_name?: string }
  | {
      kind: "differential"
      p_source_port_id: string
      n_source_port_id: string
      ibis_model_name?: string
    }

export const signal_endpoint = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("single"),
      source_port_id: z.string().min(1),
      ibis_model_name: z.string().min(1).optional(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("differential"),
      p_source_port_id: z.string().min(1),
      n_source_port_id: z.string().min(1),
      ibis_model_name: z.string().min(1).optional(),
    })
    .strict(),
])

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
  seed: number
  offset_s: number
  quiet?: "low" | "high" | "off"
  probe: "local" | "global"
  mask:
    | "ibis"
    | { vih_v?: number; vil_v?: number; setup_s?: number; hold_s?: number }
  strobe_simulation_signal_id?: string
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
    seed: z.number().int().nonnegative(),
    offset_s: z.number().finite().nonnegative(),
    quiet: z.enum(["low", "high", "off"]).optional(),
    probe: z.enum(["local", "global"]),
    mask: z.union([
      z.literal("ibis"),
      z
        .object({
          vih_v: z.number().finite().optional(),
          vil_v: z.number().finite().optional(),
          setup_s: z.number().finite().nonnegative().optional(),
          hold_s: z.number().finite().nonnegative().optional(),
        })
        .strict(),
    ]),
    strobe_simulation_signal_id: z.string().min(1).optional(),
  })
  .superRefine((signal, context) => {
    if (
      typeof signal.mask === "object" &&
      !signal.strobe_simulation_signal_id
    ) {
      for (const field of ["setup_s", "hold_s"] as const) {
        if (signal.mask[field] !== undefined) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["mask", field],
            message: "Setup and hold limits require a strobe signal",
          })
        }
      }
    }
  })
  .describe(
    "Defines resolved endpoints and traffic for one signal integrity test",
  )

export type SimulationSignalInput = z.input<typeof simulation_signal>
expectTypesMatch<SignalEndpoint, z.infer<typeof signal_endpoint>>(true)
expectTypesMatch<SimulationSignal, z.infer<typeof simulation_signal>>(true)
