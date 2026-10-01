// src/units/index.ts
import { parseAndConvertSiUnit } from "format-si-unit";
import { z } from "zod";
import {
  parseAndConvertSiUnit as parseAndConvertSiUnit2
} from "format-si-unit";
var resistance = z.string().or(z.number()).transform((v) => parseAndConvertSiUnit(v, "\u03A9").value);
var capacitance = z.string().or(z.number()).transform((v) => parseAndConvertSiUnit(v, "F").value).transform((value) => {
  return Number.parseFloat(value.toPrecision(12));
});
var inductance = z.string().or(z.number()).transform((v) => parseAndConvertSiUnit(v, "H").value);
var voltage = z.string().or(z.number()).transform((v) => parseAndConvertSiUnit(v, "V").value);
var length = z.string().or(z.number()).transform((v) => parseAndConvertSiUnit(v).value);
var frequency = z.string().or(z.number()).transform((v) => parseAndConvertSiUnit(v, "Hz").value);
var distance = length;
var current = z.string().or(z.number()).transform((v) => parseAndConvertSiUnit(v, "A").value);
var duration_ms = z.string().or(z.number()).transform((v) => parseAndConvertSiUnit(v).value);
var time = duration_ms;
var ms = duration_ms;
var timestamp = z.string().datetime();
var rotation = z.string().or(z.number()).transform((arg) => {
  if (typeof arg === "number") return arg;
  if (arg.endsWith("deg")) {
    return Number.parseFloat(arg.split("deg")[0]);
  }
  if (arg.endsWith("rad")) {
    return Number.parseFloat(arg.split("rad")[0]) * 180 / Math.PI;
  }
  return Number.parseFloat(arg);
});
var battery_capacity = z.number().or(z.string().endsWith("mAh")).transform((v) => {
  if (typeof v === "string") {
    const valString = v.replace("mAh", "");
    const num = Number.parseFloat(valString);
    if (Number.isNaN(num)) {
      throw new Error("Invalid capacity");
    }
    return num;
  }
  return v;
}).describe("Battery capacity in mAh");

// src/common/point.ts
import { z as z2 } from "zod";

// src/utils/expect-types-match.ts
var expectTypesMatch = (shouldBe) => {
};
expectTypesMatch("extra props b");
expectTypesMatch("missing props b");
expectTypesMatch(true);
expectTypesMatch("mismatched prop types: a");
var expectStringUnionsMatch = (shouldBe) => {
};
expectStringUnionsMatch(true);
expectStringUnionsMatch(
  'T1 has extra: "c", T2 has extra: "d"'
);
expectStringUnionsMatch('T1 has extra: "c"');
expectStringUnionsMatch('T2 has extra: "c"');
expectStringUnionsMatch(
  'T1 has extra: "d", T2 has extra: "c"'
);
expectStringUnionsMatch(true);

// src/common/point.ts
var point = z2.object({
  x: distance,
  y: distance
});
var position = point;
expectTypesMatch(true);
expectTypesMatch(true);

// src/common/point3.ts
import { z as z3 } from "zod";
var point3 = z3.object({
  x: distance,
  y: distance,
  z: distance
});
var position3 = point3;
expectTypesMatch(true);

// src/common/size.ts
import { z as z4 } from "zod";
var size = z4.object({
  width: z4.number(),
  height: z4.number()
});
expectTypesMatch(true);

// src/common/getZodPrefixedIdWithDefault.ts
import { z as z5 } from "zod";
var randomId = (length4) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length: length4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};
var getZodPrefixedIdWithDefault = (prefix) => {
  return z5.string().optional().default(() => `${prefix}_${randomId(10)}`);
};

// src/common/NinePointAnchor.ts
import { z as z6 } from "zod";
var ninePointAnchor = z6.enum([
  "top_left",
  "top_center",
  "top_right",
  "center_left",
  "center",
  "center_right",
  "bottom_left",
  "bottom_center",
  "bottom_right"
]);
expectTypesMatch(true);

// src/common/PcbRenderLayer.ts
import { z as z7 } from "zod";
var pcbRenderLayer = z7.enum([
  "top_silkscreen",
  "bottom_silkscreen",
  "top_copper",
  "bottom_copper",
  "top_soldermask",
  "bottom_soldermask",
  "top_fabrication_note",
  "bottom_fabrication_note",
  "top_user_note",
  "bottom_user_note",
  "top_courtyard",
  "bottom_courtyard",
  "inner1_copper",
  "inner2_copper",
  "inner3_copper",
  "inner4_copper",
  "inner5_copper",
  "inner6_copper",
  "inner7_copper",
  "inner8_copper",
  "edge_cuts",
  "drill"
]);
expectTypesMatch(true);

// src/common/asset.ts
import { z as z8 } from "zod";
var asset = z8.object({
  project_relative_path: z8.string(),
  url: z8.string(),
  mimetype: z8.string()
});
expectTypesMatch(true);

// src/common/kicadFootprintMetadata.ts
import { z as z9 } from "zod";
var kicadAt = point.extend({
  rotation: rotation.optional()
});
expectTypesMatch(true);
var kicadFont = z9.object({
  size: point.optional(),
  thickness: distance.optional()
});
expectTypesMatch(true);
var kicadEffects = z9.object({
  font: kicadFont.optional()
});
expectTypesMatch(true);
var kicadProperty = z9.object({
  value: z9.string(),
  at: kicadAt.optional(),
  layer: z9.string().optional(),
  uuid: z9.string().optional(),
  hide: z9.boolean().optional(),
  effects: kicadEffects.optional()
});
expectTypesMatch(true);
var kicadFootprintProperties = z9.object({
  Reference: kicadProperty.optional(),
  Value: kicadProperty.optional(),
  Datasheet: kicadProperty.optional(),
  Description: kicadProperty.optional()
});
expectTypesMatch(
  true
);
var kicadFootprintAttributes = z9.object({
  through_hole: z9.boolean().optional(),
  smd: z9.boolean().optional(),
  exclude_from_pos_files: z9.boolean().optional(),
  exclude_from_bom: z9.boolean().optional()
});
expectTypesMatch(
  true
);
var kicadFootprintPad = z9.object({
  name: z9.string(),
  type: z9.string(),
  shape: z9.string().optional(),
  at: kicadAt.optional(),
  size: point.optional(),
  drill: distance.optional(),
  layers: z9.array(z9.string()).optional(),
  removeUnusedLayers: z9.boolean().optional(),
  uuid: z9.string().optional()
});
expectTypesMatch(true);
var kicadFootprintModel = z9.object({
  path: z9.string(),
  offset: point3.optional(),
  scale: point3.optional(),
  rotate: point3.optional()
});
expectTypesMatch(true);
var kicadFootprintMetadata = z9.object({
  footprintName: z9.string().optional(),
  version: z9.union([z9.number(), z9.string()]).optional(),
  generator: z9.string().optional(),
  generatorVersion: z9.union([z9.number(), z9.string()]).optional(),
  layer: z9.string().optional(),
  properties: kicadFootprintProperties.optional(),
  attributes: kicadFootprintAttributes.optional(),
  pads: z9.array(kicadFootprintPad).optional(),
  embeddedFonts: z9.boolean().optional(),
  model: kicadFootprintModel.optional()
});
expectTypesMatch(true);

// src/common/kicadSymbolMetadata.ts
import { z as z10 } from "zod";
var kicadSymbolPinNumbers = z10.object({
  hide: z10.boolean().optional()
});
expectTypesMatch(true);
var kicadSymbolPinNames = z10.object({
  offset: distance.optional(),
  hide: z10.boolean().optional()
});
expectTypesMatch(true);
var kicadSymbolEffects = z10.object({
  font: kicadFont.optional(),
  justify: z10.union([z10.string(), z10.array(z10.string())]).optional(),
  hide: z10.boolean().optional()
});
expectTypesMatch(true);
var kicadSymbolProperty = z10.object({
  value: z10.string(),
  id: z10.union([z10.number(), z10.string()]).optional(),
  at: kicadAt.optional(),
  effects: kicadSymbolEffects.optional()
});
expectTypesMatch(true);
var kicadSymbolProperties = z10.object({
  Reference: kicadSymbolProperty.optional(),
  Value: kicadSymbolProperty.optional(),
  Footprint: kicadSymbolProperty.optional(),
  Datasheet: kicadSymbolProperty.optional(),
  Description: kicadSymbolProperty.optional(),
  ki_keywords: kicadSymbolProperty.optional(),
  ki_fp_filters: kicadSymbolProperty.optional()
});
expectTypesMatch(true);
var kicadSymbolMetadata = z10.object({
  symbolName: z10.string().optional(),
  extends: z10.string().optional(),
  pinNumbers: kicadSymbolPinNumbers.optional(),
  pinNames: kicadSymbolPinNames.optional(),
  excludeFromSim: z10.boolean().optional(),
  inBom: z10.boolean().optional(),
  onBoard: z10.boolean().optional(),
  properties: kicadSymbolProperties.optional(),
  embeddedFonts: z10.boolean().optional()
});
expectTypesMatch(true);

// src/base_circuit_json_error.ts
import { z as z11 } from "zod";
var base_circuit_json_error = z11.object({
  error_type: z11.string(),
  message: z11.string(),
  is_fatal: z11.boolean().optional()
});
expectTypesMatch(true);

// src/source/source_simple_capacitor.ts
import { z as z14 } from "zod";

// src/pcb/properties/supplier_name.ts
import { z as z12 } from "zod";
var supplier_name = z12.enum([
  "jlcpcb",
  "macrofab",
  "pcbway",
  "digikey",
  "mouser",
  "lcsc"
]);
expectTypesMatch(true);

// src/source/base/source_component_base.ts
import { z as z13 } from "zod";
var source_component_base = z13.object({
  type: z13.literal("source_component"),
  ftype: z13.string().optional(),
  source_component_id: z13.string(),
  name: z13.string(),
  manufacturer_part_number: z13.string().optional(),
  supplier_part_numbers: z13.record(supplier_name, z13.array(z13.string())).optional(),
  display_value: z13.string().optional(),
  display_name: z13.string().optional(),
  are_pins_interchangeable: z13.boolean().optional(),
  internally_connected_source_port_ids: z13.array(z13.array(z13.string())).optional(),
  source_group_id: z13.string().optional(),
  subcircuit_id: z13.string().optional()
});
expectTypesMatch(true);

// src/source/source_simple_capacitor.ts
var source_simple_capacitor = source_component_base.extend({
  ftype: z14.literal("simple_capacitor"),
  capacitance,
  max_voltage_rating: voltage.optional(),
  display_capacitance: z14.string().optional(),
  max_decoupling_trace_length: distance.optional()
});
expectTypesMatch(true);

// src/source/source_simple_resistor.ts
import { z as z15 } from "zod";
var source_simple_resistor = source_component_base.extend({
  ftype: z15.literal("simple_resistor"),
  resistance,
  display_resistance: z15.string().optional()
});
expectTypesMatch(true);

// src/source/source_simple_diode.ts
import { z as z16 } from "zod";
var source_simple_diode = source_component_base.extend({
  ftype: z16.literal("simple_diode")
});
expectTypesMatch(true);

// src/source/source_simple_fiducial.ts
import { z as z17 } from "zod";
var source_simple_fiducial = source_component_base.extend({
  ftype: z17.literal("simple_fiducial")
});
expectTypesMatch(true);

// src/source/source_simple_led.ts
import { z as z18 } from "zod";
var source_simple_led = source_simple_diode.extend({
  ftype: z18.literal("simple_led"),
  color: z18.string().optional(),
  wavelength: z18.string().optional()
});
expectTypesMatch(true);

// src/source/source_simple_ground.ts
import { z as z19 } from "zod";
var source_simple_ground = source_component_base.extend({
  ftype: z19.literal("simple_ground")
});
expectTypesMatch(true);

// src/source/source_simple_chip.ts
import { z as z20 } from "zod";
var source_simple_chip = source_component_base.extend({
  ftype: z20.literal("simple_chip")
});
expectTypesMatch(true);

// src/source/source_simple_power_source.ts
import { z as z21 } from "zod";
var source_simple_power_source = source_component_base.extend({
  ftype: z21.literal("simple_power_source"),
  voltage
});
expectTypesMatch(true);

// src/source/source_simple_current_source.ts
import { z as z22 } from "zod";
var source_simple_current_source = source_component_base.extend({
  ftype: z22.literal("simple_current_source"),
  current,
  frequency: frequency.optional(),
  peak_to_peak_current: current.optional(),
  wave_shape: z22.enum(["sine", "square", "triangle", "sawtooth", "dc"]).optional().default("dc"),
  phase: z22.number().optional(),
  duty_cycle: z22.number().min(0).max(1).optional()
});
expectTypesMatch(
  true
);

// src/source/source_simple_fuse.ts
import { z as z23 } from "zod";
var source_simple_fuse = source_component_base.extend({
  ftype: z23.literal("simple_fuse"),
  current_rating_amps: z23.number().describe("Nominal current in amps the fuse is rated for"),
  voltage_rating_volts: z23.number().describe("Voltage rating in volts, e.g. \xB15V would be 5")
});
expectTypesMatch(true);

// src/source/source_simple_ammeter.ts
import { z as z24 } from "zod";
var source_simple_ammeter = source_component_base.extend({
  ftype: z24.literal("simple_ammeter")
});
expectTypesMatch(true);

// src/source/properties/source_pin_attributes.ts
import { z as z25 } from "zod";
var source_pin_attributes = z25.object({
  is_input: z25.boolean().optional(),
  is_output: z25.boolean().optional(),
  is_bidirectional: z25.boolean().optional(),
  is_passive: z25.boolean().optional(),
  can_use_tri_state: z25.boolean().optional(),
  is_using_tri_state: z25.boolean().optional(),
  can_use_open_collector: z25.boolean().optional(),
  is_using_open_collector: z25.boolean().optional(),
  can_use_open_emitter: z25.boolean().optional(),
  is_using_open_emitter: z25.boolean().optional(),
  is_gpio: z25.boolean().optional(),
  highlight_color: z25.string().optional(),
  must_be_connected: z25.boolean().optional(),
  provides_power: z25.boolean().optional(),
  requires_power: z25.boolean().optional(),
  provides_ground: z25.boolean().optional(),
  requires_ground: z25.boolean().optional(),
  provides_voltage: z25.union([z25.string(), z25.number()]).optional(),
  requires_voltage: z25.union([z25.string(), z25.number()]).optional(),
  do_not_connect: z25.boolean().optional(),
  include_in_board_pinout: z25.boolean().optional(),
  can_use_internal_pullup: z25.boolean().optional(),
  is_using_internal_pullup: z25.boolean().optional(),
  needs_external_pullup: z25.boolean().optional(),
  can_use_internal_pulldown: z25.boolean().optional(),
  is_using_internal_pulldown: z25.boolean().optional(),
  needs_external_pulldown: z25.boolean().optional(),
  can_use_open_drain: z25.boolean().optional(),
  is_using_open_drain: z25.boolean().optional(),
  can_use_push_pull: z25.boolean().optional(),
  is_using_push_pull: z25.boolean().optional(),
  should_have_decoupling_capacitor: z25.boolean().optional(),
  recommended_decoupling_capacitor_capacitance: z25.union([z25.string(), z25.number()]).optional(),
  is_configured_for_i2c_sda: z25.boolean().optional(),
  is_configured_for_i2c_scl: z25.boolean().optional(),
  is_configured_for_spi_mosi: z25.boolean().optional(),
  is_configured_for_spi_miso: z25.boolean().optional(),
  is_configured_for_spi_sck: z25.boolean().optional(),
  is_configured_for_spi_cs: z25.boolean().optional(),
  is_configured_for_uart_tx: z25.boolean().optional(),
  is_configured_for_uart_rx: z25.boolean().optional(),
  supports_i2c_sda: z25.boolean().optional(),
  supports_i2c_scl: z25.boolean().optional(),
  supports_spi_mosi: z25.boolean().optional(),
  supports_spi_miso: z25.boolean().optional(),
  supports_spi_sck: z25.boolean().optional(),
  supports_spi_cs: z25.boolean().optional(),
  supports_uart_tx: z25.boolean().optional(),
  supports_uart_rx: z25.boolean().optional()
});
expectTypesMatch(true);

// src/source/any_source_component.ts
import { z as z54 } from "zod";

// src/source/source_simple_battery.ts
import { z as z26 } from "zod";
var source_simple_battery = source_component_base.extend({
  ftype: z26.literal("simple_battery"),
  capacity: battery_capacity
});
expectTypesMatch(true);

// src/source/source_simple_inductor.ts
import { z as z27 } from "zod";
var source_simple_inductor = source_component_base.extend({
  ftype: z27.literal("simple_inductor"),
  inductance,
  display_inductance: z27.string().optional(),
  max_current_rating: z27.number().optional()
});
expectTypesMatch(true);

// src/source/source_simple_push_button.ts
import { z as z28 } from "zod";
var source_simple_push_button = source_component_base.extend({
  ftype: z28.literal("simple_push_button")
});
expectTypesMatch(true);

// src/source/source_simple_potentiometer.ts
import { z as z29 } from "zod";
var source_simple_potentiometer = source_component_base.extend({
  ftype: z29.literal("simple_potentiometer"),
  max_resistance: resistance,
  display_max_resistance: z29.string().optional()
});
expectTypesMatch(
  true
);

// src/source/source_simple_crystal.ts
import { z as z30 } from "zod";
var source_simple_crystal = source_component_base.extend({
  ftype: z30.literal("simple_crystal"),
  frequency: z30.number().describe("Frequency in Hz"),
  load_capacitance: z30.number().optional().describe("Load capacitance in pF"),
  pin_variant: z30.enum(["two_pin", "four_pin"]).optional()
});
expectTypesMatch(true);

// src/source/source_simple_pin_header.ts
import { z as z31 } from "zod";
var source_simple_pin_header = source_component_base.extend({
  ftype: z31.literal("simple_pin_header"),
  pin_count: z31.number(),
  gender: z31.enum(["male", "female"]).optional().default("male")
});
expectTypesMatch(true);

// src/source/source_simple_connector.ts
import { z as z32 } from "zod";
var source_simple_connector_standards = [
  "usb_c",
  "m2",
  "jst_sh",
  "jst_gh",
  "jst_zh",
  "jst_ph",
  "jst_xh",
  "jst_vh"
];
var source_simple_connector = source_component_base.extend({
  ftype: z32.literal("simple_connector"),
  standard: z32.enum(source_simple_connector_standards).optional(),
  pin_count: z32.number().int().positive().optional()
});
expectTypesMatch(true);

// src/source/source_simple_pinout.ts
import { z as z33 } from "zod";
var source_simple_pinout = source_component_base.extend({
  ftype: z33.literal("simple_pinout")
});
expectTypesMatch(true);

// src/source/source_simple_resonator.ts
import { z as z34 } from "zod";
var source_simple_resonator = source_component_base.extend({
  ftype: z34.literal("simple_resonator"),
  load_capacitance: capacitance,
  equivalent_series_resistance: resistance.optional(),
  frequency
});
expectTypesMatch(true);

// src/source/source_simple_transistor.ts
import { z as z35 } from "zod";
var source_simple_transistor = source_component_base.extend({
  ftype: z35.literal("simple_transistor"),
  transistor_type: z35.enum(["npn", "pnp"])
});
expectTypesMatch(true);

// src/source/source_simple_test_point.ts
import { z as z36 } from "zod";
var source_simple_test_point = source_component_base.extend({
  ftype: z36.literal("simple_test_point"),
  footprint_variant: z36.enum(["pad", "through_hole"]).optional(),
  pad_shape: z36.enum(["rect", "circle"]).optional(),
  pad_diameter: z36.union([z36.number(), z36.string()]).optional(),
  hole_diameter: z36.union([z36.number(), z36.string()]).optional(),
  width: z36.union([z36.number(), z36.string()]).optional(),
  height: z36.union([z36.number(), z36.string()]).optional()
});
expectTypesMatch(true);

// src/source/source_simple_mosfet.ts
import { z as z37 } from "zod";
var source_simple_mosfet = source_component_base.extend({
  ftype: z37.literal("simple_mosfet"),
  channel_type: z37.enum(["n", "p"]),
  mosfet_mode: z37.enum(["enhancement", "depletion"])
});
expectTypesMatch(true);

// src/source/source_simple_op_amp.ts
import { z as z38 } from "zod";
var source_simple_op_amp = source_component_base.extend({
  ftype: z38.literal("simple_op_amp")
});
expectTypesMatch(true);

// src/source/source_simple_switch.ts
import { z as z39 } from "zod";
var source_simple_switch = source_component_base.extend({
  ftype: z39.literal("simple_switch")
});
expectTypesMatch(true);

// src/source/source_project_metadata.ts
import { z as z40 } from "zod";
var source_project_metadata = z40.object({
  type: z40.literal("source_project_metadata"),
  name: z40.string().optional(),
  software_used_string: z40.string().optional(),
  project_url: z40.string().optional(),
  source_filesystem_md5_hash: z40.string().optional(),
  created_at: timestamp.optional()
});
expectTypesMatch(true);

// src/source/source_missing_property_error.ts
import { z as z41 } from "zod";
var source_missing_property_error = base_circuit_json_error.extend({
  type: z41.literal("source_missing_property_error"),
  source_missing_property_error_id: getZodPrefixedIdWithDefault(
    "source_missing_property_error"
  ),
  source_component_id: z41.string(),
  property_name: z41.string(),
  subcircuit_id: z41.string().optional(),
  error_type: z41.literal("source_missing_property_error").default("source_missing_property_error")
}).describe("The source code is missing a property");
expectTypesMatch(true);

// src/source/source_failed_to_create_component_error.ts
import { z as z42 } from "zod";
var source_failed_to_create_component_error = base_circuit_json_error.extend({
  type: z42.literal("source_failed_to_create_component_error"),
  source_failed_to_create_component_error_id: getZodPrefixedIdWithDefault(
    "source_failed_to_create_component_error"
  ),
  error_type: z42.literal("source_failed_to_create_component_error").default("source_failed_to_create_component_error"),
  component_name: z42.string().optional(),
  subcircuit_id: z42.string().optional(),
  parent_source_component_id: z42.string().optional(),
  pcb_center: z42.object({
    x: z42.number().optional(),
    y: z42.number().optional()
  }).optional(),
  schematic_center: z42.object({
    x: z42.number().optional(),
    y: z42.number().optional()
  }).optional()
}).describe("Error emitted when a component fails to be constructed");
expectTypesMatch(true);

// src/source/source_invalid_component_property_error.ts
import { z as z43 } from "zod";
var source_invalid_component_property_error = base_circuit_json_error.extend({
  type: z43.literal("source_invalid_component_property_error"),
  source_invalid_component_property_error_id: getZodPrefixedIdWithDefault(
    "source_invalid_component_property_error"
  ),
  source_component_id: z43.string(),
  property_name: z43.string(),
  property_value: z43.unknown().optional(),
  expected_format: z43.string().optional(),
  subcircuit_id: z43.string().optional(),
  error_type: z43.literal("source_invalid_component_property_error").default("source_invalid_component_property_error")
}).describe("The source component property is invalid");
expectTypesMatch(true);

// src/source/source_trace_not_connected_error.ts
import { z as z44 } from "zod";
var source_trace_not_connected_error = base_circuit_json_error.extend({
  type: z44.literal("source_trace_not_connected_error"),
  source_trace_not_connected_error_id: getZodPrefixedIdWithDefault(
    "source_trace_not_connected_error"
  ),
  error_type: z44.literal("source_trace_not_connected_error").default("source_trace_not_connected_error"),
  subcircuit_id: z44.string().optional(),
  source_group_id: z44.string().optional(),
  source_trace_id: z44.string().optional(),
  connected_source_port_ids: z44.array(z44.string()).optional(),
  selectors_not_found: z44.array(z44.string()).optional()
}).describe("Occurs when a source trace selector does not match any ports");
expectTypesMatch(true);

// src/source/source_property_ignored_warning.ts
import { z as z45 } from "zod";
var source_property_ignored_warning = z45.object({
  type: z45.literal("source_property_ignored_warning"),
  source_property_ignored_warning_id: getZodPrefixedIdWithDefault(
    "source_property_ignored_warning"
  ),
  source_component_id: z45.string(),
  property_name: z45.string(),
  subcircuit_id: z45.string().optional(),
  error_type: z45.literal("source_property_ignored_warning").default("source_property_ignored_warning"),
  message: z45.string()
}).describe("The source property was ignored");
expectTypesMatch(true);

// src/source/source_pin_missing_trace_warning.ts
import { z as z46 } from "zod";
var source_pin_missing_trace_warning = z46.object({
  type: z46.literal("source_pin_missing_trace_warning"),
  source_pin_missing_trace_warning_id: getZodPrefixedIdWithDefault(
    "source_pin_missing_trace_warning"
  ),
  warning_type: z46.literal("source_pin_missing_trace_warning").default("source_pin_missing_trace_warning"),
  message: z46.string(),
  source_component_id: z46.string(),
  source_port_id: z46.string(),
  subcircuit_id: z46.string().optional()
}).describe(
  "Warning emitted when a source component pin is missing a trace connection"
);
expectTypesMatch(true);

