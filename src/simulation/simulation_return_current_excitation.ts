import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { current } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

const finite_point = point.refine(
  (position) => Number.isFinite(position.x) && Number.isFinite(position.y),
  "Return-current contacts must have finite coordinates",
)

export const simulation_return_current_excitation = z
  .object({
    type: z.literal("simulation_return_current_excitation"),
    simulation_return_current_excitation_id: getZodPrefixedIdWithDefault(
      "simulation_return_current_excitation",
    ),
    pcb_trace_id: z.string(),
    ground_source_net_id: z.string(),
    current: current.pipe(z.number().finite()),
    return_source: finite_point,
    return_sink: finite_point,
  })
  .describe(
    "Excites a PCB signal trace and specifies its ground-plane return contacts. Positive current follows the ordered signal route and flows from return_source to return_sink on ground copper. Contact positions use circuit world coordinates in mm (+X right, +Y up).",
  )

export type SimulationReturnCurrentExcitationInput = z.input<
  typeof simulation_return_current_excitation
>
type InferredSimulationReturnCurrentExcitation = z.infer<
  typeof simulation_return_current_excitation
>

/** PCB trace excitation and ground contacts for spatial return-current simulation.
 * Current is a signed instantaneous or in-phase amplitude in amperes, not an
 * inferred operating-point current. Positive follows the ordered signal route.
 * Contact positions are circuit world points in mm, +X right and +Y up.
 * return_source injects current into ground at the load; return_sink removes it
 * at the driver. They need not coincide with the signal route endpoints.
 */
export interface SimulationReturnCurrentExcitation {
  type: "simulation_return_current_excitation"
  simulation_return_current_excitation_id: string
  pcb_trace_id: string
  ground_source_net_id: string
  current: number
  return_source: Point
  return_sink: Point
}

expectTypesMatch<
  SimulationReturnCurrentExcitation,
  InferredSimulationReturnCurrentExcitation
>(true)
