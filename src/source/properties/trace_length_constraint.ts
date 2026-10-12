import { z } from "zod"

/** A rule's provenance is not evidence of a datasheet or fabrication limit. */
export const trace_max_length_origin = z.enum([
  "explicit",
  "inferred_decoupling",
  "configured_capacitor",
  "crystal",
])
export type TraceMaxLengthOrigin = z.infer<typeof trace_max_length_origin>

export const capacitor_role = z.enum([
  "decoupling",
  "bulk",
  "regulator_input",
  "regulator_output",
  "crystal_load",
  "filter",
  "unspecified",
])
export type CapacitorRole = z.infer<typeof capacitor_role>

/** Identifies the particular local connection, never an entire supply net. */
export const capacitor_connection = z.object({
  capacitor_source_component_id: z.string(),
  capacitor_source_port_id: z.string(),
  associated_source_component_id: z.string(),
  associated_source_port_id: z.string(),
  connection_type: z.enum(["supply", "return"]),
  capacitor_role,
})
export type CapacitorConnection = z.infer<typeof capacitor_connection>