// src/source/source_missing_manufacturer_part_number_warning.ts
import { z as z47 } from "zod";
var source_missing_manufacturer_part_number_warning = z47.object({
  type: z47.literal("source_missing_manufacturer_part_number_warning"),
  source_missing_manufacturer_part_number_warning_id: getZodPrefixedIdWithDefault(
    "source_missing_manufacturer_part_number_warning"
  ),
  warning_type: z47.literal("source_missing_manufacturer_part_number_warning").default("source_missing_manufacturer_part_number_warning"),
  message: z47.string(),
  source_component_id: z47.string(),
  standard: z47.string(),
  subcircuit_id: z47.string().optional()
}).describe(
  "Warning emitted when a standard connector is missing manufacturer part number"
);
expectTypesMatch(true);

// src/source/source_refdes_convention_warning.ts
import { z as z48 } from "zod";
var source_refdes_convention_warning = z48.object({
  type: z48.literal("source_refdes_convention_warning"),
  source_refdes_convention_warning_id: getZodPrefixedIdWithDefault(
    "source_refdes_convention_warning"
  ),
  warning_type: z48.literal("source_refdes_convention_warning").default("source_refdes_convention_warning"),
  message: z48.string(),
  source_component_id: z48.string(),
  refdes: z48.string(),
  source_component_ftype: z48.string(),
  expected_prefixes: z48.array(z48.string()),
  actual_prefix: z48.string().optional(),
  subcircuit_id: z48.string().optional()
}).describe(
  "Warning emitted when a source component reference designator does not match the component type convention"
);
expectTypesMatch(true);

// src/source/source_simple_voltage_probe.ts
import { z as z49 } from "zod";
var source_simple_voltage_probe = source_component_base.extend({
  ftype: z49.literal("simple_voltage_probe")
});
expectTypesMatch(
  true
);

// src/source/source_interconnect.ts
import { z as z50 } from "zod";
var source_interconnect = source_component_base.extend({
  ftype: z50.literal("interconnect")
});
expectTypesMatch(true);

// src/source/source_i2c_misconfigured_error.ts
import { z as z51 } from "zod";
var source_i2c_misconfigured_error = base_circuit_json_error.extend({
  type: z51.literal("source_i2c_misconfigured_error"),
  source_i2c_misconfigured_error_id: getZodPrefixedIdWithDefault(
    "source_i2c_misconfigured_error"
  ),
  error_type: z51.literal("source_i2c_misconfigured_error").default("source_i2c_misconfigured_error"),
  source_port_ids: z51.array(z51.string())
}).describe(
  "Error emitted when incompatible I2C pins (e.g. SDA and SCL) are connected to the same net"
);
expectTypesMatch(true);

// src/source/source_component_misconfigured_error.ts
import { z as z52 } from "zod";
var source_component_misconfigured_error = base_circuit_json_error.extend({
  type: z52.literal("source_component_misconfigured_error"),
  source_component_misconfigured_error_id: getZodPrefixedIdWithDefault(
    "source_component_misconfigured_error"
  ),
  error_type: z52.literal("source_component_misconfigured_error").default("source_component_misconfigured_error"),
  source_component_ids: z52.array(z52.string()),
  source_port_ids: z52.array(z52.string()).optional()
}).describe(
  "Error emitted when one or more source components have an invalid or conflicting configuration"
);
expectTypesMatch(true);

// src/source/source_simple_voltage_source.ts
import { z as z53 } from "zod";
var source_simple_voltage_source = source_component_base.extend({
  ftype: z53.literal("simple_voltage_source"),
  voltage,
  frequency: frequency.optional(),
  peak_to_peak_voltage: voltage.optional(),
  wave_shape: z53.enum(["sinewave", "square", "triangle", "sawtooth"]).optional(),
  phase: rotation.optional(),
  duty_cycle: z53.number().optional().describe("Duty cycle as a fraction (0 to 1)"),
  pulse_delay: ms.optional(),
  rise_time: ms.optional(),
  fall_time: ms.optional(),
  pulse_width: ms.optional(),
  period: ms.optional()
});
expectTypesMatch(
  true
);

// src/source/any_source_component.ts
var any_source_component = z54.union([
  source_simple_resistor,
  source_simple_capacitor,
  source_simple_diode,
  source_simple_fiducial,
  source_simple_led,
  source_simple_ground,
  source_simple_chip,
  source_simple_power_source,
  source_simple_current_source,
  source_simple_ammeter,
  source_simple_battery,
  source_simple_inductor,
  source_simple_push_button,
  source_simple_potentiometer,
  source_simple_crystal,
  source_simple_pin_header,
  source_simple_connector,
  source_simple_pinout,
  source_simple_resonator,
  source_simple_switch,
  source_simple_transistor,
  source_simple_test_point,
  source_simple_mosfet,
  source_simple_op_amp,
  source_simple_fuse,
  source_simple_voltage_probe,
  source_interconnect,
  source_simple_voltage_source,
  source_project_metadata,
  source_missing_property_error,
  source_invalid_component_property_error,
  source_failed_to_create_component_error,
  source_trace_not_connected_error,
  source_property_ignored_warning,
  source_pin_missing_trace_warning,
  source_missing_manufacturer_part_number_warning,
  source_refdes_convention_warning,
  source_i2c_misconfigured_error,
  source_component_misconfigured_error
]);
expectTypesMatch(true);

// src/source/source_port.ts
import { z as z55 } from "zod";
var source_port = z55.object({
  type: z55.literal("source_port"),
  pin_number: z55.number().optional(),
  port_hints: z55.array(z55.string()).optional(),
  name: z55.string(),
  source_port_id: z55.string(),
  source_component_id: z55.string().optional(),
  source_group_id: z55.string().optional(),
  most_frequently_referenced_by_name: z55.string().optional(),
  subcircuit_id: z55.string().optional(),
  subcircuit_connectivity_map_key: z55.string().optional()
}).merge(source_pin_attributes);
expectTypesMatch(true);

// src/source/source_component_internal_connection.ts
import { z as z56 } from "zod";
var source_component_internal_connection = z56.object({
  type: z56.literal("source_component_internal_connection"),
  source_component_internal_connection_id: z56.string(),
  source_component_id: z56.string(),
  source_port_ids: z56.array(z56.string()),
  subcircuit_id: z56.string().optional()
});
expectTypesMatch(true);

// src/source/source_trace.ts
import { z as z57 } from "zod";
var source_trace = z57.object({
  type: z57.literal("source_trace"),
  source_trace_id: z57.string(),
  connected_source_port_ids: z57.array(z57.string()),
  connected_source_net_ids: z57.array(z57.string()),
  subcircuit_id: z57.string().optional(),
  subcircuit_connectivity_map_key: z57.string().optional(),
  max_length: z57.number().optional(),
  max_via_count: z57.number().int().nonnegative().optional(),
  name: z57.string().optional(),
  min_trace_thickness: z57.number().optional(),
  display_name: z57.string().optional()
});
expectTypesMatch(true);

// src/source/source_group.ts
import { z as z58 } from "zod";
var source_group = z58.object({
  type: z58.literal("source_group"),
  source_group_id: z58.string(),
  subcircuit_id: z58.string().optional(),
  parent_subcircuit_id: z58.string().optional(),
  parent_source_group_id: z58.string().optional(),
  is_subcircuit: z58.boolean().optional(),
  show_as_schematic_box: z58.boolean().optional(),
  name: z58.string().optional(),
  was_automatically_named: z58.boolean().optional()
});
expectTypesMatch(true);

// src/source/source_net.ts
import { z as z59 } from "zod";
var source_net = z59.object({
  type: z59.literal("source_net"),
  source_net_id: z59.string(),
  name: z59.string(),
  member_source_group_ids: z59.array(z59.string()),
  is_power: z59.boolean().optional(),
  is_ground: z59.boolean().optional(),
  is_digital_signal: z59.boolean().optional(),
  is_analog_signal: z59.boolean().optional(),
  is_positive_voltage_source: z59.boolean().optional(),
  trace_width: z59.number().optional(),
  subcircuit_id: z59.string().optional(),
  subcircuit_connectivity_map_key: z59.string().optional()
});
expectTypesMatch(true);

// src/source/source_board.ts
import { z as z60 } from "zod";
var source_board = z60.object({
  type: z60.literal("source_board"),
  source_board_id: z60.string(),
  source_group_id: z60.string(),
  title: z60.string().optional()
}).describe("Defines a board in the source domain");
expectTypesMatch(true);

// src/source/source_ambiguous_port_reference.ts
import { z as z61 } from "zod";
var source_ambiguous_port_reference = base_circuit_json_error.extend({
  type: z61.literal("source_ambiguous_port_reference"),
  source_ambiguous_port_reference_id: getZodPrefixedIdWithDefault(
    "source_ambiguous_port_reference"
  ),
  error_type: z61.literal("source_ambiguous_port_reference").default("source_ambiguous_port_reference"),
  source_port_id: z61.string().optional(),
  source_component_id: z61.string().optional()
}).describe(
  "Error emitted when a port hint matches multiple non-overlapping pads, making the port reference ambiguous"
);
expectTypesMatch(true);

// src/source/source_pcb_ground_plane.ts
import { z as z62 } from "zod";
var source_pcb_ground_plane = z62.object({
  type: z62.literal("source_pcb_ground_plane"),
  source_pcb_ground_plane_id: z62.string(),
  source_group_id: z62.string(),
  source_net_id: z62.string(),
  subcircuit_id: z62.string().optional()
}).describe("Defines a ground plane in the source domain");
expectTypesMatch(true);

// src/source/source_manually_placed_via.ts
import { z as z64 } from "zod";

// src/pcb/properties/layer_ref.ts
import { z as z63 } from "zod";
var all_layers = [
  "top",
  "bottom",
  "inner1",
  "inner2",
  "inner3",
  "inner4",
  "inner5",
  "inner6",
  "inner7",
  "inner8"
];
var layer_string = z63.enum(all_layers);
var layer_ref = layer_string.or(
  z63.object({
    name: layer_string
  })
).transform((layer) => {
  if (typeof layer === "string") {
    return layer;
  }
  return layer.name;
});
expectTypesMatch(true);
var visible_layer = z63.enum(["top", "bottom"]);

// src/source/source_manually_placed_via.ts
var source_manually_placed_via = z64.object({
  type: z64.literal("source_manually_placed_via"),
  source_manually_placed_via_id: z64.string(),
  source_group_id: z64.string(),
  source_net_id: z64.string().min(1).optional(),
  subcircuit_id: z64.string().optional(),
  source_trace_id: z64.string().optional()
}).describe("Defines a via that is manually placed in the source domain");
expectTypesMatch(true);

// src/source/source_unnamed_trace_warning.ts
import { z as z65 } from "zod";
var source_unnamed_trace_warning = z65.object({
  type: z65.literal("source_unnamed_trace_warning"),
  source_unnamed_trace_warning_id: getZodPrefixedIdWithDefault(
    "source_unnamed_trace_warning"
  ),
  warning_type: z65.literal("source_unnamed_trace_warning").default("source_unnamed_trace_warning"),
  message: z65.string(),
  source_trace_id: z65.string(),
  subcircuit_id: z65.string().optional()
}).describe("Warning emitted when a source trace is missing a name");
expectTypesMatch(
  true
);

// src/source/source_no_power_pin_defined_warning.ts
import { z as z66 } from "zod";
var source_no_power_pin_defined_warning = z66.object({
  type: z66.literal("source_no_power_pin_defined_warning"),
  source_no_power_pin_defined_warning_id: getZodPrefixedIdWithDefault(
    "source_no_power_pin_defined_warning"
  ),
  warning_type: z66.literal("source_no_power_pin_defined_warning").default("source_no_power_pin_defined_warning"),
  message: z66.string(),
  source_component_id: z66.string(),
  source_port_ids: z66.array(z66.string()),
  subcircuit_id: z66.string().optional()
}).describe(
  "Warning emitted when a chip has no source ports with requires_power=true"
);
expectTypesMatch(true);

// src/source/source_no_ground_pin_defined_warning.ts
import { z as z67 } from "zod";
var source_no_ground_pin_defined_warning = z67.object({
  type: z67.literal("source_no_ground_pin_defined_warning"),
  source_no_ground_pin_defined_warning_id: getZodPrefixedIdWithDefault(
    "source_no_ground_pin_defined_warning"
  ),
  warning_type: z67.literal("source_no_ground_pin_defined_warning").default("source_no_ground_pin_defined_warning"),
  message: z67.string(),
  source_component_id: z67.string(),
  source_port_ids: z67.array(z67.string()),
  subcircuit_id: z67.string().optional()
}).describe(
  "Warning emitted when a chip has no source ports marked as ground pins"
);
expectTypesMatch(true);

// src/source/source_component_pins_underspecified_warning.ts
import { z as z68 } from "zod";
var source_component_pins_underspecified_warning = z68.object({
  type: z68.literal("source_component_pins_underspecified_warning"),
  source_component_pins_underspecified_warning_id: getZodPrefixedIdWithDefault(
    "source_component_pins_underspecified_warning"
  ),
  warning_type: z68.literal("source_component_pins_underspecified_warning").default("source_component_pins_underspecified_warning"),
  message: z68.string(),
  source_component_id: z68.string(),
  source_port_ids: z68.array(z68.string()),
  subcircuit_id: z68.string().optional()
}).describe(
  "Warning emitted when all ports on a source component are underspecified"
);
expectTypesMatch(true);

// src/source/source_pin_must_be_connected_error.ts
import { z as z69 } from "zod";
var source_pin_must_be_connected_error = base_circuit_json_error.extend({
  type: z69.literal("source_pin_must_be_connected_error"),
  source_pin_must_be_connected_error_id: getZodPrefixedIdWithDefault(
    "source_pin_must_be_connected_error"
  ),
  error_type: z69.literal("source_pin_must_be_connected_error").default("source_pin_must_be_connected_error"),
  source_component_id: z69.string(),
  source_port_id: z69.string(),
  subcircuit_id: z69.string().optional()
}).describe(
  "Error emitted when a pin with mustBeConnected attribute is not connected to any trace"
);
expectTypesMatch(true);

// src/source/unknown_error_finding_part.ts
import { z as z70 } from "zod";
var unknown_error_finding_part = base_circuit_json_error.extend({
  type: z70.literal("unknown_error_finding_part"),
  unknown_error_finding_part_id: getZodPrefixedIdWithDefault(
    "unknown_error_finding_part"
  ),
  error_type: z70.literal("unknown_error_finding_part").default("unknown_error_finding_part"),
  source_component_id: z70.string().optional(),
  subcircuit_id: z70.string().optional()
}).describe(
  "Error emitted when an unexpected error occurs while finding a part"
);
expectTypesMatch(true);

// src/source/source_part_not_found_warning.ts
import { z as z71 } from "zod";
var source_part_not_found_warning = z71.object({
  type: z71.literal("source_part_not_found_warning"),
  source_part_not_found_warning_id: getZodPrefixedIdWithDefault(
    "source_part_not_found_warning"
  ),
  warning_type: z71.literal("source_part_not_found_warning").default("source_part_not_found_warning"),
  message: z71.string(),
  source_component_id: z71.string().optional(),
  subcircuit_id: z71.string().optional(),
  supplier_name: supplier_name.optional(),
  manufacturer_part_number: z71.string().optional(),
  supplier_part_number: z71.string().optional(),
  part_name: z71.string().optional()
}).describe("Warning emitted when a requested part can not be found");
expectTypesMatch(
  true
);

// src/source/source_confusing_net_name_warning.ts
import { z as z72 } from "zod";
var source_confusing_net_name_warning = z72.object({
  type: z72.literal("source_confusing_net_name_warning"),
  source_confusing_net_name_warning_id: getZodPrefixedIdWithDefault(
    "source_confusing_net_name_warning"
  ),
  warning_type: z72.literal("source_confusing_net_name_warning").default("source_confusing_net_name_warning"),
  message: z72.string(),
  source_net_ids: z72.array(z72.string()).min(2),
  net_name: z72.string(),
  subcircuit_id: z72.string().optional()
}).describe(
  "Warning emitted when electrically disconnected source nets share a name"
);
expectTypesMatch(true);

// src/source/source_bus.ts
import { z as z73 } from "zod";
var source_bus = z73.object({
  type: z73.literal("source_bus"),
  source_bus_id: z73.string(),
  name: z73.string().optional(),
  source_trace_ids: z73.array(z73.string()).min(1),
  max_length_skew: z73.number().nonnegative().finite().optional(),
  subcircuit_id: z73.string().optional()
});
expectTypesMatch(true);

// src/source/source_runtime_error.ts
import { z as z74 } from "zod";
var source_runtime_error = base_circuit_json_error.pick({ message: true, error_type: true }).extend({
  type: z74.literal("source_runtime_error"),
  source_runtime_error_id: getZodPrefixedIdWithDefault(
    "source_runtime_error"
  ),
  error_type: z74.literal("source_runtime_error").default("source_runtime_error"),
  phase_name: z74.string().optional()
}).describe(
  "An unexpected runtime failure while generating or validating a circuit"
);
expectTypesMatch(true);

// src/schematic/schematic_box.ts
import { z as z75 } from "zod";
var schematic_box = z75.object({
  type: z75.literal("schematic_box"),
  schematic_sheet_id: z75.string().optional(),
  schematic_component_id: z75.string().optional(),
  schematic_symbol_id: z75.string().optional(),
  width: distance,
  height: distance,
  is_dashed: z75.boolean().default(false),
  x: distance,
  y: distance,
  subcircuit_id: z75.string().optional()
}).describe("Draws a box on the schematic");
expectTypesMatch(true);

// src/schematic/schematic_path.ts
import { z as z76 } from "zod";
var schematic_path = z76.object({
  type: z76.literal("schematic_path"),
  schematic_path_id: getZodPrefixedIdWithDefault("schematic_path"),
  schematic_sheet_id: z76.string().optional(),
  schematic_component_id: z76.string().optional(),
  schematic_symbol_id: z76.string().optional(),
  fill_color: z76.string().optional(),
  is_filled: z76.boolean().optional(),
  is_dashed: z76.boolean().default(false),
  stroke_width: distance.nullable().optional(),
  stroke_color: z76.string().optional(),
  dash_length: distance.optional(),
  dash_gap: distance.optional(),
  points: z76.array(point),
  subcircuit_id: z76.string().optional()
});
expectTypesMatch(true);

// src/schematic/schematic_component.ts
import { z as z77 } from "zod";
var schematic_pin_styles = z77.record(
  z77.object({
    left_margin: length.optional(),
    right_margin: length.optional(),
    top_margin: length.optional(),
    bottom_margin: length.optional()
  })
);
var schematic_component_port_arrangement_by_size = z77.object({
  left_size: z77.number(),
  right_size: z77.number(),
  top_size: z77.number().optional(),
  bottom_size: z77.number().optional()
});
expectTypesMatch(true);
var schematic_component_port_arrangement_by_sides = z77.object({
  left_side: z77.object({
    pins: z77.array(z77.number()),
    // @ts-ignore
    direction: z77.enum(["top-to-bottom", "bottom-to-top"]).optional()
  }).optional(),
  right_side: z77.object({
    pins: z77.array(z77.number()),
    // @ts-ignore
    direction: z77.enum(["top-to-bottom", "bottom-to-top"]).optional()
  }).optional(),
  top_side: z77.object({
    pins: z77.array(z77.number()),
    // @ts-ignore
    direction: z77.enum(["left-to-right", "right-to-left"]).optional()
  }).optional(),
  bottom_side: z77.object({
    pins: z77.array(z77.number()),
    // @ts-ignore
    direction: z77.enum(["left-to-right", "right-to-left"]).optional()
  }).optional()
});
expectTypesMatch(true);
var port_arrangement = z77.union([
  schematic_component_port_arrangement_by_size,
  schematic_component_port_arrangement_by_sides
]);
var schematic_component = z77.object({
  type: z77.literal("schematic_component"),
  size,
  center: point,
  source_component_id: z77.string().optional(),
  schematic_component_id: z77.string(),
  schematic_sheet_id: z77.string().optional(),
  schematic_symbol_id: z77.string().optional(),
  pin_spacing: length.optional(),
  pin_styles: schematic_pin_styles.optional(),
  box_width: length.optional(),
  symbol_name: z77.string().optional(),
  port_arrangement: port_arrangement.optional(),
  port_labels: z77.record(z77.string()).optional(),
  symbol_display_value: z77.string().optional(),
  subcircuit_id: z77.string().optional(),
  schematic_group_id: z77.string().optional(),
  is_schematic_group: z77.boolean().optional(),
  source_group_id: z77.string().optional(),
  is_box_with_pins: z77.boolean().optional().default(true)
});
expectTypesMatch(true);

// src/schematic/schematic_symbol.ts
import { z as z78 } from "zod";
var schematicSymbolMetadata = z78.object({
  kicad_symbol: kicadSymbolMetadata.optional()
}).catchall(z78.unknown());
var schematic_symbol = z78.object({
  type: z78.literal("schematic_symbol"),
  schematic_symbol_id: z78.string(),
  name: z78.string().optional(),
  metadata: schematicSymbolMetadata.optional()
}).describe(
  "Defines a named schematic symbol that can be referenced by components."
);
expectTypesMatch(true);

// src/schematic/schematic_line.ts
import { z as z79 } from "zod";
var schematic_line = z79.object({
  type: z79.literal("schematic_line"),
  schematic_line_id: getZodPrefixedIdWithDefault("schematic_line"),
  schematic_sheet_id: z79.string().optional(),
  schematic_component_id: z79.string().optional(),
  schematic_symbol_id: z79.string().optional(),
  x1: distance,
  y1: distance,
  x2: distance,
  y2: distance,
  stroke_width: distance.nullable().optional(),
  color: z79.string().default("#000000"),
  is_dashed: z79.boolean().default(false),
  dash_length: distance.optional(),
  dash_gap: distance.optional(),
  subcircuit_id: z79.string().optional()
}).describe("Draws a styled line on the schematic");
expectTypesMatch(true);

// src/schematic/schematic_rect.ts
import { z as z80 } from "zod";
var schematic_rect = z80.object({
  type: z80.literal("schematic_rect"),
  schematic_rect_id: getZodPrefixedIdWithDefault("schematic_rect"),
  schematic_sheet_id: z80.string().optional(),
  schematic_component_id: z80.string().optional(),
  schematic_symbol_id: z80.string().optional(),
  center: point,
  width: distance,
  height: distance,
  rotation: rotation.default(0),
  stroke_width: distance.nullable().optional(),
  color: z80.string().default("#000000"),
  is_filled: z80.boolean().default(false),
  fill_color: z80.string().optional(),
  is_dashed: z80.boolean().default(false),
  subcircuit_id: z80.string().optional()
}).describe("Draws a styled rectangle on the schematic");
expectTypesMatch(true);

// src/schematic/schematic_circle.ts
import { z as z81 } from "zod";
var schematic_circle = z81.object({
  type: z81.literal("schematic_circle"),
  schematic_circle_id: getZodPrefixedIdWithDefault("schematic_circle"),
  schematic_sheet_id: z81.string().optional(),
  schematic_component_id: z81.string().optional(),
  schematic_symbol_id: z81.string().optional(),
  center: point,
  radius: distance,
  stroke_width: distance.nullable().optional(),
  color: z81.string().default("#000000"),
  is_filled: z81.boolean().default(false),
  fill_color: z81.string().optional(),
  is_dashed: z81.boolean().default(false),
  subcircuit_id: z81.string().optional()
}).describe("Draws a styled circle on the schematic");
expectTypesMatch(true);

// src/schematic/schematic_arc.ts
import { z as z82 } from "zod";
var schematic_arc = z82.object({
  type: z82.literal("schematic_arc"),
  schematic_arc_id: getZodPrefixedIdWithDefault("schematic_arc"),
  schematic_sheet_id: z82.string().optional(),
  schematic_component_id: z82.string().optional(),
  schematic_symbol_id: z82.string().optional(),
  center: point,
  radius: distance,
  start_angle_degrees: rotation,
  end_angle_degrees: rotation,
  direction: z82.enum(["clockwise", "counterclockwise"]).default("counterclockwise"),
  stroke_width: distance.nullable().optional(),
  color: z82.string().default("#000000"),
  is_dashed: z82.boolean().default(false),
  subcircuit_id: z82.string().optional()
}).describe("Draws a styled arc on the schematic");
expectTypesMatch(true);

// src/schematic/schematic_trace.ts
import { z as z83 } from "zod";
var schematic_trace = z83.object({
  type: z83.literal("schematic_trace"),
  schematic_trace_id: z83.string(),
  schematic_sheet_id: z83.string().optional(),
  source_trace_id: z83.string().optional(),
  junctions: z83.array(
    z83.object({
      x: z83.number(),
      y: z83.number()
    })
  ),
  edges: z83.array(
    z83.object({
      from: z83.object({
        x: z83.number(),
        y: z83.number()
      }),
      to: z83.object({
        x: z83.number(),
        y: z83.number()
      }),
      is_crossing: z83.boolean().optional(),
      from_schematic_port_id: z83.string().optional(),
      to_schematic_port_id: z83.string().optional()
    })
  ),
  subcircuit_id: z83.string().optional(),
  // TODO: make required in a future release
  subcircuit_connectivity_map_key: z83.string().optional()
});
expectTypesMatch(true);

