import { z } from "zod";

export * from "./source_simple_capacitor";
export * from "./source_simple_resistor";
export * from "./source_simple_diode";
export * from "./source_simple_ground";
export * from "./source_simple_bug";
export * from "./source_simple_chip";
export * from "./source_simple_inductor";
export * from "./source_led";
export * from "./source_simple_power_source";
export * from "./any_source_component";
export * from "./source_port";
export * from "./source_trace";
export * from "./base/source_component_base";
export * from "./source_group";
export * from "./source_net";

/**
 * @deprecated Use source_simple_chip instead. This will be removed in a future version.
 */
export const source_simple_bug = z.object({
  type: z.literal("source_component"),
  ftype: z.string().optional(),
  source_component_id: z.string(),
  name: z.string(),
  manufacturer_part_number: z.string().optional(),
  supplier_part_numbers: z.string().optional(),
}).describe('@deprecated');
