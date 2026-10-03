import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** Explicit DDR routing intent. Interface names are scoped by subcircuit.
 * SPRS717L is revision L of the AM335x data manual. The first supported
 * topology is one point-to-point x16 DDR3 device; no electrical defaults
 * or physical stackup are implied by selecting this profile. */
export interface DdrRoutingConstraints {
  profile: "ti_am335x_ddr3"
  interface_name: string
  signal_class: "dq" | "dqs" | "ck" | "addr_ctrl"
  topology: "one_x16"
  byte_index?: 0 | 1
  ground_net_name?: string
  power_net_name?: string
}

export const ddr_routing_constraints = z
  .object({
    profile: z.literal("ti_am335x_ddr3"),
    interface_name: z.string().min(1),
    signal_class: z.enum(["dq", "dqs", "ck", "addr_ctrl"]),
    topology: z.literal("one_x16"),
    byte_index: z.union([z.literal(0), z.literal(1)]).optional(),
    ground_net_name: z.string().min(1).optional(),
    power_net_name: z.string().min(1).optional(),
  })
  .superRefine((intent, ctx) => {
    const byteClass =
      intent.signal_class === "dq" || intent.signal_class === "dqs"
    if (byteClass !== (intent.byte_index !== undefined))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["byte_index"],
        message: byteClass
          ? "dq/dqs require a byte_index"
          : "ck/addr_ctrl do not have a byte_index",
      })
  })
expectTypesMatch<
  DdrRoutingConstraints,
  z.infer<typeof ddr_routing_constraints>
>(true)
