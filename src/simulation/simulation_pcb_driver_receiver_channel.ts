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

/** Resolved simulation.pcbdriverreceiverchannel endpoints and traffic for one transient simulation. */
export interface SimulationPcbDriverReceiverChannel {
  type: "simulation_pcb_driver_receiver_channel"
  simulation_pcb_driver_receiver_channel_id: string
  simulation_pcb_transient_channel_simulation_id: string
  name: string
  driver: SignalEndpoint
  receivers: SignalEndpoint[]
  bit_rate_bps: number
  /** Open pattern string, as declared by simulation.pcbdriverreceiverchannel. */
  pattern: string
  /** Optional PRBS seed. Core resolves omitted seeds for the simulation. */
  seed?: number
  offset_s: number
  driver_disabled?: boolean
}

export const simulation_pcb_driver_receiver_channel = z
  .object({
    type: z.literal("simulation_pcb_driver_receiver_channel"),
    simulation_pcb_driver_receiver_channel_id: getZodPrefixedIdWithDefault(
      "simulation_pcb_driver_receiver_channel",
    ),
    simulation_pcb_transient_channel_simulation_id: z.string().min(1),
    name: z.string().min(1),
    driver: signal_endpoint,
    receivers: z.array(signal_endpoint).min(1),
    bit_rate_bps: z.number().finite().positive(),
    pattern: z.string().min(1),
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
  .refine(
    (channel) => {
      const order = /^prbs(7|15|31)$/.exec(channel.pattern)?.[1]
      return (
        channel.seed === undefined ||
        !order ||
        channel.seed <= 2 ** Number(order) - 1
      )
    },
    { path: ["seed"], message: "Seed must fit the PRBS pattern" },
  )
  .describe(
    "Defines resolved driver and receiver ports and traffic for one PCB channel",
  )

export type SimulationPcbDriverReceiverChannelInput = z.input<
  typeof simulation_pcb_driver_receiver_channel
>
expectTypesMatch<SignalEndpoint, z.infer<typeof signal_endpoint>>(true)
expectTypesMatch<
  SimulationPcbDriverReceiverChannel,
  z.infer<typeof simulation_pcb_driver_receiver_channel>
>(true)