// src/schematic/schematic_text.ts
import { z as z86 } from "zod";

// src/common/FivePointAnchor.ts
import { z as z84 } from "zod";
var fivePointAnchor = z84.enum([
  "center",
  "left",
  "right",
  "top",
  "bottom"
]);
expectTypesMatch(true);

// src/schematic/schematic_text_part.ts
import { z as z85 } from "zod";
var schematic_text_part = z85.object({
  text: z85.string(),
  is_overlined: z85.boolean().optional()
});

// src/schematic/schematic_text.ts
var schematic_text = z86.object({
  type: z86.literal("schematic_text"),
  schematic_sheet_id: z86.string().optional(),
  schematic_component_id: z86.string().optional(),
  schematic_symbol_id: z86.string().optional(),
  schematic_text_id: z86.string(),
  source_trace_id: z86.string().optional(),
  text: z86.string(),
  text_parts: z86.array(schematic_text_part).min(1).optional(),
  display_superscript: z86.string().optional(),
  font_size: z86.number().default(0.18),
  position: z86.object({
    x: distance,
    y: distance
  }),
  rotation: z86.number().default(0),
  anchor: z86.union([fivePointAnchor.describe("legacy"), ninePointAnchor]).default("center"),
  color: z86.string().default("#000000"),
  subcircuit_id: z86.string().optional()
});
expectTypesMatch(true);

// src/schematic/schematic_port.ts
import { z as z87 } from "zod";
var schematic_port = z87.object({
  type: z87.literal("schematic_port"),
  schematic_port_id: z87.string(),
  source_port_id: z87.string(),
  schematic_sheet_id: z87.string().optional(),
  schematic_component_id: z87.string().optional(),
  center: point,
  facing_direction: z87.enum(["up", "down", "left", "right"]).optional(),
  distance_from_component_edge: z87.number().optional(),
  side_of_component: z87.enum(["top", "bottom", "left", "right"]).optional(),
  true_ccw_index: z87.number().optional(),
  pin_number: z87.number().optional(),
  display_pin_label: z87.string().optional(),
  display_pin_label_text_parts: z87.array(schematic_text_part).min(1).optional(),
  display_pin_label_font_size: z87.number().positive().finite().optional(),
  subcircuit_id: z87.string().optional(),
  is_connected: z87.boolean().optional(),
  is_internal_circuit_port: z87.boolean().optional(),
  is_overlapping_internal_circuit_port: z87.boolean().optional(),
  has_input_arrow: z87.boolean().optional(),
  has_output_arrow: z87.boolean().optional(),
  is_drawn_with_inversion_circle: z87.boolean().optional()
}).describe("Defines a port on a schematic component");
expectTypesMatch(true);

// src/schematic/schematic_net_label.ts
import { z as z88 } from "zod";
var schematic_net_label = z88.object({
  type: z88.literal("schematic_net_label"),
  schematic_net_label_id: getZodPrefixedIdWithDefault("schematic_net_label"),
  schematic_sheet_id: z88.string().optional(),
  schematic_trace_id: z88.string().optional(),
  source_trace_id: z88.string().optional(),
  source_net_id: z88.string(),
  center: point,
  anchor_position: point.optional(),
  anchor_side: z88.enum(["top", "bottom", "left", "right"]),
  text: z88.string(),
  display_superscript: z88.string().optional(),
  symbol_name: z88.string().optional(),
  is_movable: z88.boolean().optional(),
  subcircuit_id: z88.string().optional()
});
expectTypesMatch(true);

// src/schematic/schematic_error.ts
import { z as z89 } from "zod";
var schematic_error = base_circuit_json_error.extend({
  type: z89.literal("schematic_error"),
  schematic_error_id: z89.string(),
  // eventually each error type should be broken out into a dir of files
  error_type: z89.literal("schematic_port_not_found").default("schematic_port_not_found"),
  subcircuit_id: z89.string().optional()
}).describe("Defines a schematic error on the schematic");
expectTypesMatch(true);

// src/schematic/schematic_layout_error.ts
import { z as z90 } from "zod";
var schematic_layout_error = base_circuit_json_error.extend({
  type: z90.literal("schematic_layout_error"),
  schematic_layout_error_id: getZodPrefixedIdWithDefault(
    "schematic_layout_error"
  ),
  error_type: z90.literal("schematic_layout_error").default("schematic_layout_error"),
  source_group_id: z90.string(),
  schematic_group_id: z90.string(),
  subcircuit_id: z90.string().optional()
}).describe("Error emitted when schematic layout fails for a group");
expectTypesMatch(true);

// src/schematic/schematic_debug_object.ts
import { z as z91 } from "zod";
var schematic_debug_object_base = z91.object({
  type: z91.literal("schematic_debug_object"),
  label: z91.string().optional(),
  subcircuit_id: z91.string().optional()
});
var schematic_debug_rect = schematic_debug_object_base.extend({
  shape: z91.literal("rect"),
  center: point,
  size
});
var schematic_debug_line = schematic_debug_object_base.extend({
  shape: z91.literal("line"),
  start: point,
  end: point
});
var schematic_debug_point = schematic_debug_object_base.extend({
  shape: z91.literal("point"),
  center: point
});
var schematic_debug_object = z91.discriminatedUnion("shape", [
  schematic_debug_rect,
  schematic_debug_line,
  schematic_debug_point
]);
expectTypesMatch(true);

// src/schematic/schematic_voltage_probe.ts
import { z as z92 } from "zod";
var schematic_voltage_probe = z92.object({
  type: z92.literal("schematic_voltage_probe"),
  schematic_voltage_probe_id: z92.string(),
  schematic_sheet_id: z92.string().optional(),
  source_component_id: z92.string().optional(),
  name: z92.string().optional(),
  position: point,
  schematic_trace_id: z92.string(),
  voltage: voltage.optional(),
  subcircuit_id: z92.string().optional(),
  color: z92.string().optional(),
  label_alignment: ninePointAnchor.optional()
}).describe("Defines a voltage probe measurement point on a schematic trace");
expectTypesMatch(true);

// src/schematic/schematic_manual_edit_conflict_warning.ts
import { z as z93 } from "zod";
var schematic_manual_edit_conflict_warning = z93.object({
  type: z93.literal("schematic_manual_edit_conflict_warning"),
  schematic_manual_edit_conflict_warning_id: getZodPrefixedIdWithDefault(
    "schematic_manual_edit_conflict_warning"
  ),
  warning_type: z93.literal("schematic_manual_edit_conflict_warning").default("schematic_manual_edit_conflict_warning"),
  message: z93.string(),
  schematic_component_id: z93.string(),
  schematic_group_id: z93.string().optional(),
  subcircuit_id: z93.string().optional(),
  source_component_id: z93.string()
}).describe(
  "Warning emitted when a component has both manual placement and explicit schX/schY coordinates"
);
expectTypesMatch(true);

// src/schematic/schematic_component_overlap_warning.ts
import { z as z94 } from "zod";
var schematic_component_overlap_warning = z94.object({
  type: z94.literal("schematic_component_overlap_warning"),
  schematic_component_overlap_warning_id: getZodPrefixedIdWithDefault(
    "schematic_component_overlap_warning"
  ),
  warning_type: z94.literal("schematic_component_overlap_warning").default("schematic_component_overlap_warning"),
  message: z94.string(),
  schematic_component_ids: z94.tuple([z94.string(), z94.string()]),
  schematic_sheet_id: z94.string().optional()
}).describe(
  "Warning emitted when the rendered bounds of two schematic components overlap"
);
expectTypesMatch(true);

// src/schematic/schematic_component_styling_warning.ts
import { z as z95 } from "zod";
var schematic_component_styling_warning = z95.object({
  type: z95.literal("schematic_component_styling_warning"),
  schematic_component_styling_warning_id: getZodPrefixedIdWithDefault(
    "schematic_component_styling_warning"
  ),
  warning_type: z95.literal("schematic_component_styling_warning").default("schematic_component_styling_warning"),
  message: z95.string(),
  schematic_component_id: z95.string(),
  styling_issue_type: z95.string(),
  schematic_port_ids: z95.array(z95.string()).optional(),
  source_component_id: z95.string().optional(),
  schematic_sheet_id: z95.string().optional(),
  subcircuit_id: z95.string().optional()
}).describe(
  "Warning emitted when a schematic component has a visual styling issue"
);
expectTypesMatch(true);

// src/schematic/schematic_element_outside_sheet_warning.ts
import { z as z96 } from "zod";
var schematic_element_outside_sheet_warning = z96.object({
  type: z96.literal("schematic_element_outside_sheet_warning"),
  schematic_element_outside_sheet_warning_id: getZodPrefixedIdWithDefault(
    "schematic_element_outside_sheet_warning"
  ),
  warning_type: z96.literal("schematic_element_outside_sheet_warning").default("schematic_element_outside_sheet_warning"),
  message: z96.string(),
  schematic_sheet_id: z96.string(),
  schematic_element_type: z96.enum([
    "schematic_component",
    "schematic_net_label",
    "schematic_trace"
  ]),
  schematic_element_id: z96.string()
}).describe(
  "Warning emitted when a schematic component, net label, or trace extends outside its schematic sheet"
);
expectTypesMatch(true);

// src/schematic/schematic_graphic.ts
import { z as z97 } from "zod";
var positiveFiniteDistance = distance.pipe(z97.number().positive().finite());
var schematic_graphic = z97.object({
  type: z97.literal("schematic_graphic"),
  schematic_graphic_id: getZodPrefixedIdWithDefault("schematic_graphic"),
  schematic_sheet_id: z97.string().optional(),
  asset: asset.optional(),
  svg_content: z97.string().optional(),
  width: positiveFiniteDistance.optional(),
  height: positiveFiniteDistance.optional()
}).describe(
  "References a graphic asset or inline SVG content with optional centered layout bounds on a schematic sheet"
).superRefine(({ asset: asset2, svg_content }, ctx) => {
  if (asset2 === void 0 && svg_content === void 0) {
    ctx.addIssue({
      code: z97.ZodIssueCode.custom,
      message: "At least one of asset or svg_content is required"
    });
  }
});
expectTypesMatch(true);

// src/schematic/schematic_group.ts
import { z as z98 } from "zod";
var schematic_group = z98.object({
  type: z98.literal("schematic_group"),
  schematic_group_id: getZodPrefixedIdWithDefault("schematic_group"),
  schematic_sheet_id: z98.string().optional(),
  source_group_id: z98.string(),
  is_subcircuit: z98.boolean().optional(),
  subcircuit_id: z98.string().optional(),
  width: length,
  height: length,
  center: point,
  schematic_component_ids: z98.array(z98.string()),
  show_as_schematic_box: z98.boolean().optional(),
  name: z98.string().optional(),
  description: z98.string().optional()
}).describe("Defines a group of components on the schematic");
expectTypesMatch(true);

// src/schematic/schematic_table.ts
import { z as z99 } from "zod";
var schematic_table = z99.object({
  type: z99.literal("schematic_table"),
  schematic_table_id: getZodPrefixedIdWithDefault("schematic_table"),
  schematic_sheet_id: z99.string().optional(),
  anchor_position: point,
  column_widths: z99.array(distance),
  row_heights: z99.array(distance),
  cell_padding: distance.optional(),
  border_width: distance.optional(),
  subcircuit_id: z99.string().optional(),
  schematic_component_id: z99.string().optional(),
  anchor: ninePointAnchor.optional()
}).describe("Defines a table on the schematic");
expectTypesMatch(true);

// src/schematic/schematic_table_cell.ts
import { z as z100 } from "zod";
var schematic_table_cell = z100.object({
  type: z100.literal("schematic_table_cell"),
  schematic_table_cell_id: getZodPrefixedIdWithDefault(
    "schematic_table_cell"
  ),
  schematic_sheet_id: z100.string().optional(),
  schematic_table_id: z100.string(),
  start_row_index: z100.number(),
  end_row_index: z100.number(),
  start_column_index: z100.number(),
  end_column_index: z100.number(),
  text: z100.string().optional(),
  center: point,
  width: distance,
  height: distance,
  horizontal_align: z100.enum(["left", "center", "right"]).optional(),
  vertical_align: z100.enum(["top", "middle", "bottom"]).optional(),
  font_size: distance.optional(),
  subcircuit_id: z100.string().optional()
}).describe("Defines a cell within a schematic_table");
expectTypesMatch(true);

// src/schematic/schematic_sheet.ts
import { z as z101 } from "zod";
var schematic_sheet_size = z101.enum(["a4", "ansi_b"]);
var schematic_sheet = z101.object({
  type: z101.literal("schematic_sheet"),
  schematic_sheet_id: getZodPrefixedIdWithDefault("schematic_sheet"),
  name: z101.string().optional(),
  sheet_index: z101.number().optional(),
  sheet_size: schematic_sheet_size.optional(),
  sheet_width: z101.number().positive().optional(),
  sheet_height: z101.number().positive().optional(),
  subcircuit_id: z101.string().optional(),
  outline_color: z101.string().optional()
}).describe(
  "Defines a schematic sheet or page that components can be placed on"
);
expectTypesMatch(true);

// src/schematic/schematic_missing_sheet_warning.ts
import { z as z102 } from "zod";
var schematic_missing_sheet_warning = z102.object({
  type: z102.literal("schematic_missing_sheet_warning"),
  schematic_missing_sheet_warning_id: getZodPrefixedIdWithDefault(
    "schematic_missing_sheet_warning"
  ),
  warning_type: z102.literal("schematic_missing_sheet_warning").default("schematic_missing_sheet_warning"),
  message: z102.string()
}).describe(
  "Circuit-wide warning emitted when a schematic has no schematic sheet. Display as a banner without attaching it to a component or drawing a target outline or leader line."
);
expectTypesMatch(true);

// src/pcb/properties/brep.ts
import { z as z103 } from "zod";
var point_with_bulge = z103.object({
  x: distance,
  y: distance,
  bulge: z103.number().optional()
});
expectTypesMatch(true);
var ring = z103.object({
  vertices: z103.array(point_with_bulge)
});
expectTypesMatch(true);
var brep_shape = z103.object({
  outer_ring: ring,
  inner_rings: z103.array(ring).default([])
});
expectTypesMatch(true);

// src/pcb/properties/insertion_direction.ts
import { z as z104 } from "zod";
var insertionDirectionToCanonical = {
  from_left: "from_left",
  from_right: "from_right",
  from_top: "from_top",
  from_bottom: "from_bottom",
  from_above: "from_above",
  from_below: "from_below",
  from_x_neg: "from_left",
  from_x_pos: "from_right",
  from_y_pos: "from_top",
  from_y_neg: "from_bottom",
  from_z_pos: "from_above",
  from_z_neg: "from_below",
  /** @deprecated use `from_top` */
  from_front: "from_top",
  /** @deprecated use `from_bottom` */
  from_back: "from_bottom"
};
var insertionDirectionToVector = {
  from_left: { x: -1, y: 0, z: 0 },
  from_right: { x: 1, y: 0, z: 0 },
  from_top: { x: 0, y: 1, z: 0 },
  from_bottom: { x: 0, y: -1, z: 0 },
  from_above: { x: 0, y: 0, z: 1 },
  from_below: { x: 0, y: 0, z: -1 }
};
var insertion_direction = z104.enum([
  "from_left",
  "from_right",
  "from_top",
  "from_bottom",
  "from_above",
  "from_below",
  "from_x_neg",
  "from_x_pos",
  "from_y_pos",
  "from_y_neg",
  "from_z_pos",
  "from_z_neg",
  // Deprecated, accepted so existing Circuit JSON keeps parsing.
  "from_front",
  "from_back"
]).transform((value) => insertionDirectionToCanonical[value]).describe(
  'The side exposing the receptacle where the cable or mating part is attached, following the 2D PCB diagram convention, not a 3D viewport frame. In project coordinate space, "from_top" is +Y, "from_bottom" -Y, "from_left" -X, "from_right" +X, "from_above" +Z and "from_below" -Z. A receptacle on the +Y edge is "from_top" even though the plug moves in -Y as it seats. Cartesian spellings such as "from_y_pos" are accepted and normalized to the named values, as are the deprecated "from_front" (now "from_top") and "from_back" (now "from_bottom").'
);
expectTypesMatch(true);
expectTypesMatch(
  true
);

// src/pcb/properties/pcb_pin1_location.ts
import { z as z105 } from "zod";
var pcb_pin1_location = z105.enum([
  "leftside_top",
  "leftside_bottom",
  "rightside_top",
  "rightside_bottom",
  "topside_left",
  "topside_right",
  "bottomside_left",
  "bottomside_right"
]);
expectTypesMatch(true);
var pin1LocationRotationCycles = [
  [
    "leftside_top",
    "bottomside_left",
    "rightside_bottom",
    "topside_right"
  ],
  [
    "leftside_bottom",
    "bottomside_right",
    "rightside_top",
    "topside_left"
  ]
];
var getRotationBetweenPcbPin1Locations = (from, to) => {
  for (const cycle of pin1LocationRotationCycles) {
    const fromIndex = cycle.indexOf(from);
    const toIndex = cycle.indexOf(to);
    if (fromIndex !== -1 && toIndex !== -1) {
      return (toIndex - fromIndex + cycle.length) % cycle.length * 90;
    }
  }
  return null;
};

// src/pcb/properties/pcb_route_hints.ts
import { z as z106 } from "zod";
var pcb_route_hint = z106.object({
  x: distance,
  y: distance,
  via: z106.boolean().optional(),
  via_to_layer: layer_ref.optional()
});
var pcb_route_hints = z106.array(pcb_route_hint);
expectTypesMatch(true);
expectTypesMatch(true);

// src/pcb/properties/route_hint_point.ts
import { z as z107 } from "zod";
var route_hint_point = z107.object({
  x: distance,
  y: distance,
  via: z107.boolean().optional(),
  to_layer: layer_ref.optional(),
  trace_width: distance.optional()
});
expectTypesMatch(true);

// src/pcb/properties/manufacturing_drc_properties.ts
import { z as z108 } from "zod";
var manufacturing_drc_properties = z108.object({
  min_trace_width: length.optional(),
  min_board_edge_clearance: length.optional(),
  min_via_hole_edge_to_via_hole_edge_clearance: length.optional(),
  min_plated_hole_drill_edge_to_drill_edge_clearance: length.optional(),
  min_trace_to_pad_edge_clearance: length.optional(),
  min_trace_to_hole_edge_clearance: length.optional().describe(
    "Minimum distance from a trace copper edge to a non-plated hole edge, in mm. No default is applied when omitted."
  ),
  min_pad_edge_to_pad_edge_clearance: length.optional(),
  min_same_net_trace_edge_to_trace_edge_clearance: length.optional(),
  min_different_net_trace_edge_to_trace_edge_clearance: length.optional(),
  min_via_edge_to_pad_edge_clearance: length.optional(),
  min_via_hole_diameter: length.optional(),
  min_via_pad_diameter: length.optional()
});

