import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  simulation_parameter_unit,
  type SimulationParameterUnit,
} from "./simulation_units"

export interface SimulationParameterSweepCoordinate {
  simulation_parameter_sweep_id: string
  sweep_index: number
  parameter_value: number
  parameter_unit: SimulationParameterUnit
}

export interface SimulationParameterSweepResultCoordinates {
  /** Coordinate for a one-dimensional parameter sweep. */
  simulation_parameter_sweep_coordinate?: SimulationParameterSweepCoordinate
  /** Ordered coordinates for a multidimensional parameter sweep. */
  simulation_parameter_sweep_coordinates?: SimulationParameterSweepCoordinate[]
}

export const simulation_parameter_sweep_coordinate = z.object({
  simulation_parameter_sweep_id: z.string(),
  sweep_index: z.number().int().nonnegative(),
  parameter_value: z.number(),
  parameter_unit: simulation_parameter_unit,
})

const rejectDuplicateParameterSweepIds = (
  coordinates: SimulationParameterSweepCoordinate[],
  context: z.RefinementCtx,
) => {
  const seenParameterSweepIds = new Set<string>()
  for (const [coordinateIndex, coordinate] of coordinates.entries()) {
    if (seenParameterSweepIds.has(coordinate.simulation_parameter_sweep_id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [coordinateIndex, "simulation_parameter_sweep_id"],
        message: "Parameter sweep coordinate IDs must be unique",
      })
    }
    seenParameterSweepIds.add(coordinate.simulation_parameter_sweep_id)
  }
}

export const simulation_parameter_sweep_coordinate_set = z
  .array(simulation_parameter_sweep_coordinate)
  .min(1)
  .superRefine(rejectDuplicateParameterSweepIds)

export const simulation_parameter_sweep_coordinates = z
  .array(simulation_parameter_sweep_coordinate)
  .min(2)
  .superRefine(rejectDuplicateParameterSweepIds)

export const validateSimulationParameterSweepResultCoordinates = (
  result: SimulationParameterSweepResultCoordinates,
  context: z.RefinementCtx,
) => {
  if (
    result.simulation_parameter_sweep_coordinate &&
    result.simulation_parameter_sweep_coordinates
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["simulation_parameter_sweep_coordinates"],
      message:
        "Use the singular coordinate for one-dimensional sweeps or the plural coordinates for multidimensional sweeps, not both",
    })
  }
}

expectTypesMatch<
  SimulationParameterSweepCoordinate,
  z.infer<typeof simulation_parameter_sweep_coordinate>
>(true)