// src/pcb/pcb_component.ts
import { z as z109 } from "zod";
var pcb_component = z109.object({
  type: z109.literal("pcb_component"),
  pcb_component_id: getZodPrefixedIdWithDefault("pcb_component"),
  source_component_id: z109.string(),
  center: point,
  layer: layer_ref,
  rotation,
  display_offset_x: z109.string().optional().describe(
    "How to display the x offset for this part, usually corresponding with how the user specified it"
  ),
  display_offset_y: z109.string().optional().describe(
    "How to display the y offset for this part, usually corresponding with how the user specified it"
  ),
  width: length,
  height: length,
  do_not_place: z109.boolean().optional(),
  is_allowed_to_be_off_board: z109.boolean().optional(),
  subcircuit_id: z109.string().optional(),
  pcb_group_id: z109.string().optional(),
  position_mode: z109.enum([
    "packed",
    "relative_to_group_anchor",
    "relative_to_another_component",
    "none"
  ]).optional(),
  anchor_position: point.optional(),
  anchor_alignment: ninePointAnchor.optional(),
  positioned_relative_to_pcb_group_id: z109.string().optional(),
  positioned_relative_to_pcb_board_id: z109.string().optional(),
  cable_insertion_center: point.optional(),
  insertion_direction: insertion_direction.optional(),
  pin1_location: pcb_pin1_location.optional().describe(
    "Location of pin 1 on the unrotated, top-view component footprint"
  ),
  supplier_pin1_location_map: z109.record(supplier_name, pcb_pin1_location).optional().describe(
    "Pin 1 location for each supplier's unrotated, top-view footprint"
  ),
  metadata: z109.object({
    kicad_footprint: kicadFootprintMetadata.optional()
  }).optional(),
  obstructs_within_bounds: z109.boolean().default(true).describe(
    "Does this component take up all the space within its bounds on a layer. This is generally true except for when separated pin headers are being represented by a single component (in which case, chips can be placed between the pin headers) or for tall modules where chips fit underneath"
  )
}).describe("Defines a component on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_debug_object.ts
import { z as z110 } from "zod";
var pcb_debug_object_base = z110.object({
  type: z110.literal("pcb_debug_object"),
  pcb_debug_object_id: getZodPrefixedIdWithDefault("pcb_debug_object"),
  label: z110.string().optional(),
  subcircuit_id: z110.string().optional()
});
var pcb_debug_rect = pcb_debug_object_base.extend({
  shape: z110.literal("rect"),
  center: point,
  size
});
var pcb_debug_line = pcb_debug_object_base.extend({
  shape: z110.literal("line"),
  start: point,
  end: point
});
var pcb_debug_point = pcb_debug_object_base.extend({
  shape: z110.literal("point"),
  center: point
});
var pcb_debug_object = z110.discriminatedUnion("shape", [
  pcb_debug_rect,
  pcb_debug_line,
  pcb_debug_point
]);
expectTypesMatch(true);

// src/pcb/pcb_hole.ts
import { z as z111 } from "zod";
var pcb_hole_circle = z111.object({
  type: z111.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z111.string().optional(),
  subcircuit_id: z111.string().optional(),
  pcb_component_id: z111.string().optional(),
  hole_shape: z111.literal("circle"),
  hole_diameter: z111.number(),
  x: distance,
  y: distance,
  is_covered_with_solder_mask: z111.boolean().optional(),
  soldermask_margin: z111.number().optional()
});
var pcb_hole_circle_shape = pcb_hole_circle.describe(
  "Defines a circular hole on the PCB"
);
expectTypesMatch(true);
var pcb_hole_rect = z111.object({
  type: z111.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z111.string().optional(),
  subcircuit_id: z111.string().optional(),
  pcb_component_id: z111.string().optional(),
  hole_shape: z111.literal("rect"),
  hole_width: z111.number(),
  hole_height: z111.number(),
  x: distance,
  y: distance,
  is_covered_with_solder_mask: z111.boolean().optional(),
  soldermask_margin: z111.number().optional()
});
var pcb_hole_rect_shape = pcb_hole_rect.describe(
  "Defines a rectangular (square-capable) hole on the PCB. Use equal width/height for square."
);
expectTypesMatch(true);
var pcb_hole_circle_or_square = z111.object({
  type: z111.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z111.string().optional(),
  subcircuit_id: z111.string().optional(),
  pcb_component_id: z111.string().optional(),
  hole_shape: z111.enum(["circle", "square"]),
  hole_diameter: z111.number(),
  x: distance,
  y: distance,
  is_covered_with_solder_mask: z111.boolean().optional(),
  soldermask_margin: z111.number().optional()
});
var pcb_hole_circle_or_square_shape = pcb_hole_circle_or_square.describe(
  "Defines a circular or square hole on the PCB"
);
expectTypesMatch(true);
var pcb_hole_oval = z111.object({
  type: z111.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z111.string().optional(),
  subcircuit_id: z111.string().optional(),
  pcb_component_id: z111.string().optional(),
  hole_shape: z111.literal("oval"),
  hole_width: z111.number(),
  hole_height: z111.number(),
  x: distance,
  y: distance,
  is_covered_with_solder_mask: z111.boolean().optional(),
  soldermask_margin: z111.number().optional()
});
var pcb_hole_oval_shape = pcb_hole_oval.describe(
  "Defines an oval hole on the PCB"
);
expectTypesMatch(true);
var pcb_hole_pill = z111.object({
  type: z111.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z111.string().optional(),
  subcircuit_id: z111.string().optional(),
  pcb_component_id: z111.string().optional(),
  hole_shape: z111.literal("pill"),
  hole_width: z111.number(),
  hole_height: z111.number(),
  x: distance,
  y: distance,
  is_covered_with_solder_mask: z111.boolean().optional(),
  soldermask_margin: z111.number().optional()
});
var pcb_hole_pill_shape = pcb_hole_pill.describe(
  "Defines a pill-shaped hole on the PCB"
);
expectTypesMatch(true);
var pcb_hole_rotated_pill = z111.object({
  type: z111.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z111.string().optional(),
  subcircuit_id: z111.string().optional(),
  pcb_component_id: z111.string().optional(),
  hole_shape: z111.literal("rotated_pill"),
  hole_width: z111.number(),
  hole_height: z111.number(),
  x: distance,
  y: distance,
  ccw_rotation: rotation,
  is_covered_with_solder_mask: z111.boolean().optional(),
  soldermask_margin: z111.number().optional()
});
var pcb_hole_rotated_pill_shape = pcb_hole_rotated_pill.describe(
  "Defines a rotated pill-shaped hole on the PCB"
);
expectTypesMatch(true);
var pcb_hole = pcb_hole_circle_or_square.or(pcb_hole_oval).or(pcb_hole_pill).or(pcb_hole_rotated_pill).or(pcb_hole_circle).or(pcb_hole_rect);

// src/pcb/pcb_plated_hole.ts
import { z as z112 } from "zod";
var pcb_plated_hole_circle = z112.object({
  type: z112.literal("pcb_plated_hole"),
  shape: z112.literal("circle"),
  pcb_group_id: z112.string().optional(),
  subcircuit_id: z112.string().optional(),
  outer_diameter: z112.number(),
  hole_diameter: z112.number(),
  is_covered_with_solder_mask: z112.boolean().optional(),
  x: distance,
  y: distance,
  layers: z112.array(layer_ref),
  port_hints: z112.array(z112.string()).optional(),
  pcb_component_id: z112.string().optional(),
  pcb_port_id: z112.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z112.number().optional()
});
var pcb_plated_hole_oval = z112.object({
  type: z112.literal("pcb_plated_hole"),
  shape: z112.enum(["oval", "pill"]),
  pcb_group_id: z112.string().optional(),
  subcircuit_id: z112.string().optional(),
  outer_width: z112.number(),
  outer_height: z112.number(),
  hole_width: z112.number(),
  hole_height: z112.number(),
  is_covered_with_solder_mask: z112.boolean().optional(),
  x: distance,
  y: distance,
  ccw_rotation: rotation,
  layers: z112.array(layer_ref),
  port_hints: z112.array(z112.string()).optional(),
  pcb_component_id: z112.string().optional(),
  pcb_port_id: z112.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z112.number().optional()
});
var pcb_circular_hole_with_rect_pad = z112.object({
  type: z112.literal("pcb_plated_hole"),
  shape: z112.literal("circular_hole_with_rect_pad"),
  pcb_group_id: z112.string().optional(),
  subcircuit_id: z112.string().optional(),
  hole_shape: z112.literal("circle"),
  pad_shape: z112.literal("rect"),
  hole_diameter: z112.number(),
  rect_pad_width: z112.number(),
  rect_pad_height: z112.number(),
  rect_border_radius: z112.number().optional(),
  hole_offset_x: distance.default(0),
  hole_offset_y: distance.default(0),
  is_covered_with_solder_mask: z112.boolean().optional(),
  x: distance,
  y: distance,
  layers: z112.array(layer_ref),
  port_hints: z112.array(z112.string()).optional(),
  pcb_component_id: z112.string().optional(),
  pcb_port_id: z112.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z112.number().optional(),
  rect_ccw_rotation: rotation.optional()
});
var pcb_pill_hole_with_rect_pad = z112.object({
  type: z112.literal("pcb_plated_hole"),
  shape: z112.literal("pill_hole_with_rect_pad"),
  pcb_group_id: z112.string().optional(),
  subcircuit_id: z112.string().optional(),
  hole_shape: z112.literal("pill"),
  pad_shape: z112.literal("rect"),
  hole_width: z112.number(),
  hole_height: z112.number(),
  rect_pad_width: z112.number(),
  rect_pad_height: z112.number(),
  rect_border_radius: z112.number().optional(),
  hole_offset_x: distance.default(0),
  hole_offset_y: distance.default(0),
  is_covered_with_solder_mask: z112.boolean().optional(),
  x: distance,
  y: distance,
  layers: z112.array(layer_ref),
  port_hints: z112.array(z112.string()).optional(),
  pcb_component_id: z112.string().optional(),
  pcb_port_id: z112.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z112.number().optional()
});
var pcb_rotated_pill_hole_with_rect_pad = z112.object({
  type: z112.literal("pcb_plated_hole"),
  shape: z112.literal("rotated_pill_hole_with_rect_pad"),
  pcb_group_id: z112.string().optional(),
  subcircuit_id: z112.string().optional(),
  hole_shape: z112.literal("rotated_pill"),
  pad_shape: z112.literal("rect"),
  hole_width: z112.number(),
  hole_height: z112.number(),
  hole_ccw_rotation: rotation,
  rect_pad_width: z112.number(),
  rect_pad_height: z112.number(),
  rect_border_radius: z112.number().optional(),
  rect_ccw_rotation: rotation,
  hole_offset_x: distance.default(0),
  hole_offset_y: distance.default(0),
  is_covered_with_solder_mask: z112.boolean().optional(),
  x: distance,
  y: distance,
  layers: z112.array(layer_ref),
  port_hints: z112.array(z112.string()).optional(),
  pcb_component_id: z112.string().optional(),
  pcb_port_id: z112.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z112.number().optional()
});
var pcb_hole_with_polygon_pad = z112.object({
  type: z112.literal("pcb_plated_hole"),
  shape: z112.literal("hole_with_polygon_pad"),
  pcb_group_id: z112.string().optional(),
  subcircuit_id: z112.string().optional(),
  hole_shape: z112.enum(["circle", "oval", "pill", "rotated_pill"]),
  hole_diameter: z112.number().optional(),
  hole_width: z112.number().optional(),
  hole_height: z112.number().optional(),
  pad_outline: z112.array(
    z112.object({
      x: distance,
      y: distance
    })
  ).min(3),
  hole_offset_x: distance.default(0),
  hole_offset_y: distance.default(0),
  is_covered_with_solder_mask: z112.boolean().optional(),
  x: distance,
  y: distance,
  layers: z112.array(layer_ref),
  port_hints: z112.array(z112.string()).optional(),
  pcb_component_id: z112.string().optional(),
  pcb_port_id: z112.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z112.number().optional(),
  ccw_rotation: rotation.optional()
});
var pcb_plated_hole = z112.union([
  pcb_plated_hole_circle,
  pcb_plated_hole_oval,
  pcb_circular_hole_with_rect_pad,
  pcb_pill_hole_with_rect_pad,
  pcb_rotated_pill_hole_with_rect_pad,
  pcb_hole_with_polygon_pad
]);
expectTypesMatch(
  true
);
expectTypesMatch(true);
expectTypesMatch(true);
expectTypesMatch(true);
expectTypesMatch(true);
expectTypesMatch(true);

// src/pcb/pcb_port.ts
import { z as z113 } from "zod";
var pcb_port = z113.object({
  type: z113.literal("pcb_port"),
  pcb_port_id: getZodPrefixedIdWithDefault("pcb_port"),
  pcb_group_id: z113.string().optional(),
  subcircuit_id: z113.string().optional(),
  source_port_id: z113.string(),
  pcb_component_id: z113.string().optional(),
  x: distance,
  y: distance,
  layers: z113.array(layer_ref),
  is_board_pinout: z113.boolean().optional()
}).describe("Defines a port on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_smtpad.ts
import { z as z114 } from "zod";
var pcb_smtpad_circle = z114.object({
  type: z114.literal("pcb_smtpad"),
  shape: z114.literal("circle"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z114.string().optional(),
  subcircuit_id: z114.string().optional(),
  x: distance,
  y: distance,
  radius: z114.number(),
  layer: layer_ref,
  port_hints: z114.array(z114.string()).optional(),
  pcb_component_id: z114.string().optional(),
  pcb_port_id: z114.string().optional(),
  is_covered_with_solder_mask: z114.boolean().optional(),
  soldermask_margin: z114.number().optional(),
  solderpaste_margin: z114.number().optional()
});
var pcb_smtpad_rect = z114.object({
  type: z114.literal("pcb_smtpad"),
  shape: z114.literal("rect"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z114.string().optional(),
  subcircuit_id: z114.string().optional(),
  x: distance,
  y: distance,
  width: z114.number(),
  height: z114.number(),
  rect_border_radius: z114.number().optional(),
  corner_radius: z114.number().optional(),
  layer: layer_ref,
  port_hints: z114.array(z114.string()).optional(),
  pcb_component_id: z114.string().optional(),
  pcb_port_id: z114.string().optional(),
  is_covered_with_solder_mask: z114.boolean().optional(),
  soldermask_margin: z114.number().optional(),
  soldermask_margin_left: z114.number().optional(),
  soldermask_margin_top: z114.number().optional(),
  soldermask_margin_right: z114.number().optional(),
  soldermask_margin_bottom: z114.number().optional(),
  solderpaste_margin: z114.number().optional()
});
var pcb_smtpad_rotated_rect = z114.object({
  type: z114.literal("pcb_smtpad"),
  shape: z114.literal("rotated_rect"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z114.string().optional(),
  subcircuit_id: z114.string().optional(),
  x: distance,
  y: distance,
  width: z114.number(),
  height: z114.number(),
  rect_border_radius: z114.number().optional(),
  corner_radius: z114.number().optional(),
  ccw_rotation: rotation,
  layer: layer_ref,
  port_hints: z114.array(z114.string()).optional(),
  pcb_component_id: z114.string().optional(),
  pcb_port_id: z114.string().optional(),
  is_covered_with_solder_mask: z114.boolean().optional(),
  soldermask_margin: z114.number().optional(),
  soldermask_margin_left: z114.number().optional(),
  soldermask_margin_top: z114.number().optional(),
  soldermask_margin_right: z114.number().optional(),
  soldermask_margin_bottom: z114.number().optional(),
  solderpaste_margin: z114.number().optional()
});
var pcb_smtpad_pill = z114.object({
  type: z114.literal("pcb_smtpad"),
  shape: z114.literal("pill"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z114.string().optional(),
  subcircuit_id: z114.string().optional(),
  x: distance,
  y: distance,
  width: z114.number(),
  height: z114.number(),
  radius: z114.number(),
  layer: layer_ref,
  port_hints: z114.array(z114.string()).optional(),
  pcb_component_id: z114.string().optional(),
  pcb_port_id: z114.string().optional(),
  is_covered_with_solder_mask: z114.boolean().optional(),
  soldermask_margin: z114.number().optional(),
  solderpaste_margin: z114.number().optional()
});
var pcb_smtpad_rotated_pill = z114.object({
  type: z114.literal("pcb_smtpad"),
  shape: z114.literal("rotated_pill"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z114.string().optional(),
  subcircuit_id: z114.string().optional(),
  x: distance,
  y: distance,
  width: z114.number(),
  height: z114.number(),
  radius: z114.number(),
  ccw_rotation: rotation,
  layer: layer_ref,
  port_hints: z114.array(z114.string()).optional(),
  pcb_component_id: z114.string().optional(),
  pcb_port_id: z114.string().optional(),
  is_covered_with_solder_mask: z114.boolean().optional(),
  soldermask_margin: z114.number().optional(),
  solderpaste_margin: z114.number().optional()
});
var pcb_smtpad_polygon = z114.object({
  type: z114.literal("pcb_smtpad"),
  shape: z114.literal("polygon"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z114.string().optional(),
  subcircuit_id: z114.string().optional(),
  points: z114.array(point),
  layer: layer_ref,
  port_hints: z114.array(z114.string()).optional(),
  pcb_component_id: z114.string().optional(),
  pcb_port_id: z114.string().optional(),
  is_covered_with_solder_mask: z114.boolean().optional(),
  soldermask_margin: z114.number().optional(),
  solderpaste_margin: z114.number().optional()
});
var pcb_smtpad = z114.discriminatedUnion("shape", [
  pcb_smtpad_circle,
  pcb_smtpad_rect,
  pcb_smtpad_rotated_rect,
  pcb_smtpad_rotated_pill,
  pcb_smtpad_pill,
  pcb_smtpad_polygon
]).describe("Defines an SMT pad on the PCB");
expectTypesMatch(true);
expectTypesMatch(true);
expectTypesMatch(true);
expectTypesMatch(true);
expectTypesMatch(true);
expectTypesMatch(true);

// src/pcb/pcb_solder_paste.ts
import { z as z115 } from "zod";
var pcb_solder_paste_circle = z115.object({
  type: z115.literal("pcb_solder_paste"),
  shape: z115.literal("circle"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z115.string().optional(),
  subcircuit_id: z115.string().optional(),
  x: distance,
  y: distance,
  radius: z115.number(),
  layer: layer_ref,
  pcb_component_id: z115.string().optional(),
  pcb_smtpad_id: z115.string().optional()
});
var pcb_solder_paste_rect = z115.object({
  type: z115.literal("pcb_solder_paste"),
  shape: z115.literal("rect"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z115.string().optional(),
  subcircuit_id: z115.string().optional(),
  x: distance,
  y: distance,
  width: z115.number(),
  height: z115.number(),
  layer: layer_ref,
  pcb_component_id: z115.string().optional(),
  pcb_smtpad_id: z115.string().optional()
});
var pcb_solder_paste_pill = z115.object({
  type: z115.literal("pcb_solder_paste"),
  shape: z115.literal("pill"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z115.string().optional(),
  subcircuit_id: z115.string().optional(),
  x: distance,
  y: distance,
  width: z115.number(),
  height: z115.number(),
  radius: z115.number(),
  layer: layer_ref,
  pcb_component_id: z115.string().optional(),
  pcb_smtpad_id: z115.string().optional()
});
var pcb_solder_paste_rotated_rect = z115.object({
  type: z115.literal("pcb_solder_paste"),
  shape: z115.literal("rotated_rect"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z115.string().optional(),
  subcircuit_id: z115.string().optional(),
  x: distance,
  y: distance,
  width: z115.number(),
  height: z115.number(),
  ccw_rotation: distance,
  layer: layer_ref,
  pcb_component_id: z115.string().optional(),
  pcb_smtpad_id: z115.string().optional()
});
var pcb_solder_paste_rotated_pill = z115.object({
  type: z115.literal("pcb_solder_paste"),
  shape: z115.literal("rotated_pill"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z115.string().optional(),
  subcircuit_id: z115.string().optional(),
  x: distance,
  y: distance,
  width: z115.number(),
  height: z115.number(),
  radius: z115.number(),
  ccw_rotation: rotation,
  layer: layer_ref,
  pcb_component_id: z115.string().optional(),
  pcb_smtpad_id: z115.string().optional()
});
var pcb_solder_paste_oval = z115.object({
  type: z115.literal("pcb_solder_paste"),
  shape: z115.literal("oval"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z115.string().optional(),
  subcircuit_id: z115.string().optional(),
  x: distance,
  y: distance,
  width: z115.number(),
  height: z115.number(),
  layer: layer_ref,
  pcb_component_id: z115.string().optional(),
  pcb_smtpad_id: z115.string().optional()
});
var pcb_solder_paste = z115.union([
  pcb_solder_paste_circle,
  pcb_solder_paste_rect,
  pcb_solder_paste_pill,
  pcb_solder_paste_rotated_rect,
  pcb_solder_paste_rotated_pill,
  pcb_solder_paste_oval
]).describe("Defines solderpaste on the PCB");
expectTypesMatch(true);
expectTypesMatch(true);
expectTypesMatch(true);
expectTypesMatch(
  true
);
expectTypesMatch(
  true
);
expectTypesMatch(true);

// src/pcb/pcb_soldermask_opening.ts
import { z as z116 } from "zod";
var finite_distance = distance.pipe(z116.number().finite());
var positive_distance = distance.pipe(z116.number().finite().positive());
var opening_base = z116.object({
  type: z116.literal("pcb_soldermask_opening"),
  pcb_soldermask_opening_id: getZodPrefixedIdWithDefault(
    "pcb_soldermask_opening"
  ),
  layer: layer_ref.pipe(visible_layer),
  pcb_component_id: z116.string().optional(),
  pcb_group_id: z116.string().optional(),
  subcircuit_id: z116.string().optional()
});
var circle = opening_base.extend({
  shape: z116.literal("circle"),
  x: finite_distance,
  y: finite_distance,
  radius: positive_distance
});
var rect = opening_base.extend({
  shape: z116.literal("rect"),
  x: finite_distance,
  y: finite_distance,
  width: positive_distance,
  height: positive_distance
});
var rotated_rect = rect.extend({
  shape: z116.literal("rotated_rect"),
  ccw_rotation: rotation.pipe(z116.number().finite())
});
var polygon = opening_base.extend({
  shape: z116.literal("polygon"),
  points: z116.array(point.extend({ x: finite_distance, y: finite_distance })).min(3)
});
var pcb_soldermask_opening = z116.discriminatedUnion("shape", [circle, rect, rotated_rect, polygon]).describe(
  "An explicit opening in the top or bottom solder mask. Removes mask without adding copper or solder paste."
);
expectTypesMatch(
  true
);

// src/pcb/pcb_text.ts
import { z as z117 } from "zod";
var pcb_text = z117.object({
  type: z117.literal("pcb_text"),
  pcb_text_id: getZodPrefixedIdWithDefault("pcb_text"),
  pcb_group_id: z117.string().optional(),
  subcircuit_id: z117.string().optional(),
  text: z117.string(),
  center: point,
  layer: layer_ref,
  width: length,
  height: length,
  lines: z117.number(),
  // @ts-ignore
  align: z117.enum(["bottom-left"])
}).describe("Defines text on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_trace.ts
import { z as z118 } from "zod";
var positive_width = distance.pipe(z118.number().finite().positive());
var pcb_trace_route_point_wire = z118.object({
  route_type: z118.literal("wire"),
  x: distance,
  y: distance,
  width: distance,
  start_width: positive_width.optional(),
  end_width: positive_width.optional(),
  width_interpolation_mode: z118.enum(["linear", "quadratic"]).optional(),
  copper_pour_id: z118.string().optional(),
  is_inside_copper_pour: z118.boolean().optional(),
  start_pcb_port_id: z118.string().optional(),
  end_pcb_port_id: z118.string().optional(),
  layer: layer_ref
}).superRefine((wire, ctx) => {
  const present = [
    wire.start_width,
    wire.end_width,
    wire.width_interpolation_mode
  ].filter((v) => v !== void 0).length;
  if (present === 0) return;
  if (present !== 3) {
    ctx.addIssue({
      code: z118.ZodIssueCode.custom,
      message: "Wire taper requires start_width, end_width and width_interpolation_mode together"
    });
  }
  if (wire.width !== wire.start_width) {
    ctx.addIssue({
      code: z118.ZodIssueCode.custom,
      path: ["start_width"],
      message: "start_width must equal width"
    });
  }
  if (!Number.isFinite(wire.x) || !Number.isFinite(wire.y)) {
    ctx.addIssue({
      code: z118.ZodIssueCode.custom,
      message: "Tapered wire coordinates must be finite"
    });
  }
});
var pcb_trace_route_point_via = z118.object({
  route_type: z118.literal("via"),
  x: distance,
  y: distance,
  copper_pour_id: z118.string().optional(),
  is_inside_copper_pour: z118.boolean().optional(),
  hole_diameter: distance.optional(),
  outer_diameter: distance.optional(),
  tented_on_top: z118.boolean().optional(),
  tented_on_bottom: z118.boolean().optional(),
  from_layer: layer_ref,
  to_layer: layer_ref
});
var pcb_trace_route_point_through_pad = z118.object({
  route_type: z118.literal("through_pad"),
  start: point,
  end: point,
  width: distance,
  start_layer: layer_ref,
  end_layer: layer_ref,
  pcb_smtpad_id: z118.string().optional(),
  pcb_plated_hole_id: z118.string().optional()
});
var pcb_trace_route_point = z118.union([
  pcb_trace_route_point_wire,
  pcb_trace_route_point_via,
  pcb_trace_route_point_through_pad
]);
var pcb_trace = z118.object({
  type: z118.literal("pcb_trace"),
  source_trace_id: z118.string().optional(),
  pcb_component_id: z118.string().optional(),
  pcb_trace_id: getZodPrefixedIdWithDefault("pcb_trace"),
  pcb_group_id: z118.string().optional(),
  subcircuit_id: z118.string().optional(),
  route_thickness_mode: z118.enum(["constant", "interpolated"]).default("constant").optional(),
  route_order_index: z118.number().optional(),
  should_round_corners: z118.boolean().optional(),
  trace_length: z118.number().optional(),
  is_antenna_trace: z118.boolean().optional(),
  highlight_color: z118.string().optional(),
  route: z118.array(pcb_trace_route_point).superRefine((route, ctx) => {
    for (const [i, wire] of route.entries()) {
      if (wire.route_type !== "wire" || wire.width_interpolation_mode === void 0)
        continue;
      const next = route[i + 1];
      const end = next?.route_type === "through_pad" ? next.start : next;
      const layer = next?.route_type === "wire" ? next.layer : next?.route_type === "via" ? next.from_layer : next?.start_layer;
      const length4 = end ? Math.hypot(end.x - wire.x, end.y - wire.y) : NaN;
      if (!Number.isFinite(length4) || length4 <= 0 || layer !== wire.layer) {
        ctx.addIssue({
          code: z118.ZodIssueCode.custom,
          path: [i],
          message: "Tapered wire must lead to a distinct finite next point on the same layer"
        });
      }
    }
  })
}).describe("Defines a trace on the PCB");
expectTypesMatch(true);
expectTypesMatch(true);

// src/pcb/pcb_trace_warning.ts
import { z as z119 } from "zod";
var pcb_trace_warning = z119.object({
  type: z119.literal("pcb_trace_warning"),
  pcb_trace_warning_id: getZodPrefixedIdWithDefault("pcb_trace_warning"),
  warning_type: z119.literal("pcb_trace_warning").default("pcb_trace_warning"),
  message: z119.string(),
  center: point.optional(),
  pcb_trace_id: z119.string(),
  source_trace_id: z119.string(),
  pcb_component_ids: z119.array(z119.string()),
  pcb_port_ids: z119.array(z119.string()),
  subcircuit_id: z119.string().optional()
}).describe("Defines a trace warning on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_trace_too_long_error.ts
import { z as z120 } from "zod";
var pcb_trace_too_long_error = z120.object({
  type: z120.literal("pcb_trace_too_long_error"),
  pcb_trace_too_long_error_id: getZodPrefixedIdWithDefault(
    "pcb_trace_too_long_error"
  ),
  error_type: z120.literal("pcb_trace_too_long_error").default("pcb_trace_too_long_error"),
  message: z120.string(),
  pcb_trace_id: z120.string(),
  source_net_id: z120.string().optional(),
  source_trace_id: z120.string().optional(),
  actual_trace_length: distance,
  maximum_trace_length: distance,
  subcircuit_id: z120.string().optional()
}).describe(
  "Error emitted when a PCB trace is longer than its maximum allowed length"
);
expectTypesMatch(true);

// src/pcb/pcb_bus_length_skew_error.ts
import { z as z121 } from "zod";
var pcb_bus_length_skew_error = base_circuit_json_error.extend({
  type: z121.literal("pcb_bus_length_skew_error"),
  pcb_bus_length_skew_error_id: getZodPrefixedIdWithDefault(
    "pcb_bus_length_skew_error"
  ),
  error_type: z121.literal("pcb_bus_length_skew_error").default("pcb_bus_length_skew_error"),
  source_bus_id: z121.string(),
  source_trace_ids: z121.array(z121.string()),
  pcb_trace_ids: z121.array(z121.string()),
  actual_length_skew: z121.number().nonnegative().finite(),
  maximum_length_skew: z121.number().nonnegative().finite(),
  subcircuit_id: z121.string().optional()
});
expectTypesMatch(true);

// src/pcb/pcb_trace_too_long_warning.ts
import { z as z122 } from "zod";
var pcb_trace_too_long_warning = z122.object({
  type: z122.literal("pcb_trace_too_long_warning"),
  pcb_trace_too_long_warning_id: getZodPrefixedIdWithDefault(
    "pcb_trace_too_long_warning"
  ),
  warning_type: z122.literal("pcb_trace_too_long_warning").default("pcb_trace_too_long_warning"),
  message: z122.string(),
  pcb_trace_id: z122.string(),
  source_net_id: z122.string().optional(),
  source_trace_id: z122.string().optional(),
  actual_trace_length: distance,
  maximum_trace_length: distance,
  subcircuit_id: z122.string().optional()
}).describe(
  "Warning emitted when a PCB trace is longer than its maximum allowed length"
);
expectTypesMatch(true);

// src/pcb/pcb_trace_too_many_vias_warning.ts
import { z as z123 } from "zod";
var pcb_trace_too_many_vias_warning = z123.object({
  type: z123.literal("pcb_trace_too_many_vias_warning"),
  pcb_trace_too_many_vias_warning_id: getZodPrefixedIdWithDefault(
    "pcb_trace_too_many_vias_warning"
  ),
  warning_type: z123.literal("pcb_trace_too_many_vias_warning").default("pcb_trace_too_many_vias_warning"),
  message: z123.string(),
  pcb_trace_id: z123.string(),
  source_net_id: z123.string().optional(),
  source_trace_id: z123.string().optional(),
  actual_via_count: z123.number().int().nonnegative(),
  maximum_via_count: z123.number().int().nonnegative(),
  subcircuit_id: z123.string().optional()
}).describe(
  "Warning emitted when a PCB trace has more vias than its maximum allowed count"
);
expectTypesMatch(true);

// src/pcb/pcb_trace_error.ts
import { z as z124 } from "zod";
var pcb_trace_error = base_circuit_json_error.extend({
  type: z124.literal("pcb_trace_error"),
  pcb_trace_error_id: getZodPrefixedIdWithDefault("pcb_trace_error"),
  error_type: z124.literal("pcb_trace_error").default("pcb_trace_error"),
  center: point.optional(),
  pcb_trace_id: z124.string(),
  source_trace_id: z124.string(),
  pcb_component_ids: z124.array(z124.string()),
  pcb_port_ids: z124.array(z124.string()),
  subcircuit_id: z124.string().optional()
}).describe("Defines a trace error on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_trace_missing_error.ts
import { z as z125 } from "zod";
var pcb_trace_missing_error = base_circuit_json_error.extend({
  type: z125.literal("pcb_trace_missing_error"),
  pcb_trace_missing_error_id: getZodPrefixedIdWithDefault(
    "pcb_trace_missing_error"
  ),
  error_type: z125.literal("pcb_trace_missing_error").default("pcb_trace_missing_error"),
  center: point.optional(),
  source_trace_id: z125.string(),
  pcb_component_ids: z125.array(z125.string()),
  pcb_port_ids: z125.array(z125.string()),
  subcircuit_id: z125.string().optional()
}).describe(
  "Defines an error when a source trace has no corresponding PCB trace"
);
expectTypesMatch(true);

// src/pcb/pcb_port_not_matched_error.ts
import { z as z126 } from "zod";
var pcb_port_not_matched_error = base_circuit_json_error.extend({
  type: z126.literal("pcb_port_not_matched_error"),
  pcb_error_id: getZodPrefixedIdWithDefault("pcb_error"),
  error_type: z126.literal("pcb_port_not_matched_error").default("pcb_port_not_matched_error"),
  pcb_component_ids: z126.array(z126.string()),
  subcircuit_id: z126.string().optional()
}).describe("Defines a trace error on the PCB where a port is not matched");
expectTypesMatch(true);

// src/pcb/pcb_port_not_connected_error.ts
import { z as z127 } from "zod";
var pcb_port_not_connected_error = base_circuit_json_error.extend({
  type: z127.literal("pcb_port_not_connected_error"),
  pcb_port_not_connected_error_id: getZodPrefixedIdWithDefault(
    "pcb_port_not_connected_error"
  ),
  error_type: z127.literal("pcb_port_not_connected_error").default("pcb_port_not_connected_error"),
  pcb_port_ids: z127.array(z127.string()),
  pcb_component_ids: z127.array(z127.string()),
  subcircuit_id: z127.string().optional()
}).describe("Defines an error when a pcb port is not connected to any trace");
expectTypesMatch(
  true
);

// src/pcb/pcb_net.ts
import { z as z128 } from "zod";
var pcb_net = z128.object({
  type: z128.literal("pcb_net"),
  pcb_net_id: getZodPrefixedIdWithDefault("pcb_net"),
  source_net_id: z128.string().optional(),
  highlight_color: z128.string().optional()
}).describe("Defines a net on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_via.ts
import { z as z129 } from "zod";
var pcb_via = z129.object({
  type: z129.literal("pcb_via"),
  pcb_via_id: getZodPrefixedIdWithDefault("pcb_via"),
  pcb_group_id: z129.string().optional(),
  subcircuit_id: z129.string().optional(),
  subcircuit_connectivity_map_key: z129.string().optional(),
  x: distance,
  y: distance,
  outer_diameter: distance.default("0.6mm"),
  hole_diameter: distance.default("0.25mm"),
  topmost_drill_layer: layer_ref.optional(),
  bottommost_drill_layer: layer_ref.optional(),
  through_hole: z129.boolean().optional(),
  /** @deprecated */
  from_layer: layer_ref.optional(),
  /** @deprecated */
  to_layer: layer_ref.optional(),
  layers: z129.array(layer_ref),
  /** PCB ports belonging to this via, including layer ports and aliases. */
  pcb_port_ids: z129.array(z129.string()).optional(),
  pcb_trace_id: z129.string().optional(),
  source_trace_id: z129.string().optional(),
  source_net_id: z129.string().min(1).optional(),
  net_is_assignable: z129.boolean().optional(),
  net_assigned: z129.boolean().optional(),
  /** @deprecated Use tented_on_top and tented_on_bottom instead. */
  is_tented: z129.boolean().optional(),
  tented_on_top: z129.boolean().optional(),
  tented_on_bottom: z129.boolean().optional()
}).transform(({ is_tented, ...via }) => {
  if (is_tented !== void 0) {
    via.tented_on_top ??= is_tented;
    via.tented_on_bottom ??= is_tented;
  }
  return via;
}).describe("Defines a via on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_board.ts
import { z as z130 } from "zod";
var pcb_board = z130.object({
  type: z130.literal("pcb_board"),
  pcb_board_id: getZodPrefixedIdWithDefault("pcb_board"),
  pcb_panel_id: z130.string().optional(),
  carrier_pcb_board_id: z130.string().optional(),
  is_subcircuit: z130.boolean().optional(),
  subcircuit_id: z130.string().optional(),
  is_mounted_to_carrier_board: z130.boolean().optional(),
  is_via_in_pad_allowed: z130.boolean().optional(),
  default_via_tented_on_top: z130.boolean().optional(),
  default_via_tented_on_bottom: z130.boolean().optional(),
  default_via_plugged: z130.boolean().optional(),
  width: length.optional(),
  height: length.optional(),
  center: point,
  display_offset_x: z130.string().optional().describe(
    "How to display the x offset for this board, usually corresponding with how the user specified it"
  ),
  display_offset_y: z130.string().optional().describe(
    "How to display the y offset for this board, usually corresponding with how the user specified it"
  ),
  thickness: length.optional().default(1.4),
  num_layers: z130.number().optional().default(4),
  allow_blind_and_buried_vias: z130.boolean().optional().describe(
    "Whether autorouters may generate blind and buried vias. False restricts newly generated vias to the full board stack."
  ),
  outline: z130.array(point).optional(),
  shape: z130.enum(["rect", "polygon"]).optional(),
  material: z130.enum(["fr4", "fr1", "flex"]).default("fr4"),
  solder_mask_color: z130.string().optional(),
  silkscreen_color: z130.string().optional(),
  anchor_position: point.optional(),
  anchor_alignment: ninePointAnchor.optional(),
  position_mode: z130.enum(["relative_to_panel_anchor", "none"]).optional()
}).merge(manufacturing_drc_properties).describe("Defines the board outline of the PCB");
expectTypesMatch(true);

// src/pcb/pcb_bend.ts
import { z as z131 } from "zod";
var finite_point = point.extend({
  x: length.pipe(z131.number().finite()),
  y: length.pipe(z131.number().finite())
});
var pcb_bend = z131.object({
  type: z131.literal("pcb_bend"),
  pcb_bend_id: getZodPrefixedIdWithDefault("pcb_bend"),
  pcb_board_id: z131.string(),
  pcb_group_id: z131.string().optional(),
  subcircuit_id: z131.string().optional(),
  name: z131.string().optional(),
  start: finite_point,
  end: finite_point,
  bend_angle: rotation.pipe(z131.number().finite()),
  bend_radius: length.pipe(z131.number().finite().positive()),
  bend_side: z131.enum(["left", "right"])
}).refine(({ start, end }) => start.x !== end.x || start.y !== end.y, {
  message: "Bend centerline endpoints must be distinct",
  path: ["end"]
}).describe(
  "Defines a finite-radius bend on a flat PCB for runtime CAD folding"
);
expectTypesMatch(true);

// src/pcb/pcb_stiffener.ts
import { z as z132 } from "zod";
var positive_length = length.pipe(z132.number().finite().positive());
var finite_point2 = point.extend({
  x: length.pipe(z132.number().finite()),
  y: length.pipe(z132.number().finite())
});
var pcb_stiffener_base = z132.object({
  type: z132.literal("pcb_stiffener"),
  pcb_stiffener_id: getZodPrefixedIdWithDefault("pcb_stiffener"),
  pcb_board_id: z132.string(),
  pcb_group_id: z132.string().optional(),
  subcircuit_id: z132.string().optional(),
  name: z132.string().optional(),
  layer: z132.enum(["top", "bottom"]),
  material: z132.enum(["fr4", "polyimide", "stainless_steel", "aluminum"]),
  thickness: positive_length,
  adhesive_thickness: length.pipe(z132.number().finite().nonnegative()).optional()
});
var pcb_stiffener_rect = pcb_stiffener_base.extend({
  shape: z132.literal("rect"),
  center: finite_point2,
  rotation: rotation.pipe(z132.number().finite()).optional(),
  width: positive_length,
  height: positive_length,
  outline: z132.never().optional()
});
expectTypesMatch(true);
var pcb_stiffener_polygon = pcb_stiffener_base.extend({
  shape: z132.literal("polygon"),
  outline: z132.array(finite_point2).min(3).refine((points) => {
    const twice_area = points.reduce((sum, p, i) => {
      const next = points[(i + 1) % points.length];
      return sum + p.x * next.y - next.x * p.y;
    }, 0);
    return Number.isFinite(twice_area) && twice_area !== 0;
  }, "Stiffener outline must enclose a nonzero area"),
  center: z132.never().optional(),
  rotation: z132.never().optional(),
  width: z132.never().optional(),
  height: z132.never().optional()
});
expectTypesMatch(
  true
);
var pcb_stiffener = z132.discriminatedUnion("shape", [pcb_stiffener_rect, pcb_stiffener_polygon]).describe(
  "Defines bonded mechanical PCB reinforcement without adding copper layers"
);
expectTypesMatch(true);

// src/pcb/pcb_panel.ts
import { z as z133 } from "zod";
var pcb_panel = z133.object({
  type: z133.literal("pcb_panel"),
  pcb_panel_id: getZodPrefixedIdWithDefault("pcb_panel"),
  width: length,
  height: length,
  center: point,
  thickness: length.optional().default(1.4),
  covered_with_solder_mask: z133.boolean().optional().default(true)
}).describe("Defines a PCB panel that can contain multiple boards");
expectTypesMatch(true);

// src/pcb/pcb_placement_error.ts
import { z as z134 } from "zod";
var pcb_placement_error = base_circuit_json_error.extend({
  type: z134.literal("pcb_placement_error"),
  pcb_placement_error_id: getZodPrefixedIdWithDefault("pcb_placement_error"),
  error_type: z134.literal("pcb_placement_error").default("pcb_placement_error"),
  subcircuit_id: z134.string().optional()
}).describe("Defines a placement error on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_packing_error.ts
import { z as z135 } from "zod";
var pcb_packing_error = base_circuit_json_error.extend({
  type: z135.literal("pcb_packing_error"),
  pcb_packing_error_id: getZodPrefixedIdWithDefault("pcb_packing_error"),
  error_type: z135.literal("pcb_packing_error").default("pcb_packing_error"),
  pcb_group_id: z135.string().optional(),
  subcircuit_id: z135.string().optional()
}).describe("Defines a failure to pack PCB components within layout bounds");
expectTypesMatch(true);

// src/pcb/pcb_panelization_placement_error.ts
import { z as z136 } from "zod";
var pcb_panelization_placement_error = base_circuit_json_error.extend({
  type: z136.literal("pcb_panelization_placement_error"),
  pcb_panelization_placement_error_id: getZodPrefixedIdWithDefault(
    "pcb_panelization_placement_error"
  ),
  error_type: z136.literal("pcb_panelization_placement_error").default("pcb_panelization_placement_error"),
  pcb_panel_id: z136.string().optional(),
  pcb_board_id: z136.string().optional(),
  subcircuit_id: z136.string().optional()
}).describe("Defines a panelization placement error on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_trace_hint.ts
import { z as z137 } from "zod";
var pcb_trace_hint = z137.object({
  type: z137.literal("pcb_trace_hint"),
  pcb_trace_hint_id: getZodPrefixedIdWithDefault("pcb_trace_hint"),
  pcb_port_id: z137.string(),
  pcb_component_id: z137.string(),
  route: z137.array(route_hint_point),
  subcircuit_id: z137.string().optional()
}).describe("A hint that can be used during generation of a PCB trace");
expectTypesMatch(true);

// src/pcb/pcb_silkscreen_line.ts
import { z as z138 } from "zod";
var pcb_silkscreen_line = z138.object({
  type: z138.literal("pcb_silkscreen_line"),
  pcb_silkscreen_line_id: getZodPrefixedIdWithDefault("pcb_silkscreen_line"),
  pcb_component_id: z138.string(),
  pcb_group_id: z138.string().optional(),
  subcircuit_id: z138.string().optional(),
  stroke_width: distance.default("0.1mm"),
  x1: distance,
  y1: distance,
  x2: distance,
  y2: distance,
  layer: visible_layer
}).describe("Defines a silkscreen line on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_silkscreen_path.ts
import { z as z139 } from "zod";
var pcb_silkscreen_path = z139.object({
  type: z139.literal("pcb_silkscreen_path"),
  pcb_silkscreen_path_id: getZodPrefixedIdWithDefault("pcb_silkscreen_path"),
  pcb_component_id: z139.string(),
  pcb_group_id: z139.string().optional(),
  subcircuit_id: z139.string().optional(),
  layer: visible_layer,
  route: z139.array(point),
  stroke_width: length
}).describe("Defines a silkscreen path on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_silkscreen_text.ts
import { z as z140 } from "zod";
var pcb_silkscreen_text = z140.object({
  type: z140.literal("pcb_silkscreen_text"),
  pcb_silkscreen_text_id: getZodPrefixedIdWithDefault("pcb_silkscreen_text"),
  pcb_group_id: z140.string().optional(),
  subcircuit_id: z140.string().optional(),
  font: z140.literal("tscircuit2024").default("tscircuit2024"),
  font_size: distance.default("0.2mm"),
  pcb_component_id: z140.string(),
  text: z140.string(),
  is_knockout: z140.boolean().default(false).optional(),
  knockout_padding: z140.object({
    left: length,
    top: length,
    bottom: length,
    right: length
  }).default({
    left: "0.2mm",
    top: "0.2mm",
    bottom: "0.2mm",
    right: "0.2mm"
  }).optional(),
  ccw_rotation: z140.number().optional(),
  layer: layer_ref,
  is_mirrored: z140.boolean().default(false).optional(),
  anchor_position: point.default({ x: 0, y: 0 }),
  anchor_alignment: ninePointAnchor.default("center")
}).describe("Defines silkscreen text on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_copper_text.ts
import { z as z141 } from "zod";
var pcb_copper_text = z141.object({
  type: z141.literal("pcb_copper_text"),
  pcb_copper_text_id: getZodPrefixedIdWithDefault("pcb_copper_text"),
  pcb_group_id: z141.string().optional(),
  subcircuit_id: z141.string().optional(),
  font: z141.literal("tscircuit2024").default("tscircuit2024"),
  font_size: distance.default("0.2mm"),
  pcb_component_id: z141.string(),
  text: z141.string(),
  is_knockout: z141.boolean().default(false).optional(),
  knockout_padding: z141.object({
    left: length,
    top: length,
    bottom: length,
    right: length
  }).default({
    left: "0.2mm",
    top: "0.2mm",
    bottom: "0.2mm",
    right: "0.2mm"
  }).optional(),
  ccw_rotation: z141.number().optional(),
  layer: layer_ref,
  is_mirrored: z141.boolean().default(false).optional(),
  anchor_position: point.default({ x: 0, y: 0 }),
  anchor_alignment: ninePointAnchor.default("center")
}).describe("Defines copper text on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_silkscreen_rect.ts
import { z as z142 } from "zod";
var pcb_silkscreen_rect = z142.object({
  type: z142.literal("pcb_silkscreen_rect"),
  pcb_silkscreen_rect_id: getZodPrefixedIdWithDefault("pcb_silkscreen_rect"),
  pcb_component_id: z142.string(),
  pcb_group_id: z142.string().optional(),
  subcircuit_id: z142.string().optional(),
  center: point,
  width: length,
  height: length,
  layer: layer_ref,
  stroke_width: length.default("1mm"),
  corner_radius: length.optional(),
  is_filled: z142.boolean().default(true).optional(),
  has_stroke: z142.boolean().optional(),
  is_stroke_dashed: z142.boolean().optional(),
  ccw_rotation: z142.number().optional()
}).describe("Defines a silkscreen rect on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_silkscreen_circle.ts
import { z as z143 } from "zod";
var pcb_silkscreen_circle = z143.object({
  type: z143.literal("pcb_silkscreen_circle"),
  pcb_silkscreen_circle_id: getZodPrefixedIdWithDefault(
    "pcb_silkscreen_circle"
  ),
  pcb_component_id: z143.string(),
  pcb_group_id: z143.string().optional(),
  subcircuit_id: z143.string().optional(),
  center: point,
  radius: length,
  layer: visible_layer,
  stroke_width: length.default("1mm"),
  is_filled: z143.boolean().optional()
}).describe("Defines a silkscreen circle on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_silkscreen_oval.ts
import { z as z144 } from "zod";
var pcb_silkscreen_oval = z144.object({
  type: z144.literal("pcb_silkscreen_oval"),
  pcb_silkscreen_oval_id: getZodPrefixedIdWithDefault("pcb_silkscreen_oval"),
  pcb_component_id: z144.string(),
  pcb_group_id: z144.string().optional(),
  subcircuit_id: z144.string().optional(),
  center: point,
  radius_x: distance,
  radius_y: distance,
  layer: visible_layer,
  ccw_rotation: rotation.optional()
}).describe("Defines a silkscreen oval on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_silkscreen_graphic.ts
import { z as z145 } from "zod";
var pcb_silkscreen_graphic_base = z145.object({
  type: z145.literal("pcb_silkscreen_graphic"),
  pcb_silkscreen_graphic_id: getZodPrefixedIdWithDefault(
    "pcb_silkscreen_graphic"
  ),
  pcb_component_id: z145.string(),
  pcb_group_id: z145.string().optional(),
  subcircuit_id: z145.string().optional(),
  layer: visible_layer,
  image_asset: asset.optional()
});
var pcb_silkscreen_graphic_brep = pcb_silkscreen_graphic_base.extend({
  shape: z145.literal("brep"),
  brep_shape
}).describe("Defines a BRep silkscreen graphic on the PCB");
expectTypesMatch(
  true
);
var pcb_silkscreen_graphic = z145.discriminatedUnion("shape", [pcb_silkscreen_graphic_brep]).describe("Defines a silkscreen graphic on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_silkscreen_pill.ts
import { z as z146 } from "zod";
var pcb_silkscreen_pill = z146.object({
  type: z146.literal("pcb_silkscreen_pill"),
  pcb_silkscreen_pill_id: getZodPrefixedIdWithDefault("pcb_silkscreen_pill"),
  pcb_component_id: z146.string(),
  pcb_group_id: z146.string().optional(),
  subcircuit_id: z146.string().optional(),
  center: point,
  width: length,
  height: length,
  layer: layer_ref,
  ccw_rotation: z146.number().optional()
}).describe("Defines a silkscreen pill on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_fabrication_note_text.ts
import { z as z147 } from "zod";
var pcb_fabrication_note_text = z147.object({
  type: z147.literal("pcb_fabrication_note_text"),
  pcb_fabrication_note_text_id: getZodPrefixedIdWithDefault(
    "pcb_fabrication_note_text"
  ),
  subcircuit_id: z147.string().optional(),
  pcb_group_id: z147.string().optional(),
  font: z147.literal("tscircuit2024").default("tscircuit2024"),
  font_size: distance.default("1mm"),
  pcb_component_id: z147.string(),
  text: z147.string(),
  ccw_rotation: z147.number().optional(),
  layer: visible_layer,
  anchor_position: point.default({ x: 0, y: 0 }),
  anchor_alignment: z147.enum(["center", "top_left", "top_right", "bottom_left", "bottom_right"]).default("center"),
  color: z147.string().optional()
}).describe(
  "Defines a fabrication note in text on the PCB, useful for leaving notes for assemblers or fabricators"
);
expectTypesMatch(true);

// src/pcb/pcb_fabrication_note_path.ts
import { z as z148 } from "zod";
var pcb_fabrication_note_path = z148.object({
  type: z148.literal("pcb_fabrication_note_path"),
  pcb_fabrication_note_path_id: getZodPrefixedIdWithDefault(
    "pcb_fabrication_note_path"
  ),
  pcb_component_id: z148.string(),
  subcircuit_id: z148.string().optional(),
  layer: layer_ref,
  route: z148.array(point),
  stroke_width: length,
  color: z148.string().optional()
}).describe(
  "Defines a fabrication path on the PCB for fabricators or assemblers"
);
expectTypesMatch(true);

// src/pcb/pcb_fabrication_note_rect.ts
import { z as z149 } from "zod";
var pcb_fabrication_note_rect = z149.object({
  type: z149.literal("pcb_fabrication_note_rect"),
  pcb_fabrication_note_rect_id: getZodPrefixedIdWithDefault(
    "pcb_fabrication_note_rect"
  ),
  pcb_component_id: z149.string(),
  pcb_group_id: z149.string().optional(),
  subcircuit_id: z149.string().optional(),
  center: point,
  width: length,
  height: length,
  layer: visible_layer,
  stroke_width: length.default("0.1mm"),
  corner_radius: length.optional(),
  is_filled: z149.boolean().optional(),
  has_stroke: z149.boolean().optional(),
  is_stroke_dashed: z149.boolean().optional(),
  color: z149.string().optional()
}).describe("Defines a fabrication note rectangle on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_fabrication_note_dimension.ts
import { z as z150 } from "zod";
var pcb_fabrication_note_dimension = z150.object({
  type: z150.literal("pcb_fabrication_note_dimension"),
  pcb_fabrication_note_dimension_id: getZodPrefixedIdWithDefault(
    "pcb_fabrication_note_dimension"
  ),
  pcb_component_id: z150.string(),
  pcb_group_id: z150.string().optional(),
  subcircuit_id: z150.string().optional(),
  layer: visible_layer,
  from: point,
  to: point,
  text: z150.string().optional(),
  text_ccw_rotation: z150.number().optional(),
  offset: length.optional(),
  offset_distance: length.optional(),
  offset_direction: z150.object({
    x: z150.number(),
    y: z150.number()
  }).optional(),
  font: z150.literal("tscircuit2024").default("tscircuit2024"),
  font_size: length.default("1mm"),
  color: z150.string().optional(),
  arrow_size: length.default("1mm")
}).describe("Defines a measurement annotation within PCB fabrication notes");
expectTypesMatch(true);

// src/pcb/pcb_note_text.ts
import { z as z151 } from "zod";
var pcb_note_text = z151.object({
  type: z151.literal("pcb_note_text"),
  pcb_note_text_id: getZodPrefixedIdWithDefault("pcb_note_text"),
  pcb_component_id: z151.string().optional(),
  pcb_group_id: z151.string().optional(),
  subcircuit_id: z151.string().optional(),
  name: z151.string().optional(),
  font: z151.literal("tscircuit2024").default("tscircuit2024"),
  font_size: distance.default("1mm"),
  text: z151.string().optional(),
  anchor_position: point.default({ x: 0, y: 0 }),
  anchor_alignment: z151.enum(["center", "top_left", "top_right", "bottom_left", "bottom_right"]).default("center"),
  layer: visible_layer.default("top"),
  is_mirrored_from_top_view: z151.boolean().optional(),
  color: z151.string().optional()
}).describe("Defines a documentation note in text on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_note_rect.ts
import { z as z152 } from "zod";
var pcb_note_rect = z152.object({
  type: z152.literal("pcb_note_rect"),
  pcb_note_rect_id: getZodPrefixedIdWithDefault("pcb_note_rect"),
  pcb_component_id: z152.string().optional(),
  pcb_group_id: z152.string().optional(),
  subcircuit_id: z152.string().optional(),
  name: z152.string().optional(),
  text: z152.string().optional(),
  center: point,
  width: length,
  height: length,
  layer: visible_layer.default("top"),
  stroke_width: length.default("0.1mm"),
  corner_radius: length.optional(),
  is_filled: z152.boolean().optional(),
  has_stroke: z152.boolean().optional(),
  is_stroke_dashed: z152.boolean().optional(),
  color: z152.string().optional()
}).describe("Defines a rectangular documentation note on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_note_path.ts
import { z as z153 } from "zod";
var pcb_note_path = z153.object({
  type: z153.literal("pcb_note_path"),
  pcb_note_path_id: getZodPrefixedIdWithDefault("pcb_note_path"),
  pcb_component_id: z153.string().optional(),
  pcb_group_id: z153.string().optional(),
  subcircuit_id: z153.string().optional(),
  name: z153.string().optional(),
  text: z153.string().optional(),
  route: z153.array(point),
  layer: visible_layer.default("top"),
  stroke_width: length.default("0.1mm"),
  color: z153.string().optional()
}).describe("Defines a polyline documentation note on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_note_line.ts
import { z as z154 } from "zod";
var pcb_note_line = z154.object({
  type: z154.literal("pcb_note_line"),
  pcb_note_line_id: getZodPrefixedIdWithDefault("pcb_note_line"),
  pcb_component_id: z154.string().optional(),
  pcb_group_id: z154.string().optional(),
  subcircuit_id: z154.string().optional(),
  name: z154.string().optional(),
  text: z154.string().optional(),
  x1: distance,
  y1: distance,
  x2: distance,
  y2: distance,
  layer: visible_layer.default("top"),
  stroke_width: distance.default("0.1mm"),
  color: z154.string().optional(),
  is_dashed: z154.boolean().optional()
}).describe("Defines a straight documentation note line on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_note_dimension.ts
import { z as z155 } from "zod";
var pcb_note_dimension = z155.object({
  type: z155.literal("pcb_note_dimension"),
  pcb_note_dimension_id: getZodPrefixedIdWithDefault("pcb_note_dimension"),
  pcb_component_id: z155.string().optional(),
  pcb_group_id: z155.string().optional(),
  subcircuit_id: z155.string().optional(),
  name: z155.string().optional(),
  from: point,
  to: point,
  text: z155.string().optional(),
  text_ccw_rotation: z155.number().optional(),
  offset_distance: length.optional(),
  offset_direction: z155.object({
    x: z155.number(),
    y: z155.number()
  }).optional(),
  font: z155.literal("tscircuit2024").default("tscircuit2024"),
  font_size: length.default("1mm"),
  layer: visible_layer.default("top"),
  color: z155.string().optional(),
  arrow_size: length.default("1mm")
}).describe("Defines a measurement annotation within PCB documentation notes");
expectTypesMatch(true);

// src/pcb/pcb_footprint_overlap_error.ts
import { z as z156 } from "zod";
var pcb_footprint_overlap_error = base_circuit_json_error.extend({
  type: z156.literal("pcb_footprint_overlap_error"),
  pcb_error_id: getZodPrefixedIdWithDefault("pcb_error"),
  error_type: z156.literal("pcb_footprint_overlap_error").default("pcb_footprint_overlap_error"),
  pcb_smtpad_ids: z156.array(z156.string()).optional(),
  pcb_plated_hole_ids: z156.array(z156.string()).optional(),
  pcb_hole_ids: z156.array(z156.string()).optional(),
  pcb_keepout_ids: z156.array(z156.string()).optional()
}).describe("Error emitted when a pcb footprint overlaps with another element");
expectTypesMatch(
  true
);

// src/pcb/pcb_courtyard_overlap_error.ts
import { z as z157 } from "zod";
var pcb_courtyard_overlap_error = base_circuit_json_error.extend({
  type: z157.literal("pcb_courtyard_overlap_error"),
  pcb_error_id: getZodPrefixedIdWithDefault("pcb_error"),
  error_type: z157.literal("pcb_courtyard_overlap_error").default("pcb_courtyard_overlap_error"),
  pcb_component_ids: z157.tuple([z157.string(), z157.string()])
}).describe(
  "Error emitted when the courtyard (CrtYd) of one PCB component overlaps with the courtyard of another"
);
expectTypesMatch(
  true
);

// src/pcb/pcb_keepout.ts
import { z as z158 } from "zod";
var pcb_keepout_outline = z158.object({
  type: z158.literal("pcb_keepout"),
  shape: z158.literal("outline"),
  pcb_group_id: z158.string().optional(),
  subcircuit_id: z158.string().optional(),
  outline: z158.array(point).min(2),
  stroke_width: length,
  pcb_keepout_id: z158.string(),
  layers: z158.array(z158.string()),
  description: z158.string().optional(),
  excluded_pcb_component_ids: z158.array(z158.string()).optional(),
  warning_only: z158.boolean().optional(),
  allow_traces: z158.boolean().optional(),
  allow_placements: z158.boolean().optional()
});
var pcb_keepout = z158.object({
  type: z158.literal("pcb_keepout"),
  shape: z158.literal("rect"),
  pcb_group_id: z158.string().optional(),
  subcircuit_id: z158.string().optional(),
  center: point,
  width: distance,
  height: distance,
  pcb_keepout_id: z158.string(),
  layers: z158.array(z158.string()),
  // Specify layers where the keepout applies
  description: z158.string().optional(),
  // Optional description of the keepout
  excluded_pcb_component_ids: z158.array(z158.string()).optional(),
  warning_only: z158.boolean().optional(),
  allow_traces: z158.boolean().optional(),
  allow_placements: z158.boolean().optional()
}).or(
  z158.object({
    type: z158.literal("pcb_keepout"),
    shape: z158.literal("circle"),
    pcb_group_id: z158.string().optional(),
    subcircuit_id: z158.string().optional(),
    center: point,
    radius: distance,
    pcb_keepout_id: z158.string(),
    layers: z158.array(z158.string()),
    // Specify layers where the keepout applies
    description: z158.string().optional(),
    // Optional description of the keepout
    excluded_pcb_component_ids: z158.array(z158.string()).optional(),
    warning_only: z158.boolean().optional(),
    allow_traces: z158.boolean().optional(),
    allow_placements: z158.boolean().optional()
  })
).or(pcb_keepout_outline);
expectTypesMatch(true);
expectTypesMatch(true);

// src/pcb/pcb_keepout_overlap_warning.ts
import { z as z159 } from "zod";
var pcb_keepout_overlap_warning = z159.object({
  type: z159.literal("pcb_keepout_overlap_warning"),
  pcb_keepout_overlap_warning_id: getZodPrefixedIdWithDefault(
    "pcb_keepout_overlap_warning"
  ),
  warning_type: z159.literal("pcb_keepout_overlap_warning").default("pcb_keepout_overlap_warning"),
  message: z159.string(),
  pcb_keepout_id: z159.string(),
  pcb_component_ids: z159.array(z159.string()).optional(),
  pcb_trace_ids: z159.array(z159.string()).optional(),
  pcb_smtpad_ids: z159.array(z159.string()).optional(),
  pcb_plated_hole_ids: z159.array(z159.string()).optional(),
  pcb_via_ids: z159.array(z159.string()).optional(),
  center: point.optional(),
  subcircuit_id: z159.string().optional()
}).describe(
  "Warning emitted when copper overlaps a PCB keepout with warning_only enabled"
);
expectTypesMatch(
  true
);

// src/pcb/pcb_cutout.ts
import { z as z160 } from "zod";
var pcb_cutout_base = z160.object({
  type: z160.literal("pcb_cutout"),
  pcb_cutout_id: getZodPrefixedIdWithDefault("pcb_cutout"),
  pcb_component_id: z160.string().optional(),
  pcb_group_id: z160.string().optional(),
  subcircuit_id: z160.string().optional(),
  pcb_board_id: z160.string().optional(),
  pcb_panel_id: z160.string().optional()
});
var pcb_cutout_rect = pcb_cutout_base.extend({
  shape: z160.literal("rect"),
  center: point,
  width: length,
  height: length,
  rotation: rotation.optional(),
  corner_radius: length.optional()
});
expectTypesMatch(true);
var pcb_cutout_circle = pcb_cutout_base.extend({
  shape: z160.literal("circle"),
  center: point,
  radius: length
});
expectTypesMatch(true);
var pcb_cutout_polygon = pcb_cutout_base.extend({
  shape: z160.literal("polygon"),
  points: z160.array(point)
});
expectTypesMatch(true);
var pcb_cutout_path = pcb_cutout_base.extend({
  shape: z160.literal("path"),
  route: z160.array(point),
  slot_width: length,
  slot_length: length.optional(),
  space_between_slots: length.optional(),
  slot_corner_radius: length.optional()
});
expectTypesMatch(true);
var pcb_cutout = z160.discriminatedUnion("shape", [
  pcb_cutout_rect,
  pcb_cutout_circle,
  pcb_cutout_polygon,
  pcb_cutout_path
]).describe("Defines a cutout on the PCB, removing board material.");
expectTypesMatch(true);

// src/pcb/pcb_missing_footprint_error.ts
import { z as z161 } from "zod";
var pcb_missing_footprint_error = base_circuit_json_error.extend({
  type: z161.literal("pcb_missing_footprint_error"),
  pcb_missing_footprint_error_id: getZodPrefixedIdWithDefault(
    "pcb_missing_footprint_error"
  ),
  pcb_group_id: z161.string().optional(),
  subcircuit_id: z161.string().optional(),
  error_type: z161.literal("pcb_missing_footprint_error").default("pcb_missing_footprint_error"),
  source_component_id: z161.string()
}).describe("Defines a missing footprint error on the PCB");
expectTypesMatch(
  true
);

// src/pcb/external_footprint_load_error.ts
import { z as z162 } from "zod";
var external_footprint_load_error = base_circuit_json_error.extend({
  type: z162.literal("external_footprint_load_error"),
  external_footprint_load_error_id: getZodPrefixedIdWithDefault(
    "external_footprint_load_error"
  ),
  pcb_component_id: z162.string(),
  source_component_id: z162.string(),
  pcb_group_id: z162.string().optional(),
  subcircuit_id: z162.string().optional(),
  footprinter_string: z162.string().optional(),
  error_type: z162.literal("external_footprint_load_error").default("external_footprint_load_error")
}).describe("Defines an error when an external footprint fails to load");
expectTypesMatch(true);

// src/pcb/circuit_json_footprint_load_error.ts
import { z as z163 } from "zod";
var circuit_json_footprint_load_error = base_circuit_json_error.extend({
  type: z163.literal("circuit_json_footprint_load_error"),
  circuit_json_footprint_load_error_id: getZodPrefixedIdWithDefault(
    "circuit_json_footprint_load_error"
  ),
  pcb_component_id: z163.string(),
  source_component_id: z163.string(),
  pcb_group_id: z163.string().optional(),
  subcircuit_id: z163.string().optional(),
  error_type: z163.literal("circuit_json_footprint_load_error").default("circuit_json_footprint_load_error"),
  circuit_json: z163.array(z163.any()).optional()
}).describe("Defines an error when a circuit JSON footprint fails to load");
expectTypesMatch(true);

// src/pcb/pcb_group.ts
import { z as z164 } from "zod";
var pcb_group = z164.object({
  type: z164.literal("pcb_group"),
  pcb_group_id: getZodPrefixedIdWithDefault("pcb_group"),
  source_group_id: z164.string(),
  is_subcircuit: z164.boolean().optional(),
  subcircuit_id: z164.string().optional(),
  width: length.optional(),
  height: length.optional(),
  center: point,
  display_offset_x: z164.string().optional().describe(
    "How to display the x offset for this group, usually corresponding with how the user specified it"
  ),
  display_offset_y: z164.string().optional().describe(
    "How to display the y offset for this group, usually corresponding with how the user specified it"
  ),
  outline: z164.array(point).optional(),
  anchor_position: point.optional(),
  anchor_alignment: ninePointAnchor.default("center"),
  position_mode: z164.enum(["packed", "relative_to_group_anchor", "none"]).optional(),
  positioned_relative_to_pcb_group_id: z164.string().optional(),
  positioned_relative_to_pcb_board_id: z164.string().optional(),
  pcb_component_ids: z164.array(z164.string()),
  child_layout_mode: z164.enum(["packed", "none"]).optional(),
  name: z164.string().optional(),
  description: z164.string().optional(),
  layout_mode: z164.string().optional(),
  autorouter_configuration: z164.object({
    trace_clearance: length
  }).optional(),
  autorouter_used_string: z164.string().optional()
}).describe("Defines a group of components on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_autorouting_error.ts
import { z as z165 } from "zod";
var pcb_autorouting_error = base_circuit_json_error.extend({
  type: z165.literal("pcb_autorouting_error"),
  pcb_error_id: getZodPrefixedIdWithDefault("pcb_autorouting_error"),
  error_type: z165.literal("pcb_autorouting_error").default("pcb_autorouting_error"),
  subcircuit_id: z165.string().optional()
}).describe("The autorouting has failed to route a portion of the board");
expectTypesMatch(true);

// src/pcb/pcb_preflight_routing_error.ts
import { z as z166 } from "zod";
var pcb_preflight_routing_error = base_circuit_json_error.extend({
  type: z166.literal("pcb_preflight_routing_error"),
  pcb_preflight_routing_error_id: getZodPrefixedIdWithDefault(
    "pcb_preflight_routing_error"
  ),
  error_type: z166.literal("pcb_preflight_routing_error").default("pcb_preflight_routing_error"),
  error_code: z166.string(),
  subcircuit_id: z166.string().optional(),
  pcb_group_id: z166.string().optional(),
  routing_phase_index: z166.number().int().optional(),
  phase_name: z166.string().optional(),
  source_trace_ids: z166.array(z166.string()).optional(),
  pcb_component_ids: z166.array(z166.string()).optional(),
  pcb_port_ids: z166.array(z166.string()).optional(),
  related_error_ids: z166.array(z166.string()).optional(),
  measurements: z166.record(z166.number().finite()).optional()
});
expectTypesMatch(true);

// src/pcb/pcb_manual_edit_conflict_warning.ts
import { z as z167 } from "zod";
var pcb_manual_edit_conflict_warning = z167.object({
  type: z167.literal("pcb_manual_edit_conflict_warning"),
  pcb_manual_edit_conflict_warning_id: getZodPrefixedIdWithDefault(
    "pcb_manual_edit_conflict_warning"
  ),
  warning_type: z167.literal("pcb_manual_edit_conflict_warning").default("pcb_manual_edit_conflict_warning"),
  message: z167.string(),
  pcb_component_id: z167.string(),
  pcb_group_id: z167.string().optional(),
  subcircuit_id: z167.string().optional(),
  source_component_id: z167.string()
}).describe(
  "Warning emitted when a component has both manual placement and explicit pcbX/pcbY coordinates"
);
expectTypesMatch(true);

// src/pcb/pcb_connector_not_in_accessible_orientation_warning.ts
import { z as z168 } from "zod";
var connectorOrientationDirection = z168.enum(["x-", "x+", "y+", "y-"]);
var pcb_connector_not_in_accessible_orientation_warning = z168.object({
  type: z168.literal("pcb_connector_not_in_accessible_orientation_warning"),
  pcb_connector_not_in_accessible_orientation_warning_id: getZodPrefixedIdWithDefault(
    "pcb_connector_not_in_accessible_orientation_warning"
  ),
  warning_type: z168.literal("pcb_connector_not_in_accessible_orientation_warning").default("pcb_connector_not_in_accessible_orientation_warning"),
  message: z168.string(),
  pcb_component_id: z168.string(),
  source_component_id: z168.string().optional(),
  pcb_board_id: z168.string().optional(),
  facing_direction: connectorOrientationDirection,
  recommended_facing_direction: connectorOrientationDirection,
  subcircuit_id: z168.string().optional()
}).describe(
  "Warning emitted when a connector PCB component is facing inward toward the board and should be reoriented to an outward-facing direction"
);
expectTypesMatch(true);

// src/pcb/pcb_component_missing_courtyard_warning.ts
import { z as z169 } from "zod";
var pcb_component_missing_courtyard_warning = z169.object({
  type: z169.literal("pcb_component_missing_courtyard_warning"),
  pcb_component_missing_courtyard_warning_id: getZodPrefixedIdWithDefault(
    "pcb_component_missing_courtyard_warning"
  ),
  warning_type: z169.literal("pcb_component_missing_courtyard_warning").default("pcb_component_missing_courtyard_warning"),
  message: z169.string(),
  pcb_component_id: z169.string(),
  source_component_id: z169.string().optional(),
  subcircuit_id: z169.string().optional()
}).describe("Warning emitted when a PCB component has no courtyard geometry");
expectTypesMatch(true);

// src/pcb/supplier_footprint_mismatch_warning.ts
import { z as z170 } from "zod";
var supplier_footprint_mismatch_warning = z170.object({
  type: z170.literal("supplier_footprint_mismatch_warning"),
  supplier_footprint_mismatch_warning_id: getZodPrefixedIdWithDefault(
    "supplier_footprint_mismatch_warning"
  ),
  warning_type: z170.literal("supplier_footprint_mismatch_warning").default("supplier_footprint_mismatch_warning"),
  message: z170.string(),
  source_component_id: z170.string(),
  pcb_component_id: z170.string().optional(),
  pcb_group_id: z170.string().optional(),
  subcircuit_id: z170.string().optional(),
  supplier_name: supplier_name.optional(),
  supplier_part_number: z170.string().optional(),
  supplier_footprint_url: z170.string().optional(),
  footprint_copper_intersection_over_union: z170.number()
}).describe(
  "Warning emitted when a supplier part footprint does not match the expected footprint"
);
expectTypesMatch(true);

// src/pcb/pcb_fabricator_extra_charge_warning.ts
import { z as z171 } from "zod";
var pcb_fabricator_extra_charge_warning = z171.object({
  type: z171.literal("pcb_fabricator_extra_charge_warning"),
  pcb_fabricator_extra_charge_warning_id: getZodPrefixedIdWithDefault(
    "pcb_fabricator_extra_charge_warning"
  ),
  warning_type: z171.literal("pcb_fabricator_extra_charge_warning").default("pcb_fabricator_extra_charge_warning"),
  message: z171.string(),
  fabricator_preset: z171.string(),
  pcb_board_id: z171.string().optional(),
  pcb_via_ids: z171.array(z171.string()).optional(),
  subcircuit_id: z171.string().optional()
}).describe(
  "Warning that a design feature incurs an extra charge for the selected fabricator preset, such as via hole diameters below 0.3 mm with JLCPCB economy or standard presets."
);
expectTypesMatch(true);

// src/pcb/pcb_breakout_point.ts
import { z as z172 } from "zod";
var pcb_breakout_point = z172.object({
  type: z172.literal("pcb_breakout_point"),
  pcb_breakout_point_id: getZodPrefixedIdWithDefault("pcb_breakout_point"),
  pcb_group_id: z172.string(),
  subcircuit_id: z172.string().optional(),
  source_trace_id: z172.string().optional(),
  source_port_id: z172.string().optional(),
  source_net_id: z172.string().optional(),
  layer: layer_ref.optional(),
  x: distance,
  y: distance
}).describe(
  "Defines a routing target within a pcb_group for a source_trace or source_net"
);
expectTypesMatch(true);

// src/pcb/pcb_ground_plane.ts
import { z as z173 } from "zod";
var pcb_ground_plane = z173.object({
  type: z173.literal("pcb_ground_plane"),
  pcb_ground_plane_id: getZodPrefixedIdWithDefault("pcb_ground_plane"),
  source_pcb_ground_plane_id: z173.string(),
  source_net_id: z173.string(),
  pcb_group_id: z173.string().optional(),
  subcircuit_id: z173.string().optional()
}).describe("Defines a ground plane on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_ground_plane_region.ts
import { z as z174 } from "zod";
var pcb_ground_plane_region = z174.object({
  type: z174.literal("pcb_ground_plane_region"),
  pcb_ground_plane_region_id: getZodPrefixedIdWithDefault(
    "pcb_ground_plane_region"
  ),
  pcb_ground_plane_id: z174.string(),
  pcb_group_id: z174.string().optional(),
  subcircuit_id: z174.string().optional(),
  layer: layer_ref,
  points: z174.array(point)
}).describe("Defines a polygon region of a ground plane");
expectTypesMatch(true);

// src/pcb/pcb_thermal_spoke.ts
import { z as z175 } from "zod";
var pcb_thermal_spoke = z175.object({
  type: z175.literal("pcb_thermal_spoke"),
  pcb_thermal_spoke_id: getZodPrefixedIdWithDefault("pcb_thermal_spoke"),
  pcb_ground_plane_id: z175.string(),
  shape: z175.string(),
  spoke_count: z175.number(),
  spoke_thickness: distance,
  spoke_inner_diameter: distance,
  spoke_outer_diameter: distance,
  pcb_plated_hole_id: z175.string().optional(),
  subcircuit_id: z175.string().optional()
}).describe("Pattern for connecting a ground plane to a plated hole");
expectTypesMatch(true);

// src/pcb/pcb_copper_pour.ts
import { z as z176 } from "zod";
var pcb_copper_pour_base = z176.object({
  type: z176.literal("pcb_copper_pour"),
  pcb_copper_pour_id: getZodPrefixedIdWithDefault("pcb_copper_pour"),
  pcb_group_id: z176.string().optional(),
  subcircuit_id: z176.string().optional(),
  layer: layer_ref,
  source_net_id: z176.string().optional(),
  covered_with_solder_mask: z176.boolean().optional().default(true)
});
var pcb_copper_pour_rect = pcb_copper_pour_base.extend({
  shape: z176.literal("rect"),
  center: point,
  width: length,
  height: length,
  rotation: rotation.optional()
});
expectTypesMatch(true);
var pcb_copper_pour_brep = pcb_copper_pour_base.extend({
  shape: z176.literal("brep"),
  brep_shape
});
expectTypesMatch(true);
var pcb_copper_pour_polygon = pcb_copper_pour_base.extend({
  shape: z176.literal("polygon"),
  points: z176.array(point)
});
expectTypesMatch(true);
var pcb_copper_pour = z176.discriminatedUnion("shape", [
  pcb_copper_pour_rect,
  pcb_copper_pour_brep,
  pcb_copper_pour_polygon
]).describe("Defines a copper pour on the PCB.");
expectTypesMatch(true);

// src/pcb/pcb_component_outside_board_error.ts
import { z as z177 } from "zod";
var pcb_component_outside_board_error = base_circuit_json_error.extend({
  type: z177.literal("pcb_component_outside_board_error"),
  pcb_component_outside_board_error_id: getZodPrefixedIdWithDefault(
    "pcb_component_outside_board_error"
  ),
  error_type: z177.literal("pcb_component_outside_board_error").default("pcb_component_outside_board_error"),
  pcb_component_id: z177.string(),
  pcb_board_id: z177.string(),
  component_center: point,
  component_bounds: z177.object({
    min_x: z177.number(),
    max_x: z177.number(),
    min_y: z177.number(),
    max_y: z177.number()
  }),
  subcircuit_id: z177.string().optional(),
  source_component_id: z177.string().optional()
}).describe(
  "Error emitted when a PCB component is placed outside the board boundaries"
);
expectTypesMatch(true);

// src/pcb/pcb_component_not_on_board_edge_error.ts
import { z as z178 } from "zod";
var pcb_component_not_on_board_edge_error = base_circuit_json_error.extend({
  type: z178.literal("pcb_component_not_on_board_edge_error"),
  pcb_component_not_on_board_edge_error_id: getZodPrefixedIdWithDefault(
    "pcb_component_not_on_board_edge_error"
  ),
  error_type: z178.literal("pcb_component_not_on_board_edge_error").default("pcb_component_not_on_board_edge_error"),
  pcb_component_id: z178.string(),
  pcb_board_id: z178.string(),
  component_center: point,
  pad_to_nearest_board_edge_distance: z178.number(),
  source_component_id: z178.string().optional(),
  subcircuit_id: z178.string().optional()
}).describe(
  "Error emitted when a component that must be placed on the board edge is centered away from the edge"
);
expectTypesMatch(true);

// src/pcb/pcb_component_invalid_layer_error.ts
import { z as z179 } from "zod";
var pcb_component_invalid_layer_error = base_circuit_json_error.extend({
  type: z179.literal("pcb_component_invalid_layer_error"),
  pcb_component_invalid_layer_error_id: getZodPrefixedIdWithDefault(
    "pcb_component_invalid_layer_error"
  ),
  error_type: z179.literal("pcb_component_invalid_layer_error").default("pcb_component_invalid_layer_error"),
  pcb_component_id: z179.string().optional(),
  source_component_id: z179.string(),
  layer: layer_ref,
  subcircuit_id: z179.string().optional()
}).describe(
  "Error emitted when a component is placed on an invalid layer (components can only be on 'top' or 'bottom' layers)"
);
expectTypesMatch(true);

// src/pcb/pcb_via_clearance_error.ts
import { z as z180 } from "zod";
var pcb_via_clearance_error = base_circuit_json_error.extend({
  type: z180.literal("pcb_via_clearance_error"),
  pcb_error_id: getZodPrefixedIdWithDefault("pcb_error"),
  error_type: z180.literal("pcb_via_clearance_error").default("pcb_via_clearance_error"),
  pcb_via_ids: z180.array(z180.string()).min(2),
  minimum_clearance: distance.optional(),
  actual_clearance: distance.optional(),
  pcb_center: z180.object({
    x: z180.number().optional(),
    y: z180.number().optional()
  }).optional(),
  subcircuit_id: z180.string().optional()
}).describe("Error emitted when vias are closer than the allowed clearance");
expectTypesMatch(true);

// src/pcb/pcb_via_trace_clearance_error.ts
import { z as z181 } from "zod";
var pcb_via_trace_clearance_error = base_circuit_json_error.extend({
  type: z181.literal("pcb_via_trace_clearance_error"),
  pcb_via_trace_clearance_error_id: getZodPrefixedIdWithDefault(
    "pcb_via_trace_clearance_error"
  ),
  error_type: z181.literal("pcb_via_trace_clearance_error").default("pcb_via_trace_clearance_error"),
  pcb_via_id: z181.string(),
  pcb_trace_id: z181.string(),
  minimum_clearance: distance.optional(),
  actual_clearance: distance.optional(),
  center: z181.object({
    x: z181.number().optional(),
    y: z181.number().optional()
  }).optional(),
  subcircuit_id: z181.string().optional()
}).describe(
  "Error emitted when a via and trace are closer than the allowed clearance"
);
expectTypesMatch(
  true
);

// src/pcb/pcb_pad_pad_clearance_error.ts
import { z as z182 } from "zod";
var pcb_pad_pad_clearance_error = base_circuit_json_error.extend({
  type: z182.literal("pcb_pad_pad_clearance_error"),
  pcb_pad_pad_clearance_error_id: getZodPrefixedIdWithDefault(
    "pcb_pad_pad_clearance_error"
  ),
  error_type: z182.literal("pcb_pad_pad_clearance_error").default("pcb_pad_pad_clearance_error"),
  pcb_pad_ids: z182.array(z182.string()).min(2),
  minimum_clearance: distance.optional(),
  actual_clearance: distance.optional(),
  center: z182.object({
    x: z182.number().optional(),
    y: z182.number().optional()
  }).optional(),
  subcircuit_id: z182.string().optional()
}).describe("Error emitted when pads are closer than the allowed clearance");
expectTypesMatch(true);

// src/pcb/pcb_pad_trace_clearance_error.ts
import { z as z183 } from "zod";
var pcb_pad_trace_clearance_error = base_circuit_json_error.extend({
  type: z183.literal("pcb_pad_trace_clearance_error"),
  pcb_pad_trace_clearance_error_id: getZodPrefixedIdWithDefault(
    "pcb_pad_trace_clearance_error"
  ),
  error_type: z183.literal("pcb_pad_trace_clearance_error").default("pcb_pad_trace_clearance_error"),
  pcb_pad_id: z183.string(),
  pcb_trace_id: z183.string(),
  minimum_clearance: distance.optional(),
  actual_clearance: distance.optional(),
  center: z183.object({
    x: z183.number().optional(),
    y: z183.number().optional()
  }).optional(),
  subcircuit_id: z183.string().optional()
}).describe(
  "Error emitted when a pad and trace are closer than allowed clearance"
);
expectTypesMatch(
  true
);

// src/pcb/pcb_courtyard_rect.ts
import { z as z184 } from "zod";
var pcb_courtyard_rect = z184.object({
  type: z184.literal("pcb_courtyard_rect"),
  pcb_courtyard_rect_id: getZodPrefixedIdWithDefault("pcb_courtyard_rect"),
  pcb_component_id: z184.string(),
  pcb_group_id: z184.string().optional(),
  subcircuit_id: z184.string().optional(),
  center: point,
  width: length,
  height: length,
  layer: visible_layer,
  ccw_rotation: rotation.optional(),
  color: z184.string().optional()
}).describe("Defines a courtyard rectangle on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_courtyard_outline.ts
import { z as z185 } from "zod";
var pcb_courtyard_outline = z185.object({
  type: z185.literal("pcb_courtyard_outline"),
  pcb_courtyard_outline_id: getZodPrefixedIdWithDefault(
    "pcb_courtyard_outline"
  ),
  pcb_component_id: z185.string(),
  pcb_group_id: z185.string().optional(),
  subcircuit_id: z185.string().optional(),
  layer: visible_layer,
  outline: z185.array(point).min(2)
}).describe("Defines a courtyard outline on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_courtyard_polygon.ts
import { z as z186 } from "zod";
var pcb_courtyard_polygon = z186.object({
  type: z186.literal("pcb_courtyard_polygon"),
  pcb_courtyard_polygon_id: getZodPrefixedIdWithDefault(
    "pcb_courtyard_polygon"
  ),
  pcb_component_id: z186.string(),
  pcb_group_id: z186.string().optional(),
  subcircuit_id: z186.string().optional(),
  layer: visible_layer,
  points: z186.array(point).min(3),
  color: z186.string().optional()
}).describe("Defines a courtyard polygon on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_courtyard_circle.ts
import { z as z187 } from "zod";
var pcb_courtyard_circle = z187.object({
  type: z187.literal("pcb_courtyard_circle"),
  pcb_courtyard_circle_id: getZodPrefixedIdWithDefault(
    "pcb_courtyard_circle"
  ),
  pcb_component_id: z187.string(),
  pcb_group_id: z187.string().optional(),
  subcircuit_id: z187.string().optional(),
  center: point,
  radius: length,
  layer: visible_layer,
  color: z187.string().optional()
}).describe("Defines a courtyard circle on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_courtyard_pill.ts
import { z as z188 } from "zod";
var pcb_courtyard_pill = z188.object({
  type: z188.literal("pcb_courtyard_pill"),
  pcb_courtyard_pill_id: getZodPrefixedIdWithDefault("pcb_courtyard_pill"),
  pcb_component_id: z188.string(),
  pcb_group_id: z188.string().optional(),
  subcircuit_id: z188.string().optional(),
  center: point,
  width: length,
  height: length,
  radius: length,
  layer: visible_layer,
  color: z188.string().optional()
}).describe("Defines a courtyard pill on the PCB");
expectTypesMatch(true);

// src/cad/cad_component.ts
import { z as z189 } from "zod";

// src/cad/cad_model_conventions.ts
var cad_model_formats = [
  "obj",
  "stl",
  "3mf",
  "gltf",
  "glb",
  "step",
  "wrl"
];
var cad_model_axis_directions = [
  "x+",
  "x-",
  "y+",
  "y-",
  "z+",
  "z-"
];
var cadModelDefaultDirectionMap = {
  obj: "z+",
  stl: "z+",
  "3mf": "z+",
  gltf: "y+",
  glb: "y+",
  step: "z+",
  wrl: "y+"
};

// src/cad/cad_component.ts
var cad_component = z189.object({
  type: z189.literal("cad_component"),
  cad_component_id: z189.string(),
  pcb_component_id: z189.string().optional().describe(
    "Optional PCB component reference; omit for CAD geometry without a PCB component"
  ),
  source_component_id: z189.string(),
  position: point3,
  rotation: point3.optional(),
  is_on_folded_board: z189.boolean().optional().describe(
    "True when position and rotation describe the assembled folded board pose. False or omitted means the flat board pose. PCB records remain flat; pcb_component_id identifies the flat mount and owning board for reversible transforms."
  ),
  size: point3.optional(),
  layer: layer_ref.optional(),
  subcircuit_id: z189.string().optional(),
  // These are all ways to generate/load the 3d model
  footprinter_string: z189.string().optional(),
  model_obj_url: z189.string().optional(),
  model_stl_url: z189.string().optional(),
  model_3mf_url: z189.string().optional(),
  model_gltf_url: z189.string().optional(),
  model_glb_url: z189.string().optional(),
  model_step_url: z189.string().optional(),
  model_wrl_url: z189.string().optional(),
  model_asset: asset.optional(),
  model_unit_to_mm_scale_factor: z189.number().optional(),
  model_board_normal_direction: z189.enum(cad_model_axis_directions).optional().describe(
    `The direction in the model's coordinate space that is considered "up" or "coming out of the board surface"`
  ),
  model_origin_position: point3.optional(),
  model_origin_alignment: z189.enum([
    "unknown",
    "center",
    "center_of_component_on_board_surface",
    "bottom_center_of_component"
  ]).optional(),
  model_object_fit: z189.enum(["contain_within_bounds", "fill_bounds"]).optional().default("contain_within_bounds"),
  model_jscad: z189.any().optional(),
  show_as_translucent_model: z189.boolean().optional(),
  show_as_bounding_box: z189.boolean().optional(),
  show_hidden_edges: z189.boolean().optional(),
  anchor_alignment: z189.enum(["center", "center_of_component_on_board_surface"]).optional().default("center")
}).describe("Defines CAD geometry, optionally associated with a PCB component");
expectTypesMatch(true);

// src/cad/cad_collision_error.ts
import { z as z190 } from "zod";
var cad_collision_error = base_circuit_json_error.extend({
  type: z190.literal("cad_collision_error"),
  cad_collision_error_id: getZodPrefixedIdWithDefault("cad_collision_error"),
  error_type: z190.literal("cad_collision_error").default("cad_collision_error"),
  cad_component_ids: z190.array(z190.string()).min(1),
  pcb_component_ids: z190.array(z190.string()).optional(),
  source_component_ids: z190.array(z190.string()).min(1),
  intersection_area_mm2: z190.number().finite().nonnegative(),
  threshold_area_mm2: z190.number().finite().nonnegative()
}).describe(
  "An aperture-bearing part intersects the finished enclosure. The intersection_area_mm2 is the union silhouette area of the solid intersection projected along the aperture face normal, in the right-handed Circuit JSON world frame (+X right, +Y top, +Z above). It is an area in square millimetres, not intersection volume or surface area. This indicates possible aperture misplacement, insufficient size/depth, or body clearance problems; it does not prove which cause applies."
);
expectTypesMatch(true);

// src/simulation/simulation_voltage_source.ts
import { z as z191 } from "zod";
var wave_shape = z191.enum(["sinewave", "square", "triangle", "sawtooth"]);
var percentage = z191.union([z191.string(), z191.number()]).transform((val) => {
  if (typeof val === "string") {
    if (val.endsWith("%")) {
      return parseFloat(val.slice(0, -1)) / 100;
    }
    return parseFloat(val);
  }
  return val;
}).pipe(
  z191.number().min(0, "Duty cycle must be non-negative").max(1, "Duty cycle cannot be greater than 100%")
);
var simulation_dc_voltage_source = z191.object({
  type: z191.literal("simulation_voltage_source"),
  simulation_voltage_source_id: getZodPrefixedIdWithDefault(
    "simulation_voltage_source"
  ),
  is_dc_source: z191.literal(true).optional().default(true),
  positive_source_port_id: z191.string().optional(),
  negative_source_port_id: z191.string().optional(),
  positive_source_net_id: z191.string().optional(),
  negative_source_net_id: z191.string().optional(),
  voltage,
  ac_magnitude: voltage.optional(),
  ac_phase: rotation.optional()
}).describe("Defines a DC voltage source for simulation");
var simulation_ac_voltage_source = z191.object({
  type: z191.literal("simulation_voltage_source"),
  simulation_voltage_source_id: getZodPrefixedIdWithDefault(
    "simulation_voltage_source"
  ),
  is_dc_source: z191.literal(false),
  terminal1_source_port_id: z191.string().optional(),
  terminal2_source_port_id: z191.string().optional(),
  terminal1_source_net_id: z191.string().optional(),
  terminal2_source_net_id: z191.string().optional(),
  voltage: voltage.optional(),
  frequency: frequency.optional(),
  peak_to_peak_voltage: voltage.optional(),
  wave_shape: wave_shape.optional(),
  phase: rotation.optional(),
  duty_cycle: percentage.optional(),
  pulse_delay: ms.optional(),
  rise_time: ms.optional(),
  fall_time: ms.optional(),
  pulse_width: ms.optional(),
  period: ms.optional(),
  ac_magnitude: voltage.optional(),
  ac_phase: rotation.optional()
}).describe("Defines an AC voltage source for simulation");
var simulation_voltage_source = z191.union([simulation_dc_voltage_source, simulation_ac_voltage_source]).describe("Defines a voltage source for simulation");
expectTypesMatch(true);
expectTypesMatch(true);
expectTypesMatch(true);

// src/simulation/simulation_current_source.ts
import { z as z192 } from "zod";
var percentage2 = z192.union([z192.string(), z192.number()]).transform((val) => {
  if (typeof val === "string") {
    if (val.endsWith("%")) {
      return parseFloat(val.slice(0, -1)) / 100;
    }
    return parseFloat(val);
  }
  return val;
}).pipe(
  z192.number().min(0, "Duty cycle must be non-negative").max(1, "Duty cycle cannot be greater than 100%")
);
var simulation_dc_current_source = z192.object({
  type: z192.literal("simulation_current_source"),
  simulation_current_source_id: getZodPrefixedIdWithDefault(
    "simulation_current_source"
  ),
  is_dc_source: z192.literal(true).optional().default(true),
  positive_source_port_id: z192.string().optional(),
  negative_source_port_id: z192.string().optional(),
  positive_source_net_id: z192.string().optional(),
  negative_source_net_id: z192.string().optional(),
  current,
  ac_magnitude: current.optional(),
  ac_phase: rotation.optional()
}).describe("Defines a DC current source for simulation");
var simulation_ac_current_source = z192.object({
  type: z192.literal("simulation_current_source"),
  simulation_current_source_id: getZodPrefixedIdWithDefault(
    "simulation_current_source"
  ),
  is_dc_source: z192.literal(false),
  terminal1_source_port_id: z192.string().optional(),
  terminal2_source_port_id: z192.string().optional(),
  terminal1_source_net_id: z192.string().optional(),
  terminal2_source_net_id: z192.string().optional(),
  current: current.optional(),
  frequency: frequency.optional(),
  peak_to_peak_current: current.optional(),
  wave_shape: wave_shape.optional(),
  phase: rotation.optional(),
  duty_cycle: percentage2.optional(),
  ac_magnitude: current.optional(),
  ac_phase: rotation.optional()
}).describe("Defines an AC current source for simulation");
var simulation_current_source = z192.union([simulation_dc_current_source, simulation_ac_current_source]).describe("Defines a current source for simulation");
expectTypesMatch(true);
expectTypesMatch(true);
expectTypesMatch(true);

// src/simulation/simulation_experiment.ts
import { z as z194 } from "zod";

// src/simulation/simulation_units.ts
import { z as z193 } from "zod";
var simulation_dc_sweep_unit = z193.custom(
  (dcSweepUnit) => dcSweepUnit === "V" || dcSweepUnit === "A"
);
var simulation_parameter_unit = z193.custom(
  (parameterUnit) => parameterUnit === "\u03A9" || parameterUnit === "F" || parameterUnit === "H" || parameterUnit === "V" || parameterUnit === "A"
);

// src/simulation/simulation_experiment.ts
var experiment_type = z194.union([
  z194.literal("spice_dc_sweep"),
  z194.literal("spice_dc_operating_point"),
  z194.literal("spice_transient_analysis"),
  z194.literal("spice_ac_analysis")
]);
var spice_simulation_options = z194.object({
  method: z194.enum(["trap", "gear"]).optional(),
  reltol: z194.union([z194.number(), z194.string()]).optional(),
  abstol: z194.union([z194.number(), z194.string()]).optional(),
  vntol: z194.union([z194.number(), z194.string()]).optional()
}).describe("SPICE solver options for a simulation experiment");
var simulation_experiment = z194.object({
  type: z194.literal("simulation_experiment"),
  simulation_experiment_id: getZodPrefixedIdWithDefault(
    "simulation_experiment"
  ),
  name: z194.string(),
  experiment_type,
  time_per_step: duration_ms.optional(),
  start_time_ms: ms.optional(),
  end_time_ms: ms.optional(),
  spice_options: spice_simulation_options.optional(),
  dc_sweep_voltage_source_id: z194.string().optional(),
  dc_sweep_current_source_id: z194.string().optional(),
  dc_sweep_start: z194.number().optional(),
  dc_sweep_stop: z194.number().optional(),
  dc_sweep_step: z194.number().refine((dcSweepStep) => dcSweepStep !== 0).optional(),
  dc_sweep_unit: simulation_dc_sweep_unit.optional(),
  ac_sweep_type: z194.enum(["linear", "decade", "octave"]).optional(),
  ac_samples_per_interval: z194.number().int().positive().optional(),
  ac_sample_count: z194.number().int().positive().optional(),
  ac_start_frequency_hz: z194.number().positive().optional(),
  ac_stop_frequency_hz: z194.number().positive().optional()
}).superRefine((experiment, context) => {
  if (experiment.experiment_type === "spice_dc_sweep") {
    const requiredFields = [
      "dc_sweep_start",
      "dc_sweep_stop",
      "dc_sweep_step",
      "dc_sweep_unit"
    ];
    for (const field of requiredFields) {
      if (experiment[field] === void 0) {
        context.addIssue({
          code: z194.ZodIssueCode.custom,
          path: [field],
          message: `${field} is required for a DC sweep`
        });
      }
    }
    const hasVoltageSource = experiment.dc_sweep_voltage_source_id !== void 0;
    const hasCurrentSource = experiment.dc_sweep_current_source_id !== void 0;
    if (hasVoltageSource === hasCurrentSource) {
      context.addIssue({
        code: z194.ZodIssueCode.custom,
        path: ["dc_sweep_voltage_source_id"],
        message: "Exactly one DC sweep voltage or current source ID is required"
      });
    }
  }
  if (experiment.experiment_type === "spice_ac_analysis") {
    if (experiment.ac_sweep_type === void 0) {
      context.addIssue({
        code: z194.ZodIssueCode.custom,
        path: ["ac_sweep_type"],
        message: "ac_sweep_type is required for an AC analysis"
      });
    }
    if (experiment.ac_start_frequency_hz === void 0) {
      context.addIssue({
        code: z194.ZodIssueCode.custom,
        path: ["ac_start_frequency_hz"],
        message: "ac_start_frequency_hz is required for an AC analysis"
      });
    }
    if (experiment.ac_stop_frequency_hz === void 0) {
      context.addIssue({
        code: z194.ZodIssueCode.custom,
        path: ["ac_stop_frequency_hz"],
        message: "ac_stop_frequency_hz is required for an AC analysis"
      });
    }
    if (experiment.ac_sweep_type === "linear" && experiment.ac_sample_count === void 0) {
      context.addIssue({
        code: z194.ZodIssueCode.custom,
        path: ["ac_sample_count"],
        message: "ac_sample_count is required for a linear AC analysis"
      });
    }
    if ((experiment.ac_sweep_type === "decade" || experiment.ac_sweep_type === "octave") && experiment.ac_samples_per_interval === void 0) {
      context.addIssue({
        code: z194.ZodIssueCode.custom,
        path: ["ac_samples_per_interval"],
        message: "ac_samples_per_interval is required for decade and octave AC analyses"
      });
    }
  }
}).describe("Defines a simulation experiment configuration");
expectTypesMatch(true);

// src/simulation/simulation_transient_voltage_graph.ts
import { z as z196 } from "zod";

// src/simulation/simulation_parameter_sweep_coordinate.ts
import { z as z195 } from "zod";
var simulation_parameter_sweep_coordinate = z195.object({
  simulation_parameter_sweep_id: z195.string(),
  sweep_index: z195.number().int().nonnegative(),
  parameter_value: z195.number(),
  parameter_unit: simulation_parameter_unit
});
expectTypesMatch(true);

// src/simulation/simulation_transient_voltage_graph.ts
var simulation_transient_voltage_graph = z196.object({
  type: z196.literal("simulation_transient_voltage_graph"),
  simulation_transient_voltage_graph_id: getZodPrefixedIdWithDefault(
    "simulation_transient_voltage_graph"
  ),
  simulation_experiment_id: z196.string(),
  simulation_parameter_sweep_coordinate: simulation_parameter_sweep_coordinate.optional(),
  timestamps_ms: z196.array(z196.number()).optional(),
  voltage_levels: z196.array(z196.number()),
  source_component_id: z196.string().optional(),
  subcircuit_connectivity_map_key: z196.string().optional(),
  time_per_step: duration_ms,
  start_time_ms: ms,
  end_time_ms: ms,
  name: z196.string().optional(),
  color: z196.string().optional()
}).describe("Stores voltage measurements over time for a simulation");
expectTypesMatch(true);

// src/simulation/simulation_transient_current_graph.ts
import { z as z197 } from "zod";
var simulation_transient_current_graph = z197.object({
  type: z197.literal("simulation_transient_current_graph"),
  simulation_transient_current_graph_id: getZodPrefixedIdWithDefault(
    "simulation_transient_current_graph"
  ),
  simulation_experiment_id: z197.string(),
  simulation_parameter_sweep_coordinate: simulation_parameter_sweep_coordinate.optional(),
  timestamps_ms: z197.array(z197.number()).optional(),
  current_levels: z197.array(z197.number()),
  source_component_id: z197.string().optional(),
  subcircuit_connectivity_map_key: z197.string().optional(),
  time_per_step: duration_ms,
  start_time_ms: ms,
  end_time_ms: ms,
  name: z197.string().optional(),
  color: z197.string().optional()
}).describe("Stores current measurements over time for a simulation");
expectTypesMatch(true);

// src/simulation/simulation_switch.ts
import { z as z198 } from "zod";
var simulation_switch = z198.object({
  type: z198.literal("simulation_switch"),
  simulation_switch_id: getZodPrefixedIdWithDefault("simulation_switch"),
  source_component_id: z198.string().optional(),
  closes_at: ms.optional(),
  opens_at: ms.optional(),
  starts_closed: z198.boolean().optional(),
  switching_frequency: frequency.optional()
}).describe("Defines a switch for simulation timing control");
expectTypesMatch(true);

// src/simulation/simulation_voltage_probe.ts
import { z as z199 } from "zod";
var simulation_voltage_probe = z199.object({
  type: z199.literal("simulation_voltage_probe"),
  simulation_voltage_probe_id: getZodPrefixedIdWithDefault(
    "simulation_voltage_probe"
  ),
  source_component_id: z199.string().optional(),
  name: z199.string().optional(),
  signal_input_source_port_id: z199.string().optional(),
  signal_input_source_net_id: z199.string().optional(),
  reference_input_source_port_id: z199.string().optional(),
  reference_input_source_net_id: z199.string().optional(),
  subcircuit_id: z199.string().optional(),
  color: z199.string().optional()
}).describe(
  "Defines a voltage probe for simulation. If a reference input is not provided, it measures against ground. If a reference input is provided, it measures the differential voltage between two points."
).superRefine((data, ctx) => {
  const is_differential = data.reference_input_source_port_id || data.reference_input_source_net_id;
  if (is_differential) {
    const has_ports = !!data.signal_input_source_port_id || !!data.reference_input_source_port_id;
    const has_nets = !!data.signal_input_source_net_id || !!data.reference_input_source_net_id;
    if (has_ports && has_nets) {
      ctx.addIssue({
        code: z199.ZodIssueCode.custom,
        message: "Cannot mix port and net connections in a differential probe."
      });
    } else if (has_ports) {
      if (!data.signal_input_source_port_id || !data.reference_input_source_port_id) {
        ctx.addIssue({
          code: z199.ZodIssueCode.custom,
          message: "Differential port probe requires both signal_input_source_port_id and reference_input_source_port_id."
        });
      }
    } else if (has_nets) {
      if (!data.signal_input_source_net_id || !data.reference_input_source_net_id) {
        ctx.addIssue({
          code: z199.ZodIssueCode.custom,
          message: "Differential net probe requires both signal_input_source_net_id and reference_input_source_net_id."
        });
      }
    }
  } else {
    if (!!data.signal_input_source_port_id === !!data.signal_input_source_net_id) {
      ctx.addIssue({
        code: z199.ZodIssueCode.custom,
        message: "A voltage probe must have exactly one of signal_input_source_port_id or signal_input_source_net_id."
      });
    }
  }
});
expectTypesMatch(true);

// src/simulation/simulation_current_probe.ts
import { z as z200 } from "zod";
var simulation_current_probe = z200.object({
  type: z200.literal("simulation_current_probe"),
  simulation_current_probe_id: getZodPrefixedIdWithDefault(
    "simulation_current_probe"
  ),
  source_component_id: z200.string().optional(),
  name: z200.string().optional(),
  positive_source_port_id: z200.string().optional(),
  negative_source_port_id: z200.string().optional(),
  positive_source_net_id: z200.string().optional(),
  negative_source_net_id: z200.string().optional(),
  subcircuit_id: z200.string().optional(),
  color: z200.string().optional()
}).describe(
  "Defines a current probe for simulation. It measures current flowing from the positive endpoint to the negative endpoint."
).superRefine((data, ctx) => {
  const hasPositivePort = !!data.positive_source_port_id;
  const hasNegativePort = !!data.negative_source_port_id;
  const hasPositiveNet = !!data.positive_source_net_id;
  const hasNegativeNet = !!data.negative_source_net_id;
  const hasPorts = hasPositivePort || hasNegativePort;
  const hasNets = hasPositiveNet || hasNegativeNet;
  if (hasPorts && hasNets) {
    ctx.addIssue({
      code: z200.ZodIssueCode.custom,
      message: "Cannot mix port and net connections in a current probe."
    });
    return;
  }
  if (hasPorts) {
    if (!hasPositivePort || !hasNegativePort) {
      ctx.addIssue({
        code: z200.ZodIssueCode.custom,
        message: "Current probe using source ports requires both positive_source_port_id and negative_source_port_id."
      });
    }
    return;
  }
  if (hasNets) {
    if (!hasPositiveNet || !hasNegativeNet) {
      ctx.addIssue({
        code: z200.ZodIssueCode.custom,
        message: "Current probe using source nets requires both positive_source_net_id and negative_source_net_id."
      });
    }
    return;
  }
  ctx.addIssue({
    code: z200.ZodIssueCode.custom,
    message: "A current probe must have either positive/negative source port ids or positive/negative source net ids."
  });
});
expectTypesMatch(true);

// src/simulation/simulation_unknown_experiment_error.ts
import { z as z201 } from "zod";
var simulation_unknown_experiment_error = base_circuit_json_error.extend({
  type: z201.literal("simulation_unknown_experiment_error"),
  simulation_unknown_experiment_error_id: getZodPrefixedIdWithDefault(
    "simulation_unknown_experiment_error"
  ),
  error_type: z201.literal("simulation_unknown_experiment_error").default("simulation_unknown_experiment_error"),
  simulation_experiment_id: z201.string().optional(),
  subcircuit_id: z201.string().optional()
}).describe("An unknown error occurred during the simulation experiment.");
expectTypesMatch(true);

// src/simulation/simulation_parameter_sweep.ts
import { z as z202 } from "zod";
var simulation_parameter_type = z202.enum([
  "resistance",
  "capacitance",
  "inductance",
  "voltage",
  "current"
]);
var simulation_parameter_sweep_base = z202.object({
  type: z202.literal("simulation_parameter_sweep"),
  simulation_parameter_sweep_id: getZodPrefixedIdWithDefault(
    "simulation_parameter_sweep"
  ),
  simulation_experiment_id: z202.string(),
  name: z202.string().optional(),
  parameter_values: z202.array(z202.number()).min(1),
  parameter_unit: simulation_parameter_unit
});
var simulation_parameter_sweep = z202.discriminatedUnion("parameter_type", [
  simulation_parameter_sweep_base.extend({
    parameter_type: z202.literal("resistance"),
    resistor_source_component_id: z202.string()
  }),
  simulation_parameter_sweep_base.extend({
    parameter_type: z202.literal("capacitance"),
    capacitor_source_component_id: z202.string()
  }),
  simulation_parameter_sweep_base.extend({
    parameter_type: z202.literal("inductance"),
    inductor_source_component_id: z202.string()
  }),
  simulation_parameter_sweep_base.extend({
    parameter_type: z202.literal("voltage"),
    source_net_id: z202.string()
  }),
  simulation_parameter_sweep_base.extend({
    parameter_type: z202.literal("current"),
    current_source_component_id: z202.string()
  })
]).describe("Repeats a simulation experiment over component parameter values");
expectTypesMatch(
  true
);

// src/simulation/simulation_dc_operating_point_voltage.ts
import { z as z203 } from "zod";
var simulation_dc_operating_point_voltage = z203.object({
  type: z203.literal("simulation_dc_operating_point_voltage"),
  simulation_dc_operating_point_voltage_id: getZodPrefixedIdWithDefault(
    "simulation_dc_operating_point_voltage"
  ),
  simulation_experiment_id: z203.string(),
  simulation_parameter_sweep_coordinate: simulation_parameter_sweep_coordinate.optional(),
  simulation_voltage_probe_id: z203.string(),
  voltage: z203.number(),
  name: z203.string().optional(),
  color: z203.string().optional()
});
expectTypesMatch(true);

// src/simulation/simulation_dc_operating_point_current.ts
import { z as z204 } from "zod";
var simulation_dc_operating_point_current = z204.object({
  type: z204.literal("simulation_dc_operating_point_current"),
  simulation_dc_operating_point_current_id: getZodPrefixedIdWithDefault(
    "simulation_dc_operating_point_current"
  ),
  simulation_experiment_id: z204.string(),
  simulation_parameter_sweep_coordinate: simulation_parameter_sweep_coordinate.optional(),
  simulation_current_probe_id: z204.string(),
  current: z204.number(),
  name: z204.string().optional(),
  color: z204.string().optional()
});
expectTypesMatch(true);

// src/simulation/simulation_dc_sweep_voltage_graph.ts
import { z as z205 } from "zod";
var simulation_dc_sweep_voltage_graph = z205.object({
  type: z205.literal("simulation_dc_sweep_voltage_graph"),
  simulation_dc_sweep_voltage_graph_id: getZodPrefixedIdWithDefault(
    "simulation_dc_sweep_voltage_graph"
  ),
  simulation_experiment_id: z205.string(),
  simulation_parameter_sweep_coordinate: simulation_parameter_sweep_coordinate.optional(),
  simulation_voltage_probe_id: z205.string(),
  sweep_values: z205.array(z205.number()),
  sweep_unit: simulation_dc_sweep_unit,
  voltage_levels: z205.array(z205.number()),
  name: z205.string().optional(),
  color: z205.string().optional()
}).refine(
  (graph) => graph.sweep_values.length === graph.voltage_levels.length,
  {
    message: "sweep_values and voltage_levels must have the same length"
  }
);
expectTypesMatch(true);

// src/simulation/simulation_dc_sweep_current_graph.ts
import { z as z206 } from "zod";
var simulation_dc_sweep_current_graph = z206.object({
  type: z206.literal("simulation_dc_sweep_current_graph"),
  simulation_dc_sweep_current_graph_id: getZodPrefixedIdWithDefault(
    "simulation_dc_sweep_current_graph"
  ),
  simulation_experiment_id: z206.string(),
  simulation_parameter_sweep_coordinate: simulation_parameter_sweep_coordinate.optional(),
  simulation_current_probe_id: z206.string(),
  sweep_values: z206.array(z206.number()),
  sweep_unit: simulation_dc_sweep_unit,
  current_levels: z206.array(z206.number()),
  name: z206.string().optional(),
  color: z206.string().optional()
}).refine(
  (graph) => graph.sweep_values.length === graph.current_levels.length,
  {
    message: "sweep_values and current_levels must have the same length"
  }
);
expectTypesMatch(true);

// src/simulation/simulation_ac_sweep_voltage_graph.ts
import { z as z208 } from "zod";

// src/simulation/simulation_complex_sample.ts
import { z as z207 } from "zod";
var simulation_complex_sample = z207.object({
  re: z207.number(),
  im: z207.number()
});
expectTypesMatch(true);

// src/simulation/simulation_ac_sweep_voltage_graph.ts
var simulation_ac_sweep_voltage_graph = z208.object({
  type: z208.literal("simulation_ac_sweep_voltage_graph"),
  simulation_ac_sweep_voltage_graph_id: getZodPrefixedIdWithDefault(
    "simulation_ac_sweep_voltage_graph"
  ),
  simulation_experiment_id: z208.string(),
  simulation_parameter_sweep_coordinate: simulation_parameter_sweep_coordinate.optional(),
  simulation_voltage_probe_id: z208.string(),
  frequencies_hz: z208.array(z208.number()),
  complex_voltages: z208.array(simulation_complex_sample),
  name: z208.string().optional(),
  color: z208.string().optional()
}).refine(
  (graph) => graph.frequencies_hz.length === graph.complex_voltages.length,
  {
    message: "frequencies_hz and complex_voltages must have the same length"
  }
);
expectTypesMatch(true);

// src/simulation/simulation_ac_sweep_current_graph.ts
import { z as z209 } from "zod";
var simulation_ac_sweep_current_graph = z209.object({
  type: z209.literal("simulation_ac_sweep_current_graph"),
  simulation_ac_sweep_current_graph_id: getZodPrefixedIdWithDefault(
    "simulation_ac_sweep_current_graph"
  ),
  simulation_experiment_id: z209.string(),
  simulation_parameter_sweep_coordinate: simulation_parameter_sweep_coordinate.optional(),
  simulation_current_probe_id: z209.string(),
  frequencies_hz: z209.array(z209.number()),
  complex_currents: z209.array(simulation_complex_sample),
  name: z209.string().optional(),
  color: z209.string().optional()
}).refine(
  (graph) => graph.frequencies_hz.length === graph.complex_currents.length,
  {
    message: "frequencies_hz and complex_currents must have the same length"
  }
);
expectTypesMatch(true);

// src/simulation/simulation_op_amp.ts
import { z as z210 } from "zod";
var simulation_op_amp = z210.object({
  type: z210.literal("simulation_op_amp"),
  simulation_op_amp_id: getZodPrefixedIdWithDefault("simulation_op_amp"),
  source_component_id: z210.string().optional(),
  inverting_input_source_port_id: z210.string(),
  non_inverting_input_source_port_id: z210.string(),
  output_source_port_id: z210.string(),
  positive_supply_source_port_id: z210.string(),
  negative_supply_source_port_id: z210.string()
}).describe("Defines a simple ideal operational amplifier for simulation");
expectTypesMatch(true);

// src/simulation/simulation_spice_subcircuit.ts
import { z as z211 } from "zod";
var simulation_spice_subcircuit = z211.object({
  type: z211.literal("simulation_spice_subcircuit"),
  simulation_spice_subcircuit_id: getZodPrefixedIdWithDefault(
    "simulation_spice_subcircuit"
  ),
  source_component_id: z211.string(),
  spice_pin_to_source_port_map: z211.record(z211.string(), z211.string()),
  subcircuit_source: z211.string()
}).describe("Defines a custom SPICE subcircuit model for simulation");
expectTypesMatch(
  true
);

// src/simulation/simulation_oscilloscope_trace.ts
import { z as z212 } from "zod";
var hasValue = (value) => value !== void 0;
var simulation_oscilloscope_trace = z212.object({
  type: z212.literal("simulation_oscilloscope_trace"),
  simulation_oscilloscope_trace_id: getZodPrefixedIdWithDefault(
    "simulation_oscilloscope_trace"
  ),
  simulation_transient_voltage_graph_id: z212.string().optional(),
  simulation_transient_current_graph_id: z212.string().optional(),
  simulation_voltage_probe_id: z212.string().optional(),
  simulation_current_probe_id: z212.string().optional(),
  display_name: z212.string().optional(),
  color: z212.string().optional(),
  display_center_value: z212.number().optional(),
  display_center_offset_divs: z212.number().optional(),
  volts_per_div: z212.number().positive().optional(),
  amps_per_div: z212.number().positive().optional()
}).describe(
  "Defines how a simulation measurement is rendered as an oscilloscope-style trace."
).superRefine((data, ctx) => {
  const voltageReferences = [
    data.simulation_transient_voltage_graph_id,
    data.simulation_voltage_probe_id
  ].filter(hasValue).length;
  const currentReferences = [
    data.simulation_transient_current_graph_id,
    data.simulation_current_probe_id
  ].filter(hasValue).length;
  if (voltageReferences + currentReferences !== 1) {
    ctx.addIssue({
      code: z212.ZodIssueCode.custom,
      message: "An oscilloscope trace must reference exactly one voltage graph, current graph, voltage probe, or current probe."
    });
  }
  if (voltageReferences > 0 && data.amps_per_div !== void 0) {
    ctx.addIssue({
      code: z212.ZodIssueCode.custom,
      message: "Voltage oscilloscope traces must use volts_per_div, not amps_per_div."
    });
  }
  if (currentReferences > 0 && data.volts_per_div !== void 0) {
    ctx.addIssue({
      code: z212.ZodIssueCode.custom,
      message: "Current oscilloscope traces must use amps_per_div, not volts_per_div."
    });
  }
});
expectTypesMatch(true);

// src/any_circuit_element.ts
import { z as z213 } from "zod";
var any_circuit_element = z213.union([
  source_runtime_error,
  source_trace,
  source_bus,
  source_port,
  source_component_internal_connection,
  any_source_component,
  source_net,
  source_group,
  source_simple_chip,
  source_simple_capacitor,
  source_simple_diode,
  source_simple_led,
  source_simple_resistor,
  source_simple_power_source,
  source_simple_battery,
  source_simple_inductor,
  source_simple_pin_header,
  source_simple_pinout,
  source_simple_resonator,
  source_simple_switch,
  source_simple_transistor,
  source_simple_test_point,
  source_simple_mosfet,
  source_simple_op_amp,
  source_simple_potentiometer,
  source_simple_push_button,
  source_pcb_ground_plane,
  source_manually_placed_via,
  source_board,
  source_project_metadata,
  source_invalid_component_property_error,
  source_trace_not_connected_error,
  source_pin_missing_trace_warning,
  source_unnamed_trace_warning,
  source_confusing_net_name_warning,
  source_missing_manufacturer_part_number_warning,
  source_refdes_convention_warning,
  source_no_power_pin_defined_warning,
  source_no_ground_pin_defined_warning,
  source_component_pins_underspecified_warning,
  source_pin_must_be_connected_error,
  unknown_error_finding_part,
  source_part_not_found_warning,
  source_i2c_misconfigured_error,
  source_component_misconfigured_error,
  source_ambiguous_port_reference,
  pcb_component,
  pcb_debug_object,
  pcb_hole,
  pcb_missing_footprint_error,
  external_footprint_load_error,
  circuit_json_footprint_load_error,
  pcb_manual_edit_conflict_warning,
  pcb_connector_not_in_accessible_orientation_warning,
  pcb_component_missing_courtyard_warning,
  supplier_footprint_mismatch_warning,
  pcb_fabricator_extra_charge_warning,
  pcb_plated_hole,
  pcb_keepout,
  pcb_keepout_overlap_warning,
  pcb_port,
  pcb_net,
  pcb_text,
  pcb_trace,
  pcb_trace_warning,
  pcb_trace_too_long_warning,
  pcb_trace_too_long_error,
  pcb_bus_length_skew_error,
  pcb_trace_too_many_vias_warning,
  pcb_via,
  pcb_smtpad,
  pcb_solder_paste,
  pcb_soldermask_opening,
  pcb_board,
  pcb_bend,
  pcb_stiffener,
  pcb_panel,
  pcb_group,
  pcb_trace_hint,
  pcb_silkscreen_line,
  pcb_silkscreen_path,
  pcb_silkscreen_text,
  pcb_silkscreen_pill,
  pcb_copper_text,
  pcb_silkscreen_rect,
  pcb_silkscreen_circle,
  pcb_silkscreen_oval,
  pcb_silkscreen_graphic,
  pcb_trace_error,
  pcb_trace_missing_error,
  pcb_placement_error,
  pcb_packing_error,
  pcb_panelization_placement_error,
  pcb_port_not_matched_error,
  pcb_port_not_connected_error,
  pcb_via_clearance_error,
  pcb_via_trace_clearance_error,
  pcb_pad_pad_clearance_error,
  pcb_pad_trace_clearance_error,
  pcb_fabrication_note_path,
  pcb_fabrication_note_text,
  pcb_fabrication_note_rect,
  pcb_fabrication_note_dimension,
  pcb_note_text,
  pcb_note_rect,
  pcb_note_path,
  pcb_note_line,
  pcb_note_dimension,
  pcb_autorouting_error,
  pcb_preflight_routing_error,
  pcb_footprint_overlap_error,
  pcb_courtyard_overlap_error,
  pcb_breakout_point,
  pcb_cutout,
  pcb_ground_plane,
  pcb_ground_plane_region,
  pcb_thermal_spoke,
  pcb_copper_pour,
  pcb_component_outside_board_error,
  pcb_component_not_on_board_edge_error,
  pcb_component_invalid_layer_error,
  pcb_courtyard_rect,
  pcb_courtyard_outline,
  pcb_courtyard_polygon,
  pcb_courtyard_circle,
  pcb_courtyard_pill,
  schematic_box,
  schematic_text,
  schematic_line,
  schematic_rect,
  schematic_circle,
  schematic_arc,
  schematic_component,
  schematic_symbol,
  schematic_port,
  schematic_trace,
  schematic_path,
  schematic_error,
  schematic_layout_error,
  schematic_net_label,
  schematic_debug_object,
  schematic_voltage_probe,
  schematic_manual_edit_conflict_warning,
  schematic_component_overlap_warning,
  schematic_component_styling_warning,
  schematic_missing_sheet_warning,
  schematic_element_outside_sheet_warning,
  schematic_graphic,
  schematic_group,
  schematic_sheet,
  schematic_table,
  schematic_table_cell,
  cad_component,
  cad_collision_error,
  simulation_voltage_source,
  simulation_current_source,
  simulation_experiment,
  simulation_transient_voltage_graph,
  simulation_transient_current_graph,
  simulation_dc_operating_point_voltage,
  simulation_dc_operating_point_current,
  simulation_dc_sweep_voltage_graph,
  simulation_dc_sweep_current_graph,
  simulation_ac_sweep_voltage_graph,
  simulation_ac_sweep_current_graph,
  simulation_parameter_sweep,
  simulation_switch,
  simulation_voltage_probe,
  simulation_current_probe,
  simulation_oscilloscope_trace,
  simulation_unknown_experiment_error,
  simulation_op_amp,
  simulation_spice_subcircuit
]);
var any_soup_element = any_circuit_element;
expectTypesMatch(true);
expectStringUnionsMatch(true);
export {
  all_layers,
  any_circuit_element,
  any_soup_element,
  any_source_component,
  asset,
  base_circuit_json_error,
  battery_capacity,
  brep_shape,
  cadModelDefaultDirectionMap,
  cad_collision_error,
  cad_component,
  cad_model_axis_directions,
  cad_model_formats,
  capacitance,
  circuit_json_footprint_load_error,
  current,
  distance,
  duration_ms,
  experiment_type,
  external_footprint_load_error,
  frequency,
  getRotationBetweenPcbPin1Locations,
  getZodPrefixedIdWithDefault,
  inductance,
  insertionDirectionToCanonical,
  insertionDirectionToVector,
  insertion_direction,
  kicadAt,
  kicadEffects,
  kicadFont,
  kicadFootprintAttributes,
  kicadFootprintMetadata,
  kicadFootprintModel,
  kicadFootprintPad,
  kicadFootprintProperties,
  kicadProperty,
  kicadSymbolEffects,
  kicadSymbolMetadata,
  kicadSymbolPinNames,
  kicadSymbolPinNumbers,
  kicadSymbolProperties,
  kicadSymbolProperty,
  layer_ref,
  layer_string,
  length,
  manufacturing_drc_properties,
  ms,
  ninePointAnchor,
  parseAndConvertSiUnit2 as parseAndConvertSiUnit,
  pcbRenderLayer,
  pcb_autorouting_error,
  pcb_bend,
  pcb_board,
  pcb_breakout_point,
  pcb_bus_length_skew_error,
  pcb_component,
  pcb_component_invalid_layer_error,
  pcb_component_missing_courtyard_warning,
  pcb_component_not_on_board_edge_error,
  pcb_component_outside_board_error,
  pcb_connector_not_in_accessible_orientation_warning,
  pcb_copper_pour,
  pcb_copper_pour_brep,
  pcb_copper_pour_polygon,
  pcb_copper_pour_rect,
  pcb_copper_text,
  pcb_courtyard_circle,
  pcb_courtyard_outline,
  pcb_courtyard_overlap_error,
  pcb_courtyard_pill,
  pcb_courtyard_polygon,
  pcb_courtyard_rect,
  pcb_cutout,
  pcb_cutout_circle,
  pcb_cutout_path,
  pcb_cutout_polygon,
  pcb_cutout_rect,
  pcb_debug_line,
  pcb_debug_object,
  pcb_debug_object_base,
  pcb_debug_point,
  pcb_debug_rect,
  pcb_fabrication_note_dimension,
  pcb_fabrication_note_path,
  pcb_fabrication_note_rect,
  pcb_fabrication_note_text,
  pcb_fabricator_extra_charge_warning,
  pcb_footprint_overlap_error,
  pcb_ground_plane,
  pcb_ground_plane_region,
  pcb_group,
  pcb_hole,
  pcb_hole_circle_or_square_shape,
  pcb_hole_circle_shape,
  pcb_hole_oval_shape,
  pcb_hole_pill_shape,
  pcb_hole_rect_shape,
  pcb_hole_rotated_pill_shape,
  pcb_keepout,
  pcb_keepout_outline,
  pcb_keepout_overlap_warning,
  pcb_manual_edit_conflict_warning,
  pcb_missing_footprint_error,
  pcb_net,
  pcb_note_dimension,
  pcb_note_line,
  pcb_note_path,
  pcb_note_rect,
  pcb_note_text,
  pcb_packing_error,
  pcb_pad_pad_clearance_error,
  pcb_pad_trace_clearance_error,
  pcb_panel,
  pcb_panelization_placement_error,
  pcb_pin1_location,
  pcb_placement_error,
  pcb_plated_hole,
  pcb_port,
  pcb_port_not_connected_error,
  pcb_port_not_matched_error,
  pcb_preflight_routing_error,
  pcb_route_hint,
  pcb_route_hints,
  pcb_silkscreen_circle,
  pcb_silkscreen_graphic,
  pcb_silkscreen_graphic_brep,
  pcb_silkscreen_line,
  pcb_silkscreen_oval,
  pcb_silkscreen_path,
  pcb_silkscreen_pill,
  pcb_silkscreen_rect,
  pcb_silkscreen_text,
  pcb_smtpad,
  pcb_smtpad_pill,
  pcb_solder_paste,
  pcb_soldermask_opening,
  pcb_stiffener,
  pcb_stiffener_polygon,
  pcb_stiffener_rect,
  pcb_text,
  pcb_thermal_spoke,
  pcb_trace,
  pcb_trace_error,
  pcb_trace_hint,
  pcb_trace_missing_error,
  pcb_trace_route_point,
  pcb_trace_route_point_through_pad,
  pcb_trace_route_point_via,
  pcb_trace_route_point_wire,
  pcb_trace_too_long_error,
  pcb_trace_too_long_warning,
  pcb_trace_too_many_vias_warning,
  pcb_trace_warning,
  pcb_via,
  pcb_via_clearance_error,
  pcb_via_trace_clearance_error,
  point,
  point3,
  point_with_bulge,
  port_arrangement,
  position,
  position3,
  resistance,
  ring,
  rotation,
  route_hint_point,
  schematic_arc,
  schematic_box,
  schematic_circle,
  schematic_component,
  schematic_component_overlap_warning,
  schematic_component_port_arrangement_by_sides,
  schematic_component_port_arrangement_by_size,
  schematic_component_styling_warning,
  schematic_debug_line,
  schematic_debug_object,
  schematic_debug_object_base,
  schematic_debug_point,
  schematic_debug_rect,
  schematic_element_outside_sheet_warning,
  schematic_error,
  schematic_graphic,
  schematic_group,
  schematic_layout_error,
  schematic_line,
  schematic_manual_edit_conflict_warning,
  schematic_missing_sheet_warning,
  schematic_net_label,
  schematic_path,
  schematic_pin_styles,
  schematic_port,
  schematic_rect,
  schematic_sheet,
  schematic_sheet_size,
  schematic_symbol,
  schematic_table,
  schematic_table_cell,
  schematic_text,
  schematic_text_part,
  schematic_trace,
  schematic_voltage_probe,
  simulation_ac_current_source,
  simulation_ac_sweep_current_graph,
  simulation_ac_sweep_voltage_graph,
  simulation_ac_voltage_source,
  simulation_complex_sample,
  simulation_current_probe,
  simulation_current_source,
  simulation_dc_current_source,
  simulation_dc_operating_point_current,
  simulation_dc_operating_point_voltage,
  simulation_dc_sweep_current_graph,
  simulation_dc_sweep_unit,
  simulation_dc_sweep_voltage_graph,
  simulation_dc_voltage_source,
  simulation_experiment,
  simulation_op_amp,
  simulation_oscilloscope_trace,
  simulation_parameter_sweep,
  simulation_parameter_sweep_coordinate,
  simulation_parameter_type,
  simulation_parameter_unit,
  simulation_spice_subcircuit,
  simulation_switch,
  simulation_transient_current_graph,
  simulation_transient_voltage_graph,
  simulation_unknown_experiment_error,
  simulation_voltage_probe,
  simulation_voltage_source,
  size,
  source_ambiguous_port_reference,
  source_board,
  source_bus,
  source_component_base,
  source_component_internal_connection,
  source_component_misconfigured_error,
  source_component_pins_underspecified_warning,
  source_confusing_net_name_warning,
  source_failed_to_create_component_error,
  source_group,
  source_i2c_misconfigured_error,
  source_interconnect,
  source_invalid_component_property_error,
  source_manually_placed_via,
  source_missing_manufacturer_part_number_warning,
  source_missing_property_error,
  source_net,
  source_no_ground_pin_defined_warning,
  source_no_power_pin_defined_warning,
  source_part_not_found_warning,
  source_pcb_ground_plane,
  source_pin_attributes,
  source_pin_missing_trace_warning,
  source_pin_must_be_connected_error,
  source_port,
  source_project_metadata,
  source_property_ignored_warning,
  source_refdes_convention_warning,
  source_runtime_error,
  source_simple_ammeter,
  source_simple_battery,
  source_simple_capacitor,
  source_simple_chip,
  source_simple_connector,
  source_simple_connector_standards,
  source_simple_crystal,
  source_simple_current_source,
  source_simple_diode,
  source_simple_fiducial,
  source_simple_fuse,
  source_simple_ground,
  source_simple_inductor,
  source_simple_led,
  source_simple_mosfet,
  source_simple_op_amp,
  source_simple_pin_header,
  source_simple_pinout,
  source_simple_potentiometer,
  source_simple_power_source,
  source_simple_push_button,
  source_simple_resistor,
  source_simple_resonator,
  source_simple_switch,
  source_simple_test_point,
  source_simple_transistor,
  source_simple_voltage_probe,
  source_simple_voltage_source,
  source_trace,
  source_trace_not_connected_error,
  source_unnamed_trace_warning,
  spice_simulation_options,
  supplier_footprint_mismatch_warning,
  supplier_name,
  time,
  timestamp,
  unknown_error_finding_part,
  visible_layer,
  voltage,
  wave_shape
};
//# sourceMappingURL=index.mjs.map