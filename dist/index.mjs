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
var duration_ms = z.string().or(z.number()).transform((v, context) => {
  try {
    const { value, unitOfValue } = parseAndConvertSiUnit(v);
    if ((unitOfValue === null || unitOfValue === "ms") && Number.isFinite(value)) {
      return value;
    }
  } catch {
  }
  context.addIssue({
    code: z.ZodIssueCode.custom,
    message: "Expected a finite number of milliseconds or a time unit"
  });
  return z.NEVER;
});
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

// src/common/shape.ts
import { z as z5 } from "zod";
var finite_distance = distance.pipe(z5.number().finite());
var positive_distance = distance.pipe(z5.number().finite().positive());
var circle_shape = z5.object({
  shape: z5.literal("circle"),
  x: finite_distance,
  y: finite_distance,
  radius: positive_distance
}).strict();
var rect_shape = z5.object({
  shape: z5.literal("rect"),
  x: finite_distance,
  y: finite_distance,
  width: positive_distance,
  height: positive_distance
}).strict();
var rotated_rect_shape = rect_shape.extend({
  shape: z5.literal("rotated_rect"),
  ccw_rotation: rotation.pipe(z5.number().finite())
});
var polygon_shape = z5.object({
  shape: z5.literal("polygon"),
  points: z5.array(point.extend({ x: finite_distance, y: finite_distance })).min(3).refine((points) => {
    const twice_area = points.reduce((sum, point2, index) => {
      const next = points[(index + 1) % points.length];
      return sum + point2.x * next.y - next.x * point2.y;
    }, 0);
    return Number.isFinite(twice_area) && twice_area !== 0;
  }, "Polygon boundary must enclose a nonzero area")
}).strict();
expectTypesMatch(true);
expectTypesMatch(true);
expectTypesMatch(true);
expectTypesMatch(true);
var standard_shape = z5.discriminatedUnion("shape", [
  circle_shape,
  rect_shape,
  rotated_rect_shape,
  polygon_shape
]);
expectTypesMatch(true);

// src/common/getZodPrefixedIdWithDefault.ts
import { z as z6 } from "zod";
var randomId = (length4) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length: length4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};
var getZodPrefixedIdWithDefault = (prefix) => {
  return z6.string().optional().default(() => `${prefix}_${randomId(10)}`);
};

// src/common/NinePointAnchor.ts
import { z as z7 } from "zod";
var ninePointAnchor = z7.enum([
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
import { z as z8 } from "zod";
var pcbRenderLayer = z8.enum([
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
import { z as z9 } from "zod";
var asset = z9.object({
  project_relative_path: z9.string(),
  url: z9.string(),
  mimetype: z9.string()
});
expectTypesMatch(true);

// src/common/kicadFootprintMetadata.ts
import { z as z10 } from "zod";
var kicadAt = point.extend({
  rotation: rotation.optional()
});
expectTypesMatch(true);
var kicadFont = z10.object({
  size: point.optional(),
  thickness: distance.optional()
});
expectTypesMatch(true);
var kicadEffects = z10.object({
  font: kicadFont.optional()
});
expectTypesMatch(true);
var kicadProperty = z10.object({
  value: z10.string(),
  at: kicadAt.optional(),
  layer: z10.string().optional(),
  uuid: z10.string().optional(),
  hide: z10.boolean().optional(),
  effects: kicadEffects.optional()
});
expectTypesMatch(true);
var kicadFootprintProperties = z10.object({
  Reference: kicadProperty.optional(),
  Value: kicadProperty.optional(),
  Datasheet: kicadProperty.optional(),
  Description: kicadProperty.optional()
});
expectTypesMatch(
  true
);
var kicadFootprintAttributes = z10.object({
  through_hole: z10.boolean().optional(),
  smd: z10.boolean().optional(),
  exclude_from_pos_files: z10.boolean().optional(),
  exclude_from_bom: z10.boolean().optional()
});
expectTypesMatch(
  true
);
var kicadFootprintPad = z10.object({
  name: z10.string(),
  type: z10.string(),
  shape: z10.string().optional(),
  at: kicadAt.optional(),
  size: point.optional(),
  drill: distance.optional(),
  layers: z10.array(z10.string()).optional(),
  removeUnusedLayers: z10.boolean().optional(),
  uuid: z10.string().optional()
});
expectTypesMatch(true);
var kicadFootprintModel = z10.object({
  path: z10.string(),
  offset: point3.optional(),
  scale: point3.optional(),
  rotate: point3.optional()
});
expectTypesMatch(true);
var kicadFootprintMetadata = z10.object({
  footprintName: z10.string().optional(),
  version: z10.union([z10.number(), z10.string()]).optional(),
  generator: z10.string().optional(),
  generatorVersion: z10.union([z10.number(), z10.string()]).optional(),
  layer: z10.string().optional(),
  properties: kicadFootprintProperties.optional(),
  attributes: kicadFootprintAttributes.optional(),
  pads: z10.array(kicadFootprintPad).optional(),
  embeddedFonts: z10.boolean().optional(),
  model: kicadFootprintModel.optional()
});
expectTypesMatch(true);

// src/common/kicadSymbolMetadata.ts
import { z as z11 } from "zod";
var kicadSymbolPinNumbers = z11.object({
  hide: z11.boolean().optional()
});
expectTypesMatch(true);
var kicadSymbolPinNames = z11.object({
  offset: distance.optional(),
  hide: z11.boolean().optional()
});
expectTypesMatch(true);
var kicadSymbolEffects = z11.object({
  font: kicadFont.optional(),
  justify: z11.union([z11.string(), z11.array(z11.string())]).optional(),
  hide: z11.boolean().optional()
});
expectTypesMatch(true);
var kicadSymbolProperty = z11.object({
  value: z11.string(),
  id: z11.union([z11.number(), z11.string()]).optional(),
  at: kicadAt.optional(),
  effects: kicadSymbolEffects.optional()
});
expectTypesMatch(true);
var kicadSymbolProperties = z11.object({
  Reference: kicadSymbolProperty.optional(),
  Value: kicadSymbolProperty.optional(),
  Footprint: kicadSymbolProperty.optional(),
  Datasheet: kicadSymbolProperty.optional(),
  Description: kicadSymbolProperty.optional(),
  ki_keywords: kicadSymbolProperty.optional(),
  ki_fp_filters: kicadSymbolProperty.optional()
});
expectTypesMatch(true);
var kicadSymbolMetadata = z11.object({
  symbolName: z11.string().optional(),
  extends: z11.string().optional(),
  pinNumbers: kicadSymbolPinNumbers.optional(),
  pinNames: kicadSymbolPinNames.optional(),
  excludeFromSim: z11.boolean().optional(),
  inBom: z11.boolean().optional(),
  onBoard: z11.boolean().optional(),
  properties: kicadSymbolProperties.optional(),
  embeddedFonts: z11.boolean().optional()
});
expectTypesMatch(true);

// src/base_circuit_json_error.ts
import { z as z12 } from "zod";
var base_circuit_json_error = z12.object({
  error_type: z12.string(),
  message: z12.string(),
  is_fatal: z12.boolean().optional()
});
expectTypesMatch(true);

// src/source/source_simple_capacitor.ts
import { z as z15 } from "zod";

// src/pcb/properties/supplier_name.ts
import { z as z13 } from "zod";
var supplier_name = z13.enum([
  "jlcpcb",
  "macrofab",
  "pcbway",
  "digikey",
  "mouser",
  "lcsc"
]);
expectTypesMatch(true);

// src/source/base/source_component_base.ts
import { z as z14 } from "zod";
var source_component_base = z14.object({
  type: z14.literal("source_component"),
  ftype: z14.string().optional(),
  source_component_id: z14.string(),
  name: z14.string(),
  manufacturer_part_number: z14.string().optional(),
  supplier_part_numbers: z14.record(supplier_name, z14.array(z14.string())).optional(),
  display_value: z14.string().optional(),
  display_name: z14.string().optional(),
  are_pins_interchangeable: z14.boolean().optional(),
  internally_connected_source_port_ids: z14.array(z14.array(z14.string())).optional(),
  source_group_id: z14.string().optional(),
  subcircuit_id: z14.string().optional()
});
expectTypesMatch(true);

// src/source/source_simple_capacitor.ts
var source_simple_capacitor = source_component_base.extend({
  ftype: z15.literal("simple_capacitor"),
  capacitance,
  max_voltage_rating: voltage.optional(),
  display_capacitance: z15.string().optional(),
  max_decoupling_trace_length: distance.optional()
});
expectTypesMatch(true);

// src/source/source_simple_resistor.ts
import { z as z16 } from "zod";
var source_simple_resistor = source_component_base.extend({
  ftype: z16.literal("simple_resistor"),
  resistance,
  display_resistance: z16.string().optional()
});
expectTypesMatch(true);

// src/source/source_simple_diode.ts
import { z as z17 } from "zod";
var source_simple_diode = source_component_base.extend({
  ftype: z17.literal("simple_diode")
});
expectTypesMatch(true);

// src/source/source_simple_fiducial.ts
import { z as z18 } from "zod";
var source_simple_fiducial = source_component_base.extend({
  ftype: z18.literal("simple_fiducial")
});
expectTypesMatch(true);

// src/source/source_simple_led.ts
import { z as z19 } from "zod";
var source_simple_led = source_simple_diode.extend({
  ftype: z19.literal("simple_led"),
  color: z19.string().optional(),
  wavelength: z19.string().optional()
});
expectTypesMatch(true);

// src/source/source_simple_ground.ts
import { z as z20 } from "zod";
var source_simple_ground = source_component_base.extend({
  ftype: z20.literal("simple_ground")
});
expectTypesMatch(true);

// src/source/source_simple_chip.ts
import { z as z21 } from "zod";
var source_simple_chip = source_component_base.extend({
  ftype: z21.literal("simple_chip")
});
expectTypesMatch(true);

// src/source/source_printed_part.ts
import { z as z22 } from "zod";
var source_printed_part = source_component_base.extend({
  ftype: z22.literal("printedpart"),
  material: z22.enum(["pla", "petg", "nylon"]).optional(),
  color: z22.string().trim().min(1).optional()
});
expectTypesMatch(true);

// src/source/source_subassembly.ts
import { z as z23 } from "zod";
var source_subassembly = source_component_base.extend({
  ftype: z23.literal("subassembly")
});
expectTypesMatch(true);

// src/source/source_motor.ts
import { z as z24 } from "zod";
var source_motor = source_component_base.extend({
  ftype: z24.literal("motor")
});
expectTypesMatch(true);

// src/source/source_simple_power_source.ts
import { z as z25 } from "zod";
var source_simple_power_source = source_component_base.extend({
  ftype: z25.literal("simple_power_source"),
  voltage
});
expectTypesMatch(true);

// src/source/source_simple_current_source.ts
import { z as z26 } from "zod";
var source_simple_current_source = source_component_base.extend({
  ftype: z26.literal("simple_current_source"),
  current,
  frequency: frequency.optional(),
  peak_to_peak_current: current.optional(),
  wave_shape: z26.enum(["sine", "square", "triangle", "sawtooth", "dc"]).optional().default("dc"),
  phase: z26.number().optional(),
  duty_cycle: z26.number().min(0).max(1).optional()
});
expectTypesMatch(
  true
);

// src/source/source_simple_fuse.ts
import { z as z27 } from "zod";
var source_simple_fuse = source_component_base.extend({
  ftype: z27.literal("simple_fuse"),
  current_rating_amps: z27.number().describe("Nominal current in amps the fuse is rated for"),
  voltage_rating_volts: z27.number().describe("Voltage rating in volts, e.g. \xB15V would be 5")
});
expectTypesMatch(true);

// src/source/source_simple_ammeter.ts
import { z as z28 } from "zod";
var source_simple_ammeter = source_component_base.extend({
  ftype: z28.literal("simple_ammeter")
});
expectTypesMatch(true);

// src/source/properties/source_pin_attributes.ts
import { z as z29 } from "zod";
var pin_voltage = z29.union([
  z29.number(),
  z29.string().trim().regex(
    /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?\s*(?:[fpnumkKMGTµμ]?V?|V)?$/,
    "Expected a scalar voltage, optionally with SI units"
  )
]).pipe(voltage).pipe(z29.number().finite());
var source_pin_attributes = z29.object({
  is_input: z29.boolean().optional(),
  is_output: z29.boolean().optional(),
  is_bidirectional: z29.boolean().optional(),
  is_passive: z29.boolean().optional(),
  can_use_tri_state: z29.boolean().optional(),
  is_using_tri_state: z29.boolean().optional(),
  can_use_open_collector: z29.boolean().optional(),
  is_using_open_collector: z29.boolean().optional(),
  can_use_open_emitter: z29.boolean().optional(),
  is_using_open_emitter: z29.boolean().optional(),
  is_gpio: z29.boolean().optional(),
  highlight_color: z29.string().optional(),
  must_be_connected: z29.boolean().optional(),
  provides_power: z29.boolean().optional(),
  requires_power: z29.boolean().optional(),
  provides_ground: z29.boolean().optional(),
  requires_ground: z29.boolean().optional(),
  provides_voltage: pin_voltage.optional(),
  requires_voltage: pin_voltage.optional(),
  required_voltage_tolerance: z29.number().finite().min(0).max(1).optional(),
  do_not_connect: z29.boolean().optional(),
  include_in_board_pinout: z29.boolean().optional(),
  can_use_internal_pullup: z29.boolean().optional(),
  is_using_internal_pullup: z29.boolean().optional(),
  needs_external_pullup: z29.boolean().optional(),
  can_use_internal_pulldown: z29.boolean().optional(),
  is_using_internal_pulldown: z29.boolean().optional(),
  needs_external_pulldown: z29.boolean().optional(),
  can_use_open_drain: z29.boolean().optional(),
  is_using_open_drain: z29.boolean().optional(),
  can_use_push_pull: z29.boolean().optional(),
  is_using_push_pull: z29.boolean().optional(),
  should_have_decoupling_capacitor: z29.boolean().optional(),
  recommended_decoupling_capacitor_capacitance: z29.union([z29.string(), z29.number()]).optional(),
  is_configured_for_i2c_sda: z29.boolean().optional(),
  is_configured_for_i2c_scl: z29.boolean().optional(),
  is_configured_for_spi_mosi: z29.boolean().optional(),
  is_configured_for_spi_miso: z29.boolean().optional(),
  is_configured_for_spi_sck: z29.boolean().optional(),
  is_configured_for_spi_cs: z29.boolean().optional(),
  is_configured_for_uart_tx: z29.boolean().optional(),
  is_configured_for_uart_rx: z29.boolean().optional(),
  supports_i2c_sda: z29.boolean().optional(),
  supports_i2c_scl: z29.boolean().optional(),
  supports_spi_mosi: z29.boolean().optional(),
  supports_spi_miso: z29.boolean().optional(),
  supports_spi_sck: z29.boolean().optional(),
  supports_spi_cs: z29.boolean().optional(),
  supports_uart_tx: z29.boolean().optional(),
  supports_uart_rx: z29.boolean().optional()
});
expectTypesMatch(true);

// src/source/any_source_component.ts
import { z as z60 } from "zod";

// src/source/source_simple_battery.ts
import { z as z30 } from "zod";
var source_simple_battery = source_component_base.extend({
  ftype: z30.literal("simple_battery"),
  capacity: battery_capacity
});
expectTypesMatch(true);

// src/source/source_simple_inductor.ts
import { z as z31 } from "zod";
var source_simple_inductor = source_component_base.extend({
  ftype: z31.literal("simple_inductor"),
  inductance,
  display_inductance: z31.string().optional(),
  max_current_rating: z31.number().optional()
});
expectTypesMatch(true);

// src/source/source_simple_push_button.ts
import { z as z32 } from "zod";
var source_simple_push_button = source_component_base.extend({
  ftype: z32.literal("simple_push_button")
});
expectTypesMatch(true);

// src/source/source_simple_potentiometer.ts
import { z as z33 } from "zod";
var source_simple_potentiometer = source_component_base.extend({
  ftype: z33.literal("simple_potentiometer"),
  max_resistance: resistance,
  display_max_resistance: z33.string().optional()
});
expectTypesMatch(
  true
);

// src/source/source_simple_crystal.ts
import { z as z34 } from "zod";
var source_simple_crystal = source_component_base.extend({
  ftype: z34.literal("simple_crystal"),
  frequency: z34.number().describe("Frequency in Hz"),
  load_capacitance: z34.number().optional().describe("Load capacitance in pF"),
  pin_variant: z34.enum(["two_pin", "four_pin"]).optional()
});
expectTypesMatch(true);

// src/source/source_simple_pin_header.ts
import { z as z35 } from "zod";
var source_simple_pin_header = source_component_base.extend({
  ftype: z35.literal("simple_pin_header"),
  pin_count: z35.number(),
  gender: z35.enum(["male", "female"]).optional().default("male")
});
expectTypesMatch(true);

// src/source/source_simple_connector.ts
import { z as z36 } from "zod";
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
  ftype: z36.literal("simple_connector"),
  standard: z36.enum(source_simple_connector_standards).optional(),
  pin_count: z36.number().int().positive().optional()
});
expectTypesMatch(true);

// src/source/source_simple_pinout.ts
import { z as z37 } from "zod";
var source_simple_pinout = source_component_base.extend({
  ftype: z37.literal("simple_pinout")
});
expectTypesMatch(true);

// src/source/source_simple_resonator.ts
import { z as z38 } from "zod";
var source_simple_resonator = source_component_base.extend({
  ftype: z38.literal("simple_resonator"),
  load_capacitance: capacitance,
  equivalent_series_resistance: resistance.optional(),
  frequency
});
expectTypesMatch(true);

// src/source/source_simple_transistor.ts
import { z as z39 } from "zod";
var source_simple_transistor = source_component_base.extend({
  ftype: z39.literal("simple_transistor"),
  transistor_type: z39.enum(["npn", "pnp"])
});
expectTypesMatch(true);

// src/source/source_simple_test_point.ts
import { z as z40 } from "zod";
var source_simple_test_point = source_component_base.extend({
  ftype: z40.literal("simple_test_point"),
  footprint_variant: z40.enum(["pad", "through_hole"]).optional(),
  pad_shape: z40.enum(["rect", "circle"]).optional(),
  pad_diameter: z40.union([z40.number(), z40.string()]).optional(),
  hole_diameter: z40.union([z40.number(), z40.string()]).optional(),
  width: z40.union([z40.number(), z40.string()]).optional(),
  height: z40.union([z40.number(), z40.string()]).optional()
});
expectTypesMatch(true);

// src/source/source_simple_mosfet.ts
import { z as z41 } from "zod";
var source_simple_mosfet = source_component_base.extend({
  ftype: z41.literal("simple_mosfet"),
  channel_type: z41.enum(["n", "p"]),
  mosfet_mode: z41.enum(["enhancement", "depletion"])
});
expectTypesMatch(true);

// src/source/source_simple_op_amp.ts
import { z as z42 } from "zod";
var source_simple_op_amp = source_component_base.extend({
  ftype: z42.literal("simple_op_amp")
});
expectTypesMatch(true);

// src/source/source_simple_switch.ts
import { z as z43 } from "zod";
var source_simple_switch = source_component_base.extend({
  ftype: z43.literal("simple_switch")
});
expectTypesMatch(true);

// src/source/source_project_metadata.ts
import { z as z44 } from "zod";
var source_project_metadata = z44.object({
  type: z44.literal("source_project_metadata"),
  name: z44.string().optional(),
  software_used_string: z44.string().optional(),
  project_url: z44.string().optional(),
  source_filesystem_md5_hash: z44.string().optional(),
  created_at: timestamp.optional()
});
expectTypesMatch(true);

// src/source/source_missing_property_error.ts
import { z as z45 } from "zod";
var source_missing_property_error = base_circuit_json_error.extend({
  type: z45.literal("source_missing_property_error"),
  source_missing_property_error_id: getZodPrefixedIdWithDefault(
    "source_missing_property_error"
  ),
  source_component_id: z45.string(),
  property_name: z45.string(),
  subcircuit_id: z45.string().optional(),
  error_type: z45.literal("source_missing_property_error").default("source_missing_property_error")
}).describe("The source code is missing a property");
expectTypesMatch(true);

// src/source/source_failed_to_create_component_error.ts
import { z as z46 } from "zod";
var source_failed_to_create_component_error = base_circuit_json_error.extend({
  type: z46.literal("source_failed_to_create_component_error"),
  source_failed_to_create_component_error_id: getZodPrefixedIdWithDefault(
    "source_failed_to_create_component_error"
  ),
  error_type: z46.literal("source_failed_to_create_component_error").default("source_failed_to_create_component_error"),
  component_name: z46.string().optional(),
  subcircuit_id: z46.string().optional(),
  parent_source_component_id: z46.string().optional(),
  pcb_center: z46.object({
    x: z46.number().optional(),
    y: z46.number().optional()
  }).optional(),
  schematic_center: z46.object({
    x: z46.number().optional(),
    y: z46.number().optional()
  }).optional()
}).describe("Error emitted when a component fails to be constructed");
expectTypesMatch(true);

// src/source/source_invalid_component_property_error.ts
import { z as z47 } from "zod";
var source_invalid_component_property_error = base_circuit_json_error.extend({
  type: z47.literal("source_invalid_component_property_error"),
  source_invalid_component_property_error_id: getZodPrefixedIdWithDefault(
    "source_invalid_component_property_error"
  ),
  source_component_id: z47.string(),
  property_name: z47.string(),
  property_value: z47.unknown().optional(),
  expected_format: z47.string().optional(),
  subcircuit_id: z47.string().optional(),
  error_type: z47.literal("source_invalid_component_property_error").default("source_invalid_component_property_error")
}).describe("The source component property is invalid");
expectTypesMatch(true);

// src/source/source_trace_not_connected_error.ts
import { z as z48 } from "zod";
var source_trace_not_connected_error = base_circuit_json_error.extend({
  type: z48.literal("source_trace_not_connected_error"),
  source_trace_not_connected_error_id: getZodPrefixedIdWithDefault(
    "source_trace_not_connected_error"
  ),
  error_type: z48.literal("source_trace_not_connected_error").default("source_trace_not_connected_error"),
  subcircuit_id: z48.string().optional(),
  source_group_id: z48.string().optional(),
  source_trace_id: z48.string().optional(),
  connected_source_port_ids: z48.array(z48.string()).optional(),
  selectors_not_found: z48.array(z48.string()).optional()
}).describe("Occurs when a source trace selector does not match any ports");
expectTypesMatch(true);

// src/source/source_property_ignored_warning.ts
import { z as z49 } from "zod";
var source_property_ignored_warning = z49.object({
  type: z49.literal("source_property_ignored_warning"),
  source_property_ignored_warning_id: getZodPrefixedIdWithDefault(
    "source_property_ignored_warning"
  ),
  source_component_id: z49.string(),
  property_name: z49.string(),
  subcircuit_id: z49.string().optional(),
  error_type: z49.literal("source_property_ignored_warning").default("source_property_ignored_warning"),
  message: z49.string()
}).describe("The source property was ignored");
expectTypesMatch(true);

// src/source/source_pin_missing_trace_warning.ts
import { z as z50 } from "zod";
var source_pin_missing_trace_warning = z50.object({
  type: z50.literal("source_pin_missing_trace_warning"),
  source_pin_missing_trace_warning_id: getZodPrefixedIdWithDefault(
    "source_pin_missing_trace_warning"
  ),
  warning_type: z50.literal("source_pin_missing_trace_warning").default("source_pin_missing_trace_warning"),
  message: z50.string(),
  source_component_id: z50.string(),
  source_port_id: z50.string(),
  subcircuit_id: z50.string().optional()
}).describe(
  "Warning emitted when a source component pin is missing a trace connection"
);
expectTypesMatch(true);

// src/source/source_missing_manufacturer_part_number_warning.ts
import { z as z51 } from "zod";
var source_missing_manufacturer_part_number_warning = z51.object({
  type: z51.literal("source_missing_manufacturer_part_number_warning"),
  source_missing_manufacturer_part_number_warning_id: getZodPrefixedIdWithDefault(
    "source_missing_manufacturer_part_number_warning"
  ),
  warning_type: z51.literal("source_missing_manufacturer_part_number_warning").default("source_missing_manufacturer_part_number_warning"),
  message: z51.string(),
  source_component_id: z51.string(),
  standard: z51.string().optional(),
  subcircuit_id: z51.string().optional()
}).describe(
  "Warning emitted when a source component is missing its manufacturer part number"
);
expectTypesMatch(true);

// src/source/source_refdes_convention_warning.ts
import { z as z52 } from "zod";
var source_refdes_convention_warning = z52.object({
  type: z52.literal("source_refdes_convention_warning"),
  source_refdes_convention_warning_id: getZodPrefixedIdWithDefault(
    "source_refdes_convention_warning"
  ),
  warning_type: z52.literal("source_refdes_convention_warning").default("source_refdes_convention_warning"),
  message: z52.string(),
  source_component_id: z52.string(),
  refdes: z52.string(),
  source_component_ftype: z52.string(),
  expected_prefixes: z52.array(z52.string()),
  actual_prefix: z52.string().optional(),
  subcircuit_id: z52.string().optional()
}).describe(
  "Warning emitted when a source component reference designator does not match the component type convention"
);
expectTypesMatch(true);

// src/source/source_component_availability_warning.ts
import { z as z53 } from "zod";
var source_component_availability_warning = z53.object({
  type: z53.literal("source_component_availability_warning"),
  source_component_availability_warning_id: getZodPrefixedIdWithDefault(
    "source_component_availability_warning"
  ),
  warning_type: z53.literal("source_component_availability_warning").default("source_component_availability_warning"),
  message: z53.string(),
  source_component_id: z53.string(),
  subcircuit_id: z53.string().optional(),
  supplier_name,
  supplier_part_numbers: z53.array(z53.string()).nonempty()
}).describe(
  "Warning emitted when no supplier alternative can be confirmed in stock. Availability may be unknown or change over time."
);
expectTypesMatch(true);

// src/source/source_simple_voltage_probe.ts
import { z as z54 } from "zod";
var source_simple_voltage_probe = source_component_base.extend({
  ftype: z54.literal("simple_voltage_probe")
});
expectTypesMatch(
  true
);

// src/source/source_interconnect.ts
import { z as z55 } from "zod";
var source_interconnect = source_component_base.extend({
  ftype: z55.literal("interconnect")
});
expectTypesMatch(true);

// src/source/source_i2c_misconfigured_error.ts
import { z as z56 } from "zod";
var source_i2c_misconfigured_error = base_circuit_json_error.extend({
  type: z56.literal("source_i2c_misconfigured_error"),
  source_i2c_misconfigured_error_id: getZodPrefixedIdWithDefault(
    "source_i2c_misconfigured_error"
  ),
  error_type: z56.literal("source_i2c_misconfigured_error").default("source_i2c_misconfigured_error"),
  source_port_ids: z56.array(z56.string())
}).describe(
  "Error emitted when incompatible I2C pins (e.g. SDA and SCL) are connected to the same net"
);
expectTypesMatch(true);

// src/source/source_component_misconfigured_error.ts
import { z as z57 } from "zod";
var source_component_misconfigured_error = base_circuit_json_error.extend({
  type: z57.literal("source_component_misconfigured_error"),
  source_component_misconfigured_error_id: getZodPrefixedIdWithDefault(
    "source_component_misconfigured_error"
  ),
  error_type: z57.literal("source_component_misconfigured_error").default("source_component_misconfigured_error"),
  source_component_ids: z57.array(z57.string()),
  source_port_ids: z57.array(z57.string()).optional()
}).describe(
  "Error emitted when one or more source components have an invalid or conflicting configuration"
);
expectTypesMatch(true);

// src/source/source_simple_voltage_source.ts
import { z as z58 } from "zod";
var source_simple_voltage_source = source_component_base.extend({
  ftype: z58.literal("simple_voltage_source"),
  voltage,
  frequency: frequency.optional(),
  peak_to_peak_voltage: voltage.optional(),
  wave_shape: z58.enum(["sinewave", "square", "triangle", "sawtooth"]).optional(),
  phase: rotation.optional(),
  duty_cycle: z58.number().optional().describe("Duty cycle as a fraction (0 to 1)"),
  pulse_delay: ms.optional(),
  rise_time: ms.optional(),
  fall_time: ms.optional(),
  pulse_width: ms.optional(),
  period: ms.optional()
});
expectTypesMatch(
  true
);

// src/source/source_datasheet.ts
import { z as z59 } from "zod";
var source_datasheet = z59.object({
  type: z59.literal("source_datasheet"),
  source_datasheet_id: z59.string(),
  manufacturer_part_number: z59.string(),
  datasheet_pdf_urls: z59.array(z59.string().url()),
  description: z59.string().optional()
});
expectTypesMatch(true);

// src/source/any_source_component.ts
var any_source_component = z60.union([
  source_datasheet,
  source_simple_resistor,
  source_simple_capacitor,
  source_simple_diode,
  source_simple_fiducial,
  source_simple_led,
  source_simple_ground,
  source_simple_chip,
  source_printed_part,
  source_subassembly,
  source_motor,
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
  source_component_availability_warning,
  source_i2c_misconfigured_error,
  source_component_misconfigured_error
]);
expectTypesMatch(true);

// src/source/source_port.ts
import { z as z61 } from "zod";
var source_port = z61.object({
  type: z61.literal("source_port"),
  pin_number: z61.number().optional(),
  port_hints: z61.array(z61.string()).optional(),
  name: z61.string(),
  source_port_id: z61.string(),
  source_component_id: z61.string().optional(),
  source_group_id: z61.string().optional(),
  most_frequently_referenced_by_name: z61.string().optional(),
  subcircuit_id: z61.string().optional(),
  subcircuit_connectivity_map_key: z61.string().optional()
}).merge(source_pin_attributes);
expectTypesMatch(true);

// src/source/source_component_internal_connection.ts
import { z as z62 } from "zod";
var source_component_internal_connection = z62.object({
  type: z62.literal("source_component_internal_connection"),
  source_component_internal_connection_id: z62.string(),
  source_component_id: z62.string(),
  source_port_ids: z62.array(z62.string()),
  subcircuit_id: z62.string().optional()
});
expectTypesMatch(true);

// src/source/source_trace.ts
import { z as z63 } from "zod";
var source_trace = z63.object({
  type: z63.literal("source_trace"),
  source_trace_id: z63.string(),
  connected_source_port_ids: z63.array(z63.string()),
  connected_source_net_ids: z63.array(z63.string()),
  subcircuit_id: z63.string().optional(),
  subcircuit_connectivity_map_key: z63.string().optional(),
  max_length: z63.number().optional(),
  max_via_count: z63.number().int().nonnegative().optional(),
  name: z63.string().optional(),
  min_trace_thickness: z63.number().optional(),
  display_name: z63.string().optional()
});
expectTypesMatch(true);

// src/source/source_group.ts
import { z as z64 } from "zod";
var source_group = z64.object({
  type: z64.literal("source_group"),
  source_group_id: z64.string(),
  subcircuit_id: z64.string().optional(),
  parent_subcircuit_id: z64.string().optional(),
  parent_source_group_id: z64.string().optional(),
  is_subcircuit: z64.boolean().optional(),
  show_as_schematic_box: z64.boolean().optional(),
  name: z64.string().optional(),
  was_automatically_named: z64.boolean().optional()
});
expectTypesMatch(true);

// src/source/source_net.ts
import { z as z65 } from "zod";
var source_net = z65.object({
  type: z65.literal("source_net"),
  source_net_id: z65.string(),
  name: z65.string(),
  member_source_group_ids: z65.array(z65.string()),
  is_power: z65.boolean().optional(),
  is_ground: z65.boolean().optional(),
  is_digital_signal: z65.boolean().optional(),
  is_analog_signal: z65.boolean().optional(),
  is_positive_voltage_source: z65.boolean().optional(),
  trace_width: z65.number().optional(),
  subcircuit_id: z65.string().optional(),
  subcircuit_connectivity_map_key: z65.string().optional()
});
expectTypesMatch(true);

// src/source/source_board.ts
import { z as z66 } from "zod";
var source_board = z66.object({
  type: z66.literal("source_board"),
  source_board_id: z66.string(),
  source_group_id: z66.string(),
  title: z66.string().optional()
}).describe("Defines a board in the source domain");
expectTypesMatch(true);

// src/source/source_ambiguous_port_reference.ts
import { z as z67 } from "zod";
var source_ambiguous_port_reference = base_circuit_json_error.extend({
  type: z67.literal("source_ambiguous_port_reference"),
  source_ambiguous_port_reference_id: getZodPrefixedIdWithDefault(
    "source_ambiguous_port_reference"
  ),
  error_type: z67.literal("source_ambiguous_port_reference").default("source_ambiguous_port_reference"),
  source_port_id: z67.string().optional(),
  source_component_id: z67.string().optional()
}).describe(
  "Error emitted when a port hint matches multiple non-overlapping pads, making the port reference ambiguous"
);
expectTypesMatch(true);

// src/source/source_pcb_ground_plane.ts
import { z as z68 } from "zod";
var source_pcb_ground_plane = z68.object({
  type: z68.literal("source_pcb_ground_plane"),
  source_pcb_ground_plane_id: z68.string(),
  source_group_id: z68.string(),
  source_net_id: z68.string(),
  subcircuit_id: z68.string().optional()
}).describe("Defines a ground plane in the source domain");
expectTypesMatch(true);

// src/source/source_manually_placed_via.ts
import { z as z70 } from "zod";

// src/pcb/properties/layer_ref.ts
import { z as z69 } from "zod";
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
var layer_string = z69.enum(all_layers);
var layer_ref = layer_string.or(
  z69.object({
    name: layer_string
  })
).transform((layer) => {
  if (typeof layer === "string") {
    return layer;
  }
  return layer.name;
});
expectTypesMatch(true);
var visible_layer = z69.enum(["top", "bottom"]);

// src/source/source_manually_placed_via.ts
var source_manually_placed_via = z70.object({
  type: z70.literal("source_manually_placed_via"),
  source_manually_placed_via_id: z70.string(),
  source_group_id: z70.string(),
  source_net_id: z70.string().min(1).optional(),
  subcircuit_id: z70.string().optional(),
  source_trace_id: z70.string().optional()
}).describe("Defines a via that is manually placed in the source domain");
expectTypesMatch(true);

// src/source/source_unnamed_trace_warning.ts
import { z as z71 } from "zod";
var source_unnamed_trace_warning = z71.object({
  type: z71.literal("source_unnamed_trace_warning"),
  source_unnamed_trace_warning_id: getZodPrefixedIdWithDefault(
    "source_unnamed_trace_warning"
  ),
  warning_type: z71.literal("source_unnamed_trace_warning").default("source_unnamed_trace_warning"),
  message: z71.string(),
  source_trace_id: z71.string(),
  subcircuit_id: z71.string().optional()
}).describe("Warning emitted when a source trace is missing a name");
expectTypesMatch(
  true
);

// src/source/source_no_power_pin_defined_warning.ts
import { z as z72 } from "zod";
var source_no_power_pin_defined_warning = z72.object({
  type: z72.literal("source_no_power_pin_defined_warning"),
  source_no_power_pin_defined_warning_id: getZodPrefixedIdWithDefault(
    "source_no_power_pin_defined_warning"
  ),
  warning_type: z72.literal("source_no_power_pin_defined_warning").default("source_no_power_pin_defined_warning"),
  message: z72.string(),
  source_component_id: z72.string(),
  source_port_ids: z72.array(z72.string()),
  subcircuit_id: z72.string().optional()
}).describe(
  "Warning emitted when a chip has no source ports with requires_power=true"
);
expectTypesMatch(true);

// src/source/source_no_ground_pin_defined_warning.ts
import { z as z73 } from "zod";
var source_no_ground_pin_defined_warning = z73.object({
  type: z73.literal("source_no_ground_pin_defined_warning"),
  source_no_ground_pin_defined_warning_id: getZodPrefixedIdWithDefault(
    "source_no_ground_pin_defined_warning"
  ),
  warning_type: z73.literal("source_no_ground_pin_defined_warning").default("source_no_ground_pin_defined_warning"),
  message: z73.string(),
  source_component_id: z73.string(),
  source_port_ids: z73.array(z73.string()),
  subcircuit_id: z73.string().optional()
}).describe(
  "Warning emitted when a chip has no source ports marked as ground pins"
);
expectTypesMatch(true);

// src/source/source_component_pins_underspecified_warning.ts
import { z as z74 } from "zod";
var source_component_pins_underspecified_warning = z74.object({
  type: z74.literal("source_component_pins_underspecified_warning"),
  source_component_pins_underspecified_warning_id: getZodPrefixedIdWithDefault(
    "source_component_pins_underspecified_warning"
  ),
  warning_type: z74.literal("source_component_pins_underspecified_warning").default("source_component_pins_underspecified_warning"),
  message: z74.string(),
  source_component_id: z74.string(),
  source_port_ids: z74.array(z74.string()),
  subcircuit_id: z74.string().optional()
}).describe(
  "Warning emitted when all ports on a source component are underspecified"
);
expectTypesMatch(true);

// src/source/source_pin_must_be_connected_error.ts
import { z as z75 } from "zod";
var source_pin_must_be_connected_error = base_circuit_json_error.extend({
  type: z75.literal("source_pin_must_be_connected_error"),
  source_pin_must_be_connected_error_id: getZodPrefixedIdWithDefault(
    "source_pin_must_be_connected_error"
  ),
  error_type: z75.literal("source_pin_must_be_connected_error").default("source_pin_must_be_connected_error"),
  source_component_id: z75.string(),
  source_port_id: z75.string(),
  subcircuit_id: z75.string().optional()
}).describe(
  "Error emitted when a pin with mustBeConnected attribute is not connected to any trace"
);
expectTypesMatch(true);

// src/source/unknown_error_finding_part.ts
import { z as z76 } from "zod";
var unknown_error_finding_part = base_circuit_json_error.extend({
  type: z76.literal("unknown_error_finding_part"),
  unknown_error_finding_part_id: getZodPrefixedIdWithDefault(
    "unknown_error_finding_part"
  ),
  error_type: z76.literal("unknown_error_finding_part").default("unknown_error_finding_part"),
  source_component_id: z76.string().optional(),
  subcircuit_id: z76.string().optional()
}).describe(
  "Error emitted when an unexpected error occurs while finding a part"
);
expectTypesMatch(true);

// src/source/source_part_not_found_warning.ts
import { z as z77 } from "zod";
var source_part_not_found_warning = z77.object({
  type: z77.literal("source_part_not_found_warning"),
  source_part_not_found_warning_id: getZodPrefixedIdWithDefault(
    "source_part_not_found_warning"
  ),
  warning_type: z77.literal("source_part_not_found_warning").default("source_part_not_found_warning"),
  message: z77.string(),
  source_component_id: z77.string().optional(),
  subcircuit_id: z77.string().optional(),
  supplier_name: supplier_name.optional(),
  manufacturer_part_number: z77.string().optional(),
  supplier_part_number: z77.string().optional(),
  part_name: z77.string().optional()
}).describe("Warning emitted when a requested part can not be found");
expectTypesMatch(
  true
);

// src/source/source_confusing_net_name_warning.ts
import { z as z78 } from "zod";
var source_confusing_net_name_warning = z78.object({
  type: z78.literal("source_confusing_net_name_warning"),
  source_confusing_net_name_warning_id: getZodPrefixedIdWithDefault(
    "source_confusing_net_name_warning"
  ),
  warning_type: z78.literal("source_confusing_net_name_warning").default("source_confusing_net_name_warning"),
  message: z78.string(),
  source_net_ids: z78.array(z78.string()).min(2),
  net_name: z78.string(),
  subcircuit_id: z78.string().optional()
}).describe(
  "Warning emitted when electrically disconnected source nets share a name"
);
expectTypesMatch(true);

// src/source/source_bus.ts
import { z as z79 } from "zod";
var route_length = z79.union([
  z79.number().nonnegative().finite(),
  z79.object({
    reference: z79.literal("longest_manhattan"),
    source_trace_ids: z79.array(z79.string()).min(1).optional(),
    offset: z79.number().finite().optional()
  })
]);
var trace_spacing = z79.union([
  z79.number().positive().finite(),
  z79.object({ width_multiplier: z79.number().positive().finite() })
]);
var source_bus = z79.object({
  type: z79.literal("source_bus"),
  source_bus_id: z79.string(),
  name: z79.string().optional(),
  source_trace_ids: z79.array(z79.string()).min(1),
  max_length_skew: z79.number().nonnegative().finite().optional(),
  target_impedance: z79.number().positive().finite().optional(),
  target_differential_impedance: z79.number().positive().finite().optional(),
  differential_pair: z79.object({
    positive_source_trace_id: z79.string(),
    negative_source_trace_id: z79.string(),
    trace_gap: z79.number().positive().finite().optional(),
    max_uncoupled_length: z79.number().nonnegative().finite().optional()
  }).optional(),
  length_match_source_trace_ids: z79.array(z79.string()).min(1).optional(),
  min_length: route_length.optional(),
  max_length: route_length.optional(),
  target_length: route_length.optional(),
  length_tolerance: z79.number().nonnegative().finite().optional(),
  pcb_trace_spacing: trace_spacing.optional(),
  pcb_spacing_to_other_signals: trace_spacing.optional(),
  target_impedance_min: z79.number().positive().finite().optional(),
  target_impedance_max: z79.number().positive().finite().optional(),
  target_differential_impedance_min: z79.number().positive().finite().optional(),
  target_differential_impedance_max: z79.number().positive().finite().optional(),
  subcircuit_id: z79.string().optional()
});
expectTypesMatch(true);

// src/source/source_runtime_error.ts
import { z as z80 } from "zod";
var source_runtime_error = base_circuit_json_error.pick({ message: true, error_type: true }).extend({
  type: z80.literal("source_runtime_error"),
  source_runtime_error_id: getZodPrefixedIdWithDefault(
    "source_runtime_error"
  ),
  error_type: z80.literal("source_runtime_error").default("source_runtime_error"),
  phase_name: z80.string().optional()
}).describe(
  "An unexpected runtime failure while generating or validating a circuit"
);
expectTypesMatch(true);

// src/schematic/schematic_box.ts
import { z as z81 } from "zod";
var schematic_box = z81.object({
  type: z81.literal("schematic_box"),
  schematic_sheet_id: z81.string().optional(),
  schematic_component_id: z81.string().optional(),
  schematic_symbol_id: z81.string().optional(),
  width: distance,
  height: distance,
  is_dashed: z81.boolean().default(false),
  x: distance,
  y: distance,
  subcircuit_id: z81.string().optional()
}).describe("Draws a box on the schematic");
expectTypesMatch(true);

// src/schematic/schematic_path.ts
import { z as z82 } from "zod";
var schematic_path = z82.object({
  type: z82.literal("schematic_path"),
  schematic_path_id: getZodPrefixedIdWithDefault("schematic_path"),
  schematic_sheet_id: z82.string().optional(),
  schematic_component_id: z82.string().optional(),
  schematic_symbol_id: z82.string().optional(),
  fill_color: z82.string().optional(),
  is_filled: z82.boolean().optional(),
  is_dashed: z82.boolean().default(false),
  stroke_width: distance.nullable().optional(),
  stroke_color: z82.string().optional(),
  dash_length: distance.optional(),
  dash_gap: distance.optional(),
  points: z82.array(point),
  subcircuit_id: z82.string().optional()
});
expectTypesMatch(true);

// src/schematic/schematic_component.ts
import { z as z83 } from "zod";
var schematic_pin_styles = z83.record(
  z83.object({
    left_margin: length.optional(),
    right_margin: length.optional(),
    top_margin: length.optional(),
    bottom_margin: length.optional()
  })
);
var schematic_component_port_arrangement_by_size = z83.object({
  left_size: z83.number(),
  right_size: z83.number(),
  top_size: z83.number().optional(),
  bottom_size: z83.number().optional()
});
expectTypesMatch(true);
var schematic_component_port_arrangement_by_sides = z83.object({
  left_side: z83.object({
    pins: z83.array(z83.number()),
    // @ts-ignore
    direction: z83.enum(["top-to-bottom", "bottom-to-top"]).optional()
  }).optional(),
  right_side: z83.object({
    pins: z83.array(z83.number()),
    // @ts-ignore
    direction: z83.enum(["top-to-bottom", "bottom-to-top"]).optional()
  }).optional(),
  top_side: z83.object({
    pins: z83.array(z83.number()),
    // @ts-ignore
    direction: z83.enum(["left-to-right", "right-to-left"]).optional()
  }).optional(),
  bottom_side: z83.object({
    pins: z83.array(z83.number()),
    // @ts-ignore
    direction: z83.enum(["left-to-right", "right-to-left"]).optional()
  }).optional()
});
expectTypesMatch(true);
var port_arrangement = z83.union([
  schematic_component_port_arrangement_by_size,
  schematic_component_port_arrangement_by_sides
]);
var schematic_component = z83.object({
  type: z83.literal("schematic_component"),
  size,
  center: point,
  source_component_id: z83.string().optional(),
  schematic_component_id: z83.string(),
  schematic_sheet_id: z83.string().optional(),
  schematic_symbol_id: z83.string().optional(),
  pin_spacing: length.optional(),
  pin_styles: schematic_pin_styles.optional(),
  box_width: length.optional(),
  symbol_name: z83.string().optional(),
  port_arrangement: port_arrangement.optional(),
  port_labels: z83.record(z83.string()).optional(),
  symbol_display_value: z83.string().optional(),
  subcircuit_id: z83.string().optional(),
  schematic_group_id: z83.string().optional(),
  is_schematic_group: z83.boolean().optional(),
  source_group_id: z83.string().optional(),
  is_box_with_pins: z83.boolean().optional().default(true)
});
expectTypesMatch(true);

// src/schematic/schematic_symbol.ts
import { z as z84 } from "zod";
var schematicSymbolMetadata = z84.object({
  kicad_symbol: kicadSymbolMetadata.optional()
}).catchall(z84.unknown());
var schematic_symbol = z84.object({
  type: z84.literal("schematic_symbol"),
  schematic_symbol_id: z84.string(),
  name: z84.string().optional(),
  metadata: schematicSymbolMetadata.optional()
}).describe(
  "Defines a named schematic symbol that can be referenced by components."
);
expectTypesMatch(true);

// src/schematic/schematic_line.ts
import { z as z85 } from "zod";
var schematic_line = z85.object({
  type: z85.literal("schematic_line"),
  schematic_line_id: getZodPrefixedIdWithDefault("schematic_line"),
  schematic_sheet_id: z85.string().optional(),
  schematic_component_id: z85.string().optional(),
  schematic_symbol_id: z85.string().optional(),
  x1: distance,
  y1: distance,
  x2: distance,
  y2: distance,
  stroke_width: distance.nullable().optional(),
  color: z85.string().default("#000000"),
  is_dashed: z85.boolean().default(false),
  dash_length: distance.optional(),
  dash_gap: distance.optional(),
  subcircuit_id: z85.string().optional()
}).describe("Draws a styled line on the schematic");
expectTypesMatch(true);

// src/schematic/schematic_rect.ts
import { z as z86 } from "zod";
var schematic_rect = z86.object({
  type: z86.literal("schematic_rect"),
  schematic_rect_id: getZodPrefixedIdWithDefault("schematic_rect"),
  schematic_sheet_id: z86.string().optional(),
  schematic_component_id: z86.string().optional(),
  schematic_symbol_id: z86.string().optional(),
  center: point,
  width: distance,
  height: distance,
  rotation: rotation.default(0),
  stroke_width: distance.nullable().optional(),
  color: z86.string().default("#000000"),
  is_filled: z86.boolean().default(false),
  fill_color: z86.string().optional(),
  is_dashed: z86.boolean().default(false),
  subcircuit_id: z86.string().optional()
}).describe("Draws a styled rectangle on the schematic");
expectTypesMatch(true);

// src/schematic/schematic_circle.ts
import { z as z87 } from "zod";
var schematic_circle = z87.object({
  type: z87.literal("schematic_circle"),
  schematic_circle_id: getZodPrefixedIdWithDefault("schematic_circle"),
  schematic_sheet_id: z87.string().optional(),
  schematic_component_id: z87.string().optional(),
  schematic_symbol_id: z87.string().optional(),
  center: point,
  radius: distance,
  stroke_width: distance.nullable().optional(),
  color: z87.string().default("#000000"),
  is_filled: z87.boolean().default(false),
  fill_color: z87.string().optional(),
  is_dashed: z87.boolean().default(false),
  subcircuit_id: z87.string().optional()
}).describe("Draws a styled circle on the schematic");
expectTypesMatch(true);

// src/schematic/schematic_arc.ts
import { z as z88 } from "zod";
var schematic_arc = z88.object({
  type: z88.literal("schematic_arc"),
  schematic_arc_id: getZodPrefixedIdWithDefault("schematic_arc"),
  schematic_sheet_id: z88.string().optional(),
  schematic_component_id: z88.string().optional(),
  schematic_symbol_id: z88.string().optional(),
  center: point,
  radius: distance,
  start_angle_degrees: rotation,
  end_angle_degrees: rotation,
  direction: z88.enum(["clockwise", "counterclockwise"]).default("counterclockwise"),
  stroke_width: distance.nullable().optional(),
  color: z88.string().default("#000000"),
  is_dashed: z88.boolean().default(false),
  subcircuit_id: z88.string().optional()
}).describe("Draws a styled arc on the schematic");
expectTypesMatch(true);

// src/schematic/schematic_trace.ts
import { z as z89 } from "zod";
var schematic_trace = z89.object({
  type: z89.literal("schematic_trace"),
  schematic_trace_id: z89.string(),
  schematic_sheet_id: z89.string().optional(),
  source_trace_id: z89.string().optional(),
  junctions: z89.array(
    z89.object({
      x: z89.number(),
      y: z89.number()
    })
  ),
  edges: z89.array(
    z89.object({
      from: z89.object({
        x: z89.number(),
        y: z89.number()
      }),
      to: z89.object({
        x: z89.number(),
        y: z89.number()
      }),
      is_crossing: z89.boolean().optional(),
      from_schematic_port_id: z89.string().optional(),
      to_schematic_port_id: z89.string().optional()
    })
  ),
  subcircuit_id: z89.string().optional(),
  // TODO: make required in a future release
  subcircuit_connectivity_map_key: z89.string().optional()
});
expectTypesMatch(true);

// src/schematic/schematic_text.ts
import { z as z92 } from "zod";

// src/common/FivePointAnchor.ts
import { z as z90 } from "zod";
var fivePointAnchor = z90.enum([
  "center",
  "left",
  "right",
  "top",
  "bottom"
]);
expectTypesMatch(true);

// src/schematic/schematic_text_part.ts
import { z as z91 } from "zod";
var schematic_text_part = z91.object({
  text: z91.string(),
  is_overlined: z91.boolean().optional()
});

// src/schematic/schematic_text.ts
var schematic_text = z92.object({
  type: z92.literal("schematic_text"),
  schematic_sheet_id: z92.string().optional(),
  schematic_component_id: z92.string().optional(),
  schematic_symbol_id: z92.string().optional(),
  schematic_text_id: z92.string(),
  source_trace_id: z92.string().optional(),
  text: z92.string(),
  text_parts: z92.array(schematic_text_part).min(1).optional(),
  display_superscript: z92.string().optional(),
  font_size: z92.number().default(0.18),
  position: z92.object({
    x: distance,
    y: distance
  }),
  rotation: z92.number().default(0),
  anchor: z92.union([fivePointAnchor.describe("legacy"), ninePointAnchor]).default("center"),
  color: z92.string().default("#000000"),
  subcircuit_id: z92.string().optional()
});
expectTypesMatch(true);

// src/schematic/schematic_port.ts
import { z as z93 } from "zod";
var schematic_port = z93.object({
  type: z93.literal("schematic_port"),
  schematic_port_id: z93.string(),
  source_port_id: z93.string(),
  schematic_sheet_id: z93.string().optional(),
  schematic_component_id: z93.string().optional(),
  center: point,
  facing_direction: z93.enum(["up", "down", "left", "right"]).optional(),
  distance_from_component_edge: z93.number().optional(),
  side_of_component: z93.enum(["top", "bottom", "left", "right"]).optional(),
  true_ccw_index: z93.number().optional(),
  pin_number: z93.number().optional(),
  display_pin_label: z93.string().optional(),
  display_pin_label_text_parts: z93.array(schematic_text_part).min(1).optional(),
  display_pin_label_font_size: z93.number().positive().finite().optional(),
  subcircuit_id: z93.string().optional(),
  is_connected: z93.boolean().optional(),
  is_internal_circuit_port: z93.boolean().optional(),
  is_overlapping_internal_circuit_port: z93.boolean().optional(),
  has_input_arrow: z93.boolean().optional(),
  has_output_arrow: z93.boolean().optional(),
  is_drawn_with_inversion_circle: z93.boolean().optional()
}).describe("Defines a port on a schematic component");
expectTypesMatch(true);

// src/schematic/schematic_net_label.ts
import { z as z94 } from "zod";
var schematic_net_label = z94.object({
  type: z94.literal("schematic_net_label"),
  schematic_net_label_id: getZodPrefixedIdWithDefault("schematic_net_label"),
  schematic_sheet_id: z94.string().optional(),
  schematic_trace_id: z94.string().optional(),
  source_trace_id: z94.string().optional(),
  source_net_id: z94.string(),
  center: point,
  anchor_position: point.optional(),
  anchor_side: z94.enum(["top", "bottom", "left", "right"]),
  text: z94.string(),
  display_superscript: z94.string().optional(),
  symbol_name: z94.string().optional(),
  is_movable: z94.boolean().optional(),
  subcircuit_id: z94.string().optional()
});
expectTypesMatch(true);

// src/schematic/schematic_error.ts
import { z as z95 } from "zod";
var schematic_error = base_circuit_json_error.extend({
  type: z95.literal("schematic_error"),
  schematic_error_id: z95.string(),
  // eventually each error type should be broken out into a dir of files
  error_type: z95.literal("schematic_port_not_found").default("schematic_port_not_found"),
  subcircuit_id: z95.string().optional()
}).describe("Defines a schematic error on the schematic");
expectTypesMatch(true);

// src/schematic/schematic_layout_error.ts
import { z as z96 } from "zod";
var schematic_layout_error = base_circuit_json_error.extend({
  type: z96.literal("schematic_layout_error"),
  schematic_layout_error_id: getZodPrefixedIdWithDefault(
    "schematic_layout_error"
  ),
  error_type: z96.literal("schematic_layout_error").default("schematic_layout_error"),
  source_group_id: z96.string(),
  schematic_group_id: z96.string(),
  subcircuit_id: z96.string().optional()
}).describe("Error emitted when schematic layout fails for a group");
expectTypesMatch(true);

// src/schematic/schematic_debug_object.ts
import { z as z97 } from "zod";
var schematic_debug_object_base = z97.object({
  type: z97.literal("schematic_debug_object"),
  label: z97.string().optional(),
  subcircuit_id: z97.string().optional()
});
var schematic_debug_rect = schematic_debug_object_base.extend({
  shape: z97.literal("rect"),
  center: point,
  size
});
var schematic_debug_line = schematic_debug_object_base.extend({
  shape: z97.literal("line"),
  start: point,
  end: point
});
var schematic_debug_point = schematic_debug_object_base.extend({
  shape: z97.literal("point"),
  center: point
});
var schematic_debug_object = z97.discriminatedUnion("shape", [
  schematic_debug_rect,
  schematic_debug_line,
  schematic_debug_point
]);
expectTypesMatch(true);

// src/schematic/schematic_voltage_probe.ts
import { z as z98 } from "zod";
var schematic_voltage_probe = z98.object({
  type: z98.literal("schematic_voltage_probe"),
  schematic_voltage_probe_id: z98.string(),
  schematic_sheet_id: z98.string().optional(),
  source_component_id: z98.string().optional(),
  name: z98.string().optional(),
  position: point,
  schematic_trace_id: z98.string(),
  voltage: voltage.optional(),
  subcircuit_id: z98.string().optional(),
  color: z98.string().optional(),
  label_alignment: ninePointAnchor.optional()
}).describe("Defines a voltage probe measurement point on a schematic trace");
expectTypesMatch(true);

// src/schematic/schematic_manual_edit_conflict_warning.ts
import { z as z99 } from "zod";
var schematic_manual_edit_conflict_warning = z99.object({
  type: z99.literal("schematic_manual_edit_conflict_warning"),
  schematic_manual_edit_conflict_warning_id: getZodPrefixedIdWithDefault(
    "schematic_manual_edit_conflict_warning"
  ),
  warning_type: z99.literal("schematic_manual_edit_conflict_warning").default("schematic_manual_edit_conflict_warning"),
  message: z99.string(),
  schematic_component_id: z99.string(),
  schematic_group_id: z99.string().optional(),
  subcircuit_id: z99.string().optional(),
  source_component_id: z99.string()
}).describe(
  "Warning emitted when a component has both manual placement and explicit schX/schY coordinates"
);
expectTypesMatch(true);

// src/schematic/schematic_component_overlap_warning.ts
import { z as z100 } from "zod";
var schematic_component_overlap_warning = z100.object({
  type: z100.literal("schematic_component_overlap_warning"),
  schematic_component_overlap_warning_id: getZodPrefixedIdWithDefault(
    "schematic_component_overlap_warning"
  ),
  warning_type: z100.literal("schematic_component_overlap_warning").default("schematic_component_overlap_warning"),
  message: z100.string(),
  schematic_component_ids: z100.tuple([z100.string(), z100.string()]),
  schematic_sheet_id: z100.string().optional()
}).describe(
  "Warning emitted when the rendered bounds of two schematic components overlap"
);
expectTypesMatch(true);

// src/schematic/schematic_component_styling_warning.ts
import { z as z101 } from "zod";
var schematic_component_styling_warning = z101.object({
  type: z101.literal("schematic_component_styling_warning"),
  schematic_component_styling_warning_id: getZodPrefixedIdWithDefault(
    "schematic_component_styling_warning"
  ),
  warning_type: z101.literal("schematic_component_styling_warning").default("schematic_component_styling_warning"),
  message: z101.string(),
  schematic_component_id: z101.string(),
  styling_issue_type: z101.string(),
  schematic_port_ids: z101.array(z101.string()).optional(),
  source_component_id: z101.string().optional(),
  schematic_sheet_id: z101.string().optional(),
  subcircuit_id: z101.string().optional()
}).describe(
  "Warning emitted when a schematic component has a visual styling issue"
);
expectTypesMatch(true);

// src/schematic/schematic_sheet_styling_warning.ts
import { z as z102 } from "zod";
var schematic_sheet_styling_warning = z102.object({
  type: z102.literal("schematic_sheet_styling_warning"),
  schematic_sheet_styling_warning_id: getZodPrefixedIdWithDefault(
    "schematic_sheet_styling_warning"
  ),
  warning_type: z102.literal("schematic_sheet_styling_warning").default("schematic_sheet_styling_warning"),
  message: z102.string(),
  schematic_sheet_id: z102.string(),
  styling_issue_type: z102.literal("non_default_sheet_size"),
  subcircuit_id: z102.string().optional()
}).describe(
  "Style warning emitted when a schematic sheet uses a non-default size"
);
expectTypesMatch(true);

// src/schematic/schematic_element_outside_sheet_warning.ts
import { z as z103 } from "zod";
var schematic_element_outside_sheet_warning = z103.object({
  type: z103.literal("schematic_element_outside_sheet_warning"),
  schematic_element_outside_sheet_warning_id: getZodPrefixedIdWithDefault(
    "schematic_element_outside_sheet_warning"
  ),
  warning_type: z103.literal("schematic_element_outside_sheet_warning").default("schematic_element_outside_sheet_warning"),
  message: z103.string(),
  schematic_sheet_id: z103.string(),
  schematic_element_type: z103.enum([
    "schematic_component",
    "schematic_net_label",
    "schematic_trace"
  ]),
  schematic_element_id: z103.string()
}).describe(
  "Warning emitted when a schematic component, net label, or trace extends outside its schematic sheet"
);
expectTypesMatch(true);

// src/schematic/schematic_graphic.ts
import { z as z104 } from "zod";
var positiveFiniteDistance = distance.pipe(z104.number().positive().finite());
var schematic_graphic = z104.object({
  type: z104.literal("schematic_graphic"),
  schematic_graphic_id: getZodPrefixedIdWithDefault("schematic_graphic"),
  schematic_sheet_id: z104.string().optional(),
  asset: asset.optional(),
  svg_content: z104.string().optional(),
  width: positiveFiniteDistance.optional(),
  height: positiveFiniteDistance.optional()
}).describe(
  "References a graphic asset or inline SVG content with optional centered layout bounds on a schematic sheet"
).superRefine(({ asset: asset2, svg_content }, ctx) => {
  if (asset2 === void 0 && svg_content === void 0) {
    ctx.addIssue({
      code: z104.ZodIssueCode.custom,
      message: "At least one of asset or svg_content is required"
    });
  }
});
expectTypesMatch(true);

// src/schematic/schematic_group.ts
import { z as z105 } from "zod";
var schematic_group = z105.object({
  type: z105.literal("schematic_group"),
  schematic_group_id: getZodPrefixedIdWithDefault("schematic_group"),
  schematic_sheet_id: z105.string().optional(),
  source_group_id: z105.string(),
  is_subcircuit: z105.boolean().optional(),
  subcircuit_id: z105.string().optional(),
  width: length,
  height: length,
  center: point,
  schematic_component_ids: z105.array(z105.string()),
  show_as_schematic_box: z105.boolean().optional(),
  name: z105.string().optional(),
  description: z105.string().optional()
}).describe("Defines a group of components on the schematic");
expectTypesMatch(true);

// src/schematic/schematic_table.ts
import { z as z106 } from "zod";
var schematic_table = z106.object({
  type: z106.literal("schematic_table"),
  schematic_table_id: getZodPrefixedIdWithDefault("schematic_table"),
  schematic_sheet_id: z106.string().optional(),
  anchor_position: point,
  column_widths: z106.array(distance),
  row_heights: z106.array(distance),
  cell_padding: distance.optional(),
  border_width: distance.optional(),
  subcircuit_id: z106.string().optional(),
  schematic_component_id: z106.string().optional(),
  anchor: ninePointAnchor.optional()
}).describe("Defines a table on the schematic");
expectTypesMatch(true);

// src/schematic/schematic_table_cell.ts
import { z as z107 } from "zod";
var schematic_table_cell = z107.object({
  type: z107.literal("schematic_table_cell"),
  schematic_table_cell_id: getZodPrefixedIdWithDefault(
    "schematic_table_cell"
  ),
  schematic_sheet_id: z107.string().optional(),
  schematic_table_id: z107.string(),
  start_row_index: z107.number(),
  end_row_index: z107.number(),
  start_column_index: z107.number(),
  end_column_index: z107.number(),
  text: z107.string().optional(),
  center: point,
  width: distance,
  height: distance,
  horizontal_align: z107.enum(["left", "center", "right"]).optional(),
  vertical_align: z107.enum(["top", "middle", "bottom"]).optional(),
  font_size: distance.optional(),
  subcircuit_id: z107.string().optional()
}).describe("Defines a cell within a schematic_table");
expectTypesMatch(true);

// src/schematic/schematic_sheet.ts
import { z as z108 } from "zod";
var schematic_sheet_size = z108.enum(["a4", "ansi_b"]);
var schematic_sheet = z108.object({
  type: z108.literal("schematic_sheet"),
  schematic_sheet_id: getZodPrefixedIdWithDefault("schematic_sheet"),
  name: z108.string().optional(),
  sheet_index: z108.number().optional(),
  sheet_size: schematic_sheet_size.optional(),
  sheet_width: z108.number().positive().optional(),
  sheet_height: z108.number().positive().optional(),
  subcircuit_id: z108.string().optional(),
  outline_color: z108.string().optional()
}).describe(
  "Defines a schematic sheet or page that components can be placed on"
);
expectTypesMatch(true);

// src/schematic/schematic_missing_sheet_warning.ts
import { z as z109 } from "zod";
var schematic_missing_sheet_warning = z109.object({
  type: z109.literal("schematic_missing_sheet_warning"),
  schematic_missing_sheet_warning_id: getZodPrefixedIdWithDefault(
    "schematic_missing_sheet_warning"
  ),
  warning_type: z109.literal("schematic_missing_sheet_warning").default("schematic_missing_sheet_warning"),
  message: z109.string()
}).describe(
  "Circuit-wide warning emitted when a schematic has no schematic sheet. Display as a banner without attaching it to a component or drawing a target outline or leader line."
);
expectTypesMatch(true);

// src/pcb/properties/brep.ts
import { z as z110 } from "zod";
var point_with_bulge = z110.object({
  x: distance,
  y: distance,
  bulge: z110.number().optional()
});
expectTypesMatch(true);
var ring = z110.object({
  vertices: z110.array(point_with_bulge)
});
expectTypesMatch(true);
var brep_shape = z110.object({
  outer_ring: ring,
  inner_rings: z110.array(ring).default([])
});
expectTypesMatch(true);

// src/pcb/properties/insertion_direction.ts
import { z as z111 } from "zod";
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
var insertion_direction = z111.enum([
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
import { z as z112 } from "zod";
var pcb_pin1_location = z112.enum([
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
import { z as z113 } from "zod";
var pcb_route_hint = z113.object({
  x: distance,
  y: distance,
  via: z113.boolean().optional(),
  via_to_layer: layer_ref.optional()
});
var pcb_route_hints = z113.array(pcb_route_hint);
expectTypesMatch(true);
expectTypesMatch(true);

// src/pcb/properties/route_hint_point.ts
import { z as z114 } from "zod";
var route_hint_point = z114.object({
  x: distance,
  y: distance,
  via: z114.boolean().optional(),
  to_layer: layer_ref.optional(),
  trace_width: distance.optional()
});
expectTypesMatch(true);

// src/pcb/properties/manufacturing_drc_properties.ts
import { z as z115 } from "zod";
var manufacturing_drc_properties = z115.object({
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
import { z as z116 } from "zod";
var pcb_component = z116.object({
  type: z116.literal("pcb_component"),
  pcb_component_id: getZodPrefixedIdWithDefault("pcb_component"),
  source_component_id: z116.string(),
  center: point,
  footprint_origin: point.optional(),
  layer: layer_ref,
  rotation,
  display_offset_x: z116.string().optional().describe(
    "How to display the x offset for this part, usually corresponding with how the user specified it"
  ),
  display_offset_y: z116.string().optional().describe(
    "How to display the y offset for this part, usually corresponding with how the user specified it"
  ),
  width: length,
  height: length,
  do_not_place: z116.boolean().optional(),
  is_allowed_to_be_off_board: z116.boolean().optional(),
  subcircuit_id: z116.string().optional(),
  pcb_group_id: z116.string().optional(),
  position_mode: z116.enum([
    "packed",
    "relative_to_group_anchor",
    "relative_to_another_component",
    "none"
  ]).optional(),
  anchor_position: point.optional(),
  anchor_alignment: ninePointAnchor.optional(),
  positioned_relative_to_pcb_group_id: z116.string().optional(),
  positioned_relative_to_pcb_board_id: z116.string().optional(),
  cable_insertion_center: point.optional(),
  insertion_direction: insertion_direction.optional(),
  pin1_location: pcb_pin1_location.optional().describe(
    "Location of pin 1 on the unrotated, top-view component footprint"
  ),
  supplier_pin1_location_map: z116.record(supplier_name, pcb_pin1_location).optional().describe(
    "Pin 1 location for each supplier's unrotated, top-view footprint"
  ),
  metadata: z116.object({
    kicad_footprint: kicadFootprintMetadata.optional()
  }).optional(),
  obstructs_within_bounds: z116.boolean().default(true).describe(
    "Does this component take up all the space within its bounds on a layer. This is generally true except for when separated pin headers are being represented by a single component (in which case, chips can be placed between the pin headers) or for tall modules where chips fit underneath"
  )
}).describe("Defines a component on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_debug_object.ts
import { z as z117 } from "zod";
var pcb_debug_object_base = z117.object({
  type: z117.literal("pcb_debug_object"),
  pcb_debug_object_id: getZodPrefixedIdWithDefault("pcb_debug_object"),
  label: z117.string().optional(),
  subcircuit_id: z117.string().optional()
});
var pcb_debug_rect = pcb_debug_object_base.extend({
  shape: z117.literal("rect"),
  center: point,
  size
});
var pcb_debug_line = pcb_debug_object_base.extend({
  shape: z117.literal("line"),
  start: point,
  end: point
});
var pcb_debug_point = pcb_debug_object_base.extend({
  shape: z117.literal("point"),
  center: point
});
var pcb_debug_object = z117.discriminatedUnion("shape", [
  pcb_debug_rect,
  pcb_debug_line,
  pcb_debug_point
]);
expectTypesMatch(true);

// src/pcb/pcb_hole.ts
import { z as z118 } from "zod";
var pcb_hole_circle = z118.object({
  type: z118.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z118.string().optional(),
  subcircuit_id: z118.string().optional(),
  pcb_component_id: z118.string().optional(),
  hole_shape: z118.literal("circle"),
  hole_diameter: z118.number(),
  x: distance,
  y: distance,
  is_covered_with_solder_mask: z118.boolean().optional(),
  soldermask_margin: z118.number().optional()
});
var pcb_hole_circle_shape = pcb_hole_circle.describe(
  "Defines a circular hole on the PCB"
);
expectTypesMatch(true);
var pcb_hole_rect = z118.object({
  type: z118.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z118.string().optional(),
  subcircuit_id: z118.string().optional(),
  pcb_component_id: z118.string().optional(),
  hole_shape: z118.literal("rect"),
  hole_width: z118.number(),
  hole_height: z118.number(),
  x: distance,
  y: distance,
  is_covered_with_solder_mask: z118.boolean().optional(),
  soldermask_margin: z118.number().optional()
});
var pcb_hole_rect_shape = pcb_hole_rect.describe(
  "Defines a rectangular (square-capable) hole on the PCB. Use equal width/height for square."
);
expectTypesMatch(true);
var pcb_hole_circle_or_square = z118.object({
  type: z118.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z118.string().optional(),
  subcircuit_id: z118.string().optional(),
  pcb_component_id: z118.string().optional(),
  hole_shape: z118.enum(["circle", "square"]),
  hole_diameter: z118.number(),
  x: distance,
  y: distance,
  is_covered_with_solder_mask: z118.boolean().optional(),
  soldermask_margin: z118.number().optional()
});
var pcb_hole_circle_or_square_shape = pcb_hole_circle_or_square.describe(
  "Defines a circular or square hole on the PCB"
);
expectTypesMatch(true);
var pcb_hole_oval = z118.object({
  type: z118.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z118.string().optional(),
  subcircuit_id: z118.string().optional(),
  pcb_component_id: z118.string().optional(),
  hole_shape: z118.literal("oval"),
  hole_width: z118.number(),
  hole_height: z118.number(),
  x: distance,
  y: distance,
  is_covered_with_solder_mask: z118.boolean().optional(),
  soldermask_margin: z118.number().optional()
});
var pcb_hole_oval_shape = pcb_hole_oval.describe(
  "Defines an oval hole on the PCB"
);
expectTypesMatch(true);
var pcb_hole_pill = z118.object({
  type: z118.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z118.string().optional(),
  subcircuit_id: z118.string().optional(),
  pcb_component_id: z118.string().optional(),
  hole_shape: z118.literal("pill"),
  hole_width: z118.number(),
  hole_height: z118.number(),
  x: distance,
  y: distance,
  is_covered_with_solder_mask: z118.boolean().optional(),
  soldermask_margin: z118.number().optional()
});
var pcb_hole_pill_shape = pcb_hole_pill.describe(
  "Defines a pill-shaped hole on the PCB"
);
expectTypesMatch(true);
var pcb_hole_rotated_pill = z118.object({
  type: z118.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z118.string().optional(),
  subcircuit_id: z118.string().optional(),
  pcb_component_id: z118.string().optional(),
  hole_shape: z118.literal("rotated_pill"),
  hole_width: z118.number(),
  hole_height: z118.number(),
  x: distance,
  y: distance,
  ccw_rotation: rotation,
  is_covered_with_solder_mask: z118.boolean().optional(),
  soldermask_margin: z118.number().optional()
});
var pcb_hole_rotated_pill_shape = pcb_hole_rotated_pill.describe(
  "Defines a rotated pill-shaped hole on the PCB"
);
expectTypesMatch(true);
var pcb_hole = pcb_hole_circle_or_square.or(pcb_hole_oval).or(pcb_hole_pill).or(pcb_hole_rotated_pill).or(pcb_hole_circle).or(pcb_hole_rect);

// src/pcb/pcb_plated_hole.ts
import { z as z119 } from "zod";
var pcb_plated_hole_circle = z119.object({
  type: z119.literal("pcb_plated_hole"),
  shape: z119.literal("circle"),
  pcb_group_id: z119.string().optional(),
  subcircuit_id: z119.string().optional(),
  outer_diameter: z119.number(),
  hole_diameter: z119.number(),
  is_covered_with_solder_mask: z119.boolean().optional(),
  x: distance,
  y: distance,
  layers: z119.array(layer_ref),
  port_hints: z119.array(z119.string()).optional(),
  pcb_component_id: z119.string().optional(),
  pcb_port_id: z119.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z119.number().optional()
});
var pcb_plated_hole_oval = z119.object({
  type: z119.literal("pcb_plated_hole"),
  shape: z119.enum(["oval", "pill"]),
  pcb_group_id: z119.string().optional(),
  subcircuit_id: z119.string().optional(),
  outer_width: z119.number(),
  outer_height: z119.number(),
  hole_width: z119.number(),
  hole_height: z119.number(),
  is_covered_with_solder_mask: z119.boolean().optional(),
  x: distance,
  y: distance,
  ccw_rotation: rotation,
  layers: z119.array(layer_ref),
  port_hints: z119.array(z119.string()).optional(),
  pcb_component_id: z119.string().optional(),
  pcb_port_id: z119.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z119.number().optional()
});
var pcb_circular_hole_with_rect_pad = z119.object({
  type: z119.literal("pcb_plated_hole"),
  shape: z119.literal("circular_hole_with_rect_pad"),
  pcb_group_id: z119.string().optional(),
  subcircuit_id: z119.string().optional(),
  hole_shape: z119.literal("circle"),
  pad_shape: z119.literal("rect"),
  hole_diameter: z119.number(),
  rect_pad_width: z119.number(),
  rect_pad_height: z119.number(),
  rect_border_radius: z119.number().optional(),
  hole_offset_x: distance.default(0),
  hole_offset_y: distance.default(0),
  is_covered_with_solder_mask: z119.boolean().optional(),
  x: distance,
  y: distance,
  layers: z119.array(layer_ref),
  port_hints: z119.array(z119.string()).optional(),
  pcb_component_id: z119.string().optional(),
  pcb_port_id: z119.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z119.number().optional(),
  rect_ccw_rotation: rotation.optional()
});
var pcb_pill_hole_with_rect_pad = z119.object({
  type: z119.literal("pcb_plated_hole"),
  shape: z119.literal("pill_hole_with_rect_pad"),
  pcb_group_id: z119.string().optional(),
  subcircuit_id: z119.string().optional(),
  hole_shape: z119.literal("pill"),
  pad_shape: z119.literal("rect"),
  hole_width: z119.number(),
  hole_height: z119.number(),
  rect_pad_width: z119.number(),
  rect_pad_height: z119.number(),
  rect_border_radius: z119.number().optional(),
  hole_offset_x: distance.default(0),
  hole_offset_y: distance.default(0),
  is_covered_with_solder_mask: z119.boolean().optional(),
  x: distance,
  y: distance,
  layers: z119.array(layer_ref),
  port_hints: z119.array(z119.string()).optional(),
  pcb_component_id: z119.string().optional(),
  pcb_port_id: z119.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z119.number().optional()
});
var pcb_rotated_pill_hole_with_rect_pad = z119.object({
  type: z119.literal("pcb_plated_hole"),
  shape: z119.literal("rotated_pill_hole_with_rect_pad"),
  pcb_group_id: z119.string().optional(),
  subcircuit_id: z119.string().optional(),
  hole_shape: z119.literal("rotated_pill"),
  pad_shape: z119.literal("rect"),
  hole_width: z119.number(),
  hole_height: z119.number(),
  hole_ccw_rotation: rotation,
  rect_pad_width: z119.number(),
  rect_pad_height: z119.number(),
  rect_border_radius: z119.number().optional(),
  rect_ccw_rotation: rotation,
  hole_offset_x: distance.default(0),
  hole_offset_y: distance.default(0),
  is_covered_with_solder_mask: z119.boolean().optional(),
  x: distance,
  y: distance,
  layers: z119.array(layer_ref),
  port_hints: z119.array(z119.string()).optional(),
  pcb_component_id: z119.string().optional(),
  pcb_port_id: z119.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z119.number().optional()
});
var pcb_hole_with_polygon_pad = z119.object({
  type: z119.literal("pcb_plated_hole"),
  shape: z119.literal("hole_with_polygon_pad"),
  pcb_group_id: z119.string().optional(),
  subcircuit_id: z119.string().optional(),
  hole_shape: z119.enum(["circle", "oval", "pill", "rotated_pill"]),
  hole_diameter: z119.number().optional(),
  hole_width: z119.number().optional(),
  hole_height: z119.number().optional(),
  pad_outline: z119.array(
    z119.object({
      x: distance,
      y: distance
    })
  ).min(3),
  hole_offset_x: distance.default(0),
  hole_offset_y: distance.default(0),
  is_covered_with_solder_mask: z119.boolean().optional(),
  x: distance,
  y: distance,
  layers: z119.array(layer_ref),
  port_hints: z119.array(z119.string()).optional(),
  pcb_component_id: z119.string().optional(),
  pcb_port_id: z119.string().optional(),
  pcb_plated_hole_id: getZodPrefixedIdWithDefault("pcb_plated_hole"),
  soldermask_margin: z119.number().optional(),
  ccw_rotation: rotation.optional()
});
var pcb_plated_hole = z119.union([
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
import { z as z120 } from "zod";
var pcb_port = z120.object({
  type: z120.literal("pcb_port"),
  pcb_port_id: getZodPrefixedIdWithDefault("pcb_port"),
  pcb_group_id: z120.string().optional(),
  subcircuit_id: z120.string().optional(),
  source_port_id: z120.string(),
  pcb_component_id: z120.string().optional(),
  x: distance,
  y: distance,
  layers: z120.array(layer_ref),
  is_board_pinout: z120.boolean().optional()
}).describe("Defines a port on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_smtpad.ts
import { z as z121 } from "zod";
var pcb_smtpad_circle = z121.object({
  type: z121.literal("pcb_smtpad"),
  shape: z121.literal("circle"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z121.string().optional(),
  subcircuit_id: z121.string().optional(),
  x: distance,
  y: distance,
  radius: z121.number(),
  layer: layer_ref,
  port_hints: z121.array(z121.string()).optional(),
  pcb_component_id: z121.string().optional(),
  pcb_port_id: z121.string().optional(),
  is_covered_with_solder_mask: z121.boolean().optional(),
  soldermask_margin: z121.number().optional(),
  solderpaste_margin: z121.number().optional()
});
var pcb_smtpad_rect = z121.object({
  type: z121.literal("pcb_smtpad"),
  shape: z121.literal("rect"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z121.string().optional(),
  subcircuit_id: z121.string().optional(),
  x: distance,
  y: distance,
  width: z121.number(),
  height: z121.number(),
  rect_border_radius: z121.number().optional(),
  corner_radius: z121.number().optional(),
  layer: layer_ref,
  port_hints: z121.array(z121.string()).optional(),
  pcb_component_id: z121.string().optional(),
  pcb_port_id: z121.string().optional(),
  is_covered_with_solder_mask: z121.boolean().optional(),
  soldermask_margin: z121.number().optional(),
  soldermask_margin_left: z121.number().optional(),
  soldermask_margin_top: z121.number().optional(),
  soldermask_margin_right: z121.number().optional(),
  soldermask_margin_bottom: z121.number().optional(),
  solderpaste_margin: z121.number().optional()
});
var pcb_smtpad_rotated_rect = z121.object({
  type: z121.literal("pcb_smtpad"),
  shape: z121.literal("rotated_rect"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z121.string().optional(),
  subcircuit_id: z121.string().optional(),
  x: distance,
  y: distance,
  width: z121.number(),
  height: z121.number(),
  rect_border_radius: z121.number().optional(),
  corner_radius: z121.number().optional(),
  ccw_rotation: rotation,
  layer: layer_ref,
  port_hints: z121.array(z121.string()).optional(),
  pcb_component_id: z121.string().optional(),
  pcb_port_id: z121.string().optional(),
  is_covered_with_solder_mask: z121.boolean().optional(),
  soldermask_margin: z121.number().optional(),
  soldermask_margin_left: z121.number().optional(),
  soldermask_margin_top: z121.number().optional(),
  soldermask_margin_right: z121.number().optional(),
  soldermask_margin_bottom: z121.number().optional(),
  solderpaste_margin: z121.number().optional()
});
var pcb_smtpad_pill = z121.object({
  type: z121.literal("pcb_smtpad"),
  shape: z121.literal("pill"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z121.string().optional(),
  subcircuit_id: z121.string().optional(),
  x: distance,
  y: distance,
  width: z121.number(),
  height: z121.number(),
  radius: z121.number(),
  layer: layer_ref,
  port_hints: z121.array(z121.string()).optional(),
  pcb_component_id: z121.string().optional(),
  pcb_port_id: z121.string().optional(),
  is_covered_with_solder_mask: z121.boolean().optional(),
  soldermask_margin: z121.number().optional(),
  solderpaste_margin: z121.number().optional()
});
var pcb_smtpad_rotated_pill = z121.object({
  type: z121.literal("pcb_smtpad"),
  shape: z121.literal("rotated_pill"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z121.string().optional(),
  subcircuit_id: z121.string().optional(),
  x: distance,
  y: distance,
  width: z121.number(),
  height: z121.number(),
  radius: z121.number(),
  ccw_rotation: rotation,
  layer: layer_ref,
  port_hints: z121.array(z121.string()).optional(),
  pcb_component_id: z121.string().optional(),
  pcb_port_id: z121.string().optional(),
  is_covered_with_solder_mask: z121.boolean().optional(),
  soldermask_margin: z121.number().optional(),
  solderpaste_margin: z121.number().optional()
});
var pcb_smtpad_polygon = z121.object({
  type: z121.literal("pcb_smtpad"),
  shape: z121.literal("polygon"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z121.string().optional(),
  subcircuit_id: z121.string().optional(),
  points: z121.array(point),
  layer: layer_ref,
  port_hints: z121.array(z121.string()).optional(),
  pcb_component_id: z121.string().optional(),
  pcb_port_id: z121.string().optional(),
  is_covered_with_solder_mask: z121.boolean().optional(),
  soldermask_margin: z121.number().optional(),
  solderpaste_margin: z121.number().optional()
});
var pcb_smtpad = z121.discriminatedUnion("shape", [
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
import { z as z122 } from "zod";
var pcb_solder_paste_circle = z122.object({
  type: z122.literal("pcb_solder_paste"),
  shape: z122.literal("circle"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z122.string().optional(),
  subcircuit_id: z122.string().optional(),
  x: distance,
  y: distance,
  radius: z122.number(),
  layer: layer_ref,
  pcb_component_id: z122.string().optional(),
  pcb_smtpad_id: z122.string().optional()
});
var pcb_solder_paste_rect = z122.object({
  type: z122.literal("pcb_solder_paste"),
  shape: z122.literal("rect"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z122.string().optional(),
  subcircuit_id: z122.string().optional(),
  x: distance,
  y: distance,
  width: z122.number(),
  height: z122.number(),
  layer: layer_ref,
  pcb_component_id: z122.string().optional(),
  pcb_smtpad_id: z122.string().optional()
});
var pcb_solder_paste_pill = z122.object({
  type: z122.literal("pcb_solder_paste"),
  shape: z122.literal("pill"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z122.string().optional(),
  subcircuit_id: z122.string().optional(),
  x: distance,
  y: distance,
  width: z122.number(),
  height: z122.number(),
  radius: z122.number(),
  layer: layer_ref,
  pcb_component_id: z122.string().optional(),
  pcb_smtpad_id: z122.string().optional()
});
var pcb_solder_paste_rotated_rect = z122.object({
  type: z122.literal("pcb_solder_paste"),
  shape: z122.literal("rotated_rect"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z122.string().optional(),
  subcircuit_id: z122.string().optional(),
  x: distance,
  y: distance,
  width: z122.number(),
  height: z122.number(),
  ccw_rotation: distance,
  layer: layer_ref,
  pcb_component_id: z122.string().optional(),
  pcb_smtpad_id: z122.string().optional()
});
var pcb_solder_paste_rotated_pill = z122.object({
  type: z122.literal("pcb_solder_paste"),
  shape: z122.literal("rotated_pill"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z122.string().optional(),
  subcircuit_id: z122.string().optional(),
  x: distance,
  y: distance,
  width: z122.number(),
  height: z122.number(),
  radius: z122.number(),
  ccw_rotation: rotation,
  layer: layer_ref,
  pcb_component_id: z122.string().optional(),
  pcb_smtpad_id: z122.string().optional()
});
var pcb_solder_paste_oval = z122.object({
  type: z122.literal("pcb_solder_paste"),
  shape: z122.literal("oval"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z122.string().optional(),
  subcircuit_id: z122.string().optional(),
  x: distance,
  y: distance,
  width: z122.number(),
  height: z122.number(),
  layer: layer_ref,
  pcb_component_id: z122.string().optional(),
  pcb_smtpad_id: z122.string().optional()
});
var pcb_solder_paste_polygon = polygon_shape.extend({
  type: z122.literal("pcb_solder_paste"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z122.string().optional(),
  subcircuit_id: z122.string().optional(),
  holes: z122.array(polygon_shape.shape.points).optional(),
  layer: layer_ref,
  pcb_component_id: z122.string().optional(),
  pcb_smtpad_id: z122.string().optional()
});
var pcb_solder_paste = z122.union([
  pcb_solder_paste_circle,
  pcb_solder_paste_rect,
  pcb_solder_paste_pill,
  pcb_solder_paste_rotated_rect,
  pcb_solder_paste_rotated_pill,
  pcb_solder_paste_oval,
  pcb_solder_paste_polygon
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
expectTypesMatch(true);

// src/pcb/pcb_soldermask_opening.ts
import { z as z123 } from "zod";
var opening_base = z123.object({
  type: z123.literal("pcb_soldermask_opening"),
  pcb_soldermask_opening_id: getZodPrefixedIdWithDefault(
    "pcb_soldermask_opening"
  ),
  layer: layer_ref.pipe(visible_layer),
  pcb_component_id: z123.string().optional(),
  pcb_group_id: z123.string().optional(),
  subcircuit_id: z123.string().optional()
});
var pcb_soldermask_opening = z123.discriminatedUnion("shape", [
  circle_shape.extend(opening_base.shape),
  rect_shape.extend(opening_base.shape),
  rotated_rect_shape.extend(opening_base.shape),
  polygon_shape.extend(opening_base.shape)
]).describe(
  "An explicit opening in top or bottom solder mask or flex coverlay, independent of pads. Removes mask without adding copper or solder paste."
);
expectTypesMatch(
  true
);

// src/pcb/pcb_text.ts
import { z as z124 } from "zod";
var pcb_text = z124.object({
  type: z124.literal("pcb_text"),
  pcb_text_id: getZodPrefixedIdWithDefault("pcb_text"),
  pcb_group_id: z124.string().optional(),
  subcircuit_id: z124.string().optional(),
  text: z124.string(),
  center: point,
  layer: layer_ref,
  width: length,
  height: length,
  lines: z124.number(),
  // @ts-ignore
  align: z124.enum(["bottom-left"])
}).describe("Defines text on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_trace.ts
import { z as z125 } from "zod";
var positive_width = distance.pipe(z125.number().finite().positive());
var pcb_trace_route_point_wire = z125.object({
  route_type: z125.literal("wire"),
  x: distance,
  y: distance,
  width: distance,
  start_width: positive_width.optional(),
  end_width: positive_width.optional(),
  width_interpolation_mode: z125.enum(["linear", "quadratic"]).optional(),
  copper_pour_id: z125.string().optional(),
  is_inside_copper_pour: z125.boolean().optional(),
  start_pcb_port_id: z125.string().optional(),
  end_pcb_port_id: z125.string().optional(),
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
      code: z125.ZodIssueCode.custom,
      message: "Wire taper requires start_width, end_width and width_interpolation_mode together"
    });
  }
  if (wire.width !== wire.start_width) {
    ctx.addIssue({
      code: z125.ZodIssueCode.custom,
      path: ["start_width"],
      message: "start_width must equal width"
    });
  }
  if (!Number.isFinite(wire.x) || !Number.isFinite(wire.y)) {
    ctx.addIssue({
      code: z125.ZodIssueCode.custom,
      message: "Tapered wire coordinates must be finite"
    });
  }
});
var pcb_trace_route_point_via = z125.object({
  route_type: z125.literal("via"),
  x: distance,
  y: distance,
  copper_pour_id: z125.string().optional(),
  is_inside_copper_pour: z125.boolean().optional(),
  hole_diameter: distance.optional(),
  outer_diameter: distance.optional(),
  tented_on_top: z125.boolean().optional(),
  tented_on_bottom: z125.boolean().optional(),
  from_layer: layer_ref,
  to_layer: layer_ref
});
var pcb_trace_route_point_through_pad = z125.object({
  route_type: z125.literal("through_pad"),
  start: point,
  end: point,
  width: distance,
  start_layer: layer_ref,
  end_layer: layer_ref,
  pcb_smtpad_id: z125.string().optional(),
  pcb_plated_hole_id: z125.string().optional()
});
var pcb_trace_route_point = z125.union([
  pcb_trace_route_point_wire,
  pcb_trace_route_point_via,
  pcb_trace_route_point_through_pad
]);
var pcb_trace = z125.object({
  type: z125.literal("pcb_trace"),
  source_trace_id: z125.string().optional(),
  pcb_component_id: z125.string().optional(),
  pcb_trace_id: getZodPrefixedIdWithDefault("pcb_trace"),
  pcb_group_id: z125.string().optional(),
  subcircuit_id: z125.string().optional(),
  route_thickness_mode: z125.enum(["constant", "interpolated"]).default("constant").optional(),
  route_order_index: z125.number().optional(),
  should_round_corners: z125.boolean().optional(),
  trace_length: z125.number().optional(),
  is_antenna_trace: z125.boolean().optional(),
  highlight_color: z125.string().optional(),
  route: z125.array(pcb_trace_route_point).superRefine((route, ctx) => {
    for (const [i, wire] of route.entries()) {
      if (wire.route_type !== "wire" || wire.width_interpolation_mode === void 0)
        continue;
      const next = route[i + 1];
      const end = next?.route_type === "through_pad" ? next.start : next;
      const layer = next?.route_type === "wire" ? next.layer : next?.route_type === "via" ? next.from_layer : next?.start_layer;
      const length4 = end ? Math.hypot(end.x - wire.x, end.y - wire.y) : NaN;
      if (!Number.isFinite(length4) || length4 <= 0 || layer !== wire.layer) {
        ctx.addIssue({
          code: z125.ZodIssueCode.custom,
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
import { z as z126 } from "zod";
var pcb_trace_warning = z126.object({
  type: z126.literal("pcb_trace_warning"),
  pcb_trace_warning_id: getZodPrefixedIdWithDefault("pcb_trace_warning"),
  warning_type: z126.literal("pcb_trace_warning").default("pcb_trace_warning"),
  message: z126.string(),
  center: point.optional(),
  pcb_trace_id: z126.string(),
  source_trace_id: z126.string(),
  pcb_component_ids: z126.array(z126.string()),
  pcb_port_ids: z126.array(z126.string()),
  subcircuit_id: z126.string().optional()
}).describe("Defines a trace warning on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_trace_style_warning.ts
import { z as z127 } from "zod";
var pcb_trace_style_warning = z127.object({
  type: z127.literal("pcb_trace_style_warning"),
  pcb_trace_style_warning_id: getZodPrefixedIdWithDefault(
    "pcb_trace_style_warning"
  ),
  warning_type: z127.literal("pcb_trace_style_warning").default("pcb_trace_style_warning"),
  message: z127.string(),
  styling_issue_type: z127.literal("long_segment_at_odd_angle"),
  pcb_trace_id: z127.string(),
  source_trace_id: z127.string().optional(),
  subcircuit_id: z127.string().optional(),
  layer: layer_ref,
  start_route_index: z127.number().int().nonnegative(),
  end_route_index: z127.number().int().nonnegative(),
  segment_start: point,
  segment_end: point,
  center: point,
  segment_length: distance,
  minimum_segment_length: distance,
  angle_degrees: z127.number().min(0).lt(360),
  nearest_allowed_angle_degrees: z127.number().min(0).lt(360).multipleOf(45),
  angle_deviation_degrees: z127.number().min(0).max(22.5),
  angle_tolerance_degrees: z127.number().min(0).lt(22.5)
}).describe(
  "Warning for a long PCB trace segment whose direction deviates from a multiple of 45 degrees"
);
expectTypesMatch(true);

// src/pcb/pcb_trace_too_long_error.ts
import { z as z128 } from "zod";
var pcb_trace_too_long_error = z128.object({
  type: z128.literal("pcb_trace_too_long_error"),
  pcb_trace_too_long_error_id: getZodPrefixedIdWithDefault(
    "pcb_trace_too_long_error"
  ),
  error_type: z128.literal("pcb_trace_too_long_error").default("pcb_trace_too_long_error"),
  message: z128.string(),
  pcb_trace_id: z128.string(),
  source_net_id: z128.string().optional(),
  source_trace_id: z128.string().optional(),
  actual_trace_length: distance,
  maximum_trace_length: distance,
  subcircuit_id: z128.string().optional()
}).describe(
  "Error emitted when a PCB trace is longer than its maximum allowed length"
);
expectTypesMatch(true);

// src/pcb/pcb_bus_length_skew_error.ts
import { z as z129 } from "zod";
var pcb_bus_length_skew_error = base_circuit_json_error.extend({
  type: z129.literal("pcb_bus_length_skew_error"),
  pcb_bus_length_skew_error_id: getZodPrefixedIdWithDefault(
    "pcb_bus_length_skew_error"
  ),
  error_type: z129.literal("pcb_bus_length_skew_error").default("pcb_bus_length_skew_error"),
  source_bus_id: z129.string(),
  source_trace_ids: z129.array(z129.string()),
  pcb_trace_ids: z129.array(z129.string()),
  actual_length_skew: z129.number().nonnegative().finite(),
  maximum_length_skew: z129.number().nonnegative().finite(),
  subcircuit_id: z129.string().optional()
});
expectTypesMatch(true);

// src/pcb/pcb_trace_too_long_warning.ts
import { z as z130 } from "zod";
var pcb_trace_too_long_warning = z130.object({
  type: z130.literal("pcb_trace_too_long_warning"),
  pcb_trace_too_long_warning_id: getZodPrefixedIdWithDefault(
    "pcb_trace_too_long_warning"
  ),
  warning_type: z130.literal("pcb_trace_too_long_warning").default("pcb_trace_too_long_warning"),
  message: z130.string(),
  pcb_trace_id: z130.string(),
  source_net_id: z130.string().optional(),
  source_trace_id: z130.string().optional(),
  actual_trace_length: distance,
  maximum_trace_length: distance,
  subcircuit_id: z130.string().optional()
}).describe(
  "Warning emitted when a PCB trace is longer than its maximum allowed length"
);
expectTypesMatch(true);

// src/pcb/pcb_trace_too_many_vias_warning.ts
import { z as z131 } from "zod";
var pcb_trace_too_many_vias_warning = z131.object({
  type: z131.literal("pcb_trace_too_many_vias_warning"),
  pcb_trace_too_many_vias_warning_id: getZodPrefixedIdWithDefault(
    "pcb_trace_too_many_vias_warning"
  ),
  warning_type: z131.literal("pcb_trace_too_many_vias_warning").default("pcb_trace_too_many_vias_warning"),
  message: z131.string(),
  pcb_trace_id: z131.string(),
  source_net_id: z131.string().optional(),
  source_trace_id: z131.string().optional(),
  actual_via_count: z131.number().int().nonnegative(),
  maximum_via_count: z131.number().int().nonnegative(),
  subcircuit_id: z131.string().optional()
}).describe(
  "Warning emitted when a PCB trace has more vias than its maximum allowed count"
);
expectTypesMatch(true);

// src/pcb/pcb_bus_routing_constraint_error.ts
import { z as z132 } from "zod";
var error_base = base_circuit_json_error.extend({
  type: z132.literal("pcb_bus_routing_constraint_error"),
  pcb_bus_routing_constraint_error_id: getZodPrefixedIdWithDefault(
    "pcb_bus_routing_constraint_error"
  ),
  error_type: z132.literal("pcb_bus_routing_constraint_error").default("pcb_bus_routing_constraint_error"),
  source_bus_id: z132.string(),
  source_trace_ids: z132.array(z132.string()).min(1),
  pcb_trace_ids: z132.array(z132.string()),
  subcircuit_id: z132.string().optional()
});
var pcb_bus_routing_constraint_error = z132.discriminatedUnion("routing_rule", [
  error_base.extend({
    routing_rule: z132.literal("length_skew"),
    actual_length_skew: z132.number().nonnegative().finite(),
    maximum_length_skew: z132.number().nonnegative().finite()
  }),
  error_base.extend({
    routing_rule: z132.literal("min_length"),
    actual_trace_length: z132.number().nonnegative().finite(),
    minimum_trace_length: z132.number().finite()
  }),
  error_base.extend({
    routing_rule: z132.literal("max_length"),
    actual_trace_length: z132.number().nonnegative().finite(),
    maximum_trace_length: z132.number().finite()
  }),
  error_base.extend({
    routing_rule: z132.literal("target_length"),
    actual_trace_length: z132.number().nonnegative().finite(),
    target_trace_length: z132.number().finite(),
    length_tolerance: z132.number().nonnegative().finite()
  }),
  error_base.extend({
    routing_rule: z132.literal("pcb_trace_spacing"),
    other_pcb_trace_id: z132.string(),
    other_source_trace_id: z132.string().optional(),
    actual_centerline_spacing: z132.number().nonnegative().finite(),
    minimum_centerline_spacing: z132.number().positive().finite()
  }),
  error_base.extend({
    routing_rule: z132.literal("pcb_spacing_to_other_signals"),
    other_pcb_trace_id: z132.string(),
    other_source_trace_id: z132.string().optional(),
    actual_centerline_spacing: z132.number().nonnegative().finite(),
    minimum_centerline_spacing: z132.number().positive().finite()
  }),
  error_base.extend({
    routing_rule: z132.literal("impedance_target"),
    target_impedance: z132.number().positive().finite(),
    minimum_impedance: z132.number().positive().finite().optional(),
    maximum_impedance: z132.number().positive().finite().optional()
  })
]).superRefine((error, ctx) => {
  if (error.routing_rule !== "impedance_target") return;
  if (error.minimum_impedance === void 0 && error.maximum_impedance === void 0)
    ctx.addIssue({
      code: z132.ZodIssueCode.custom,
      path: ["minimum_impedance"],
      message: "Provide an impedance bound"
    });
  if (error.minimum_impedance !== void 0 && error.maximum_impedance !== void 0 && error.minimum_impedance > error.maximum_impedance)
    ctx.addIssue({
      code: z132.ZodIssueCode.custom,
      path: ["maximum_impedance"],
      message: "Impedance bounds must be ordered"
    });
}).describe(
  "A declared bus or differential-pair routing constraint is violated."
);
expectTypesMatch(true);

// src/pcb/pcb_bus_routing_constraint_warning.ts
import { z as z133 } from "zod";
var warning_base = z133.object({
  type: z133.literal("pcb_bus_routing_constraint_warning"),
  pcb_bus_routing_constraint_warning_id: getZodPrefixedIdWithDefault(
    "pcb_bus_routing_constraint_warning"
  ),
  warning_type: z133.literal("pcb_bus_routing_constraint_warning").default("pcb_bus_routing_constraint_warning"),
  source_bus_id: z133.string(),
  source_trace_ids: z133.array(z133.string()).min(1),
  pcb_trace_ids: z133.array(z133.string()),
  message: z133.string(),
  subcircuit_id: z133.string().optional()
}).describe(
  "A declared bus or pair constraint could not be verified; this is not a pass."
);
var pcb_bus_routing_constraint_warning = z133.discriminatedUnion(
  "routing_rule",
  [
    warning_base.extend({ routing_rule: z133.literal("route_geometry") }),
    warning_base.extend({ routing_rule: z133.literal("reference_geometry") }),
    warning_base.extend({ routing_rule: z133.literal("spacing_geometry") }),
    warning_base.extend({ routing_rule: z133.literal("target_length") }),
    warning_base.extend({ routing_rule: z133.literal("physical_impedance") })
  ]
);
expectTypesMatch(true);

// src/pcb/pcb_trace_error.ts
import { z as z134 } from "zod";
var pcb_trace_error = base_circuit_json_error.extend({
  type: z134.literal("pcb_trace_error"),
  pcb_trace_error_id: getZodPrefixedIdWithDefault("pcb_trace_error"),
  error_type: z134.literal("pcb_trace_error").default("pcb_trace_error"),
  center: point.optional(),
  pcb_trace_id: z134.string(),
  source_trace_id: z134.string(),
  pcb_component_ids: z134.array(z134.string()),
  pcb_port_ids: z134.array(z134.string()),
  subcircuit_id: z134.string().optional()
}).describe("Defines a trace error on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_trace_missing_error.ts
import { z as z135 } from "zod";
var pcb_trace_missing_error = base_circuit_json_error.extend({
  type: z135.literal("pcb_trace_missing_error"),
  pcb_trace_missing_error_id: getZodPrefixedIdWithDefault(
    "pcb_trace_missing_error"
  ),
  error_type: z135.literal("pcb_trace_missing_error").default("pcb_trace_missing_error"),
  center: point.optional(),
  source_trace_id: z135.string(),
  pcb_component_ids: z135.array(z135.string()),
  pcb_port_ids: z135.array(z135.string()),
  subcircuit_id: z135.string().optional()
}).describe(
  "Defines an error when a source trace has no corresponding PCB trace"
);
expectTypesMatch(true);

// src/pcb/pcb_port_not_matched_error.ts
import { z as z136 } from "zod";
var pcb_port_not_matched_error = base_circuit_json_error.extend({
  type: z136.literal("pcb_port_not_matched_error"),
  pcb_error_id: getZodPrefixedIdWithDefault("pcb_error"),
  error_type: z136.literal("pcb_port_not_matched_error").default("pcb_port_not_matched_error"),
  pcb_component_ids: z136.array(z136.string()),
  subcircuit_id: z136.string().optional()
}).describe("Defines a trace error on the PCB where a port is not matched");
expectTypesMatch(true);

// src/pcb/pcb_port_not_connected_error.ts
import { z as z137 } from "zod";
var pcb_port_not_connected_error = base_circuit_json_error.extend({
  type: z137.literal("pcb_port_not_connected_error"),
  pcb_port_not_connected_error_id: getZodPrefixedIdWithDefault(
    "pcb_port_not_connected_error"
  ),
  error_type: z137.literal("pcb_port_not_connected_error").default("pcb_port_not_connected_error"),
  pcb_port_ids: z137.array(z137.string()),
  pcb_component_ids: z137.array(z137.string()),
  subcircuit_id: z137.string().optional()
}).describe("Defines an error when a pcb port is not connected to any trace");
expectTypesMatch(
  true
);

// src/pcb/pcb_net.ts
import { z as z138 } from "zod";
var pcb_net = z138.object({
  type: z138.literal("pcb_net"),
  pcb_net_id: getZodPrefixedIdWithDefault("pcb_net"),
  source_net_id: z138.string().optional(),
  highlight_color: z138.string().optional()
}).describe("Defines a net on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_via.ts
import { z as z139 } from "zod";
var pcb_via = z139.object({
  type: z139.literal("pcb_via"),
  pcb_via_id: getZodPrefixedIdWithDefault("pcb_via"),
  pcb_group_id: z139.string().optional(),
  subcircuit_id: z139.string().optional(),
  subcircuit_connectivity_map_key: z139.string().optional(),
  x: distance,
  y: distance,
  outer_diameter: distance.default("0.6mm"),
  hole_diameter: distance.default("0.25mm"),
  topmost_drill_layer: layer_ref.optional(),
  bottommost_drill_layer: layer_ref.optional(),
  through_hole: z139.boolean().optional(),
  /** @deprecated */
  from_layer: layer_ref.optional(),
  /** @deprecated */
  to_layer: layer_ref.optional(),
  layers: z139.array(layer_ref),
  /** PCB ports belonging to this via, including layer ports and aliases. */
  pcb_port_ids: z139.array(z139.string()).optional(),
  pcb_trace_id: z139.string().optional(),
  source_trace_id: z139.string().optional(),
  source_net_id: z139.string().min(1).optional(),
  net_is_assignable: z139.boolean().optional(),
  net_assigned: z139.boolean().optional(),
  /** @deprecated Use tented_on_top and tented_on_bottom instead. */
  is_tented: z139.boolean().optional(),
  tented_on_top: z139.boolean().optional(),
  tented_on_bottom: z139.boolean().optional()
}).transform(({ is_tented, ...via }) => {
  if (is_tented !== void 0) {
    via.tented_on_top ??= is_tented;
    via.tented_on_bottom ??= is_tented;
  }
  return via;
}).describe("Defines a via on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_board.ts
import { z as z140 } from "zod";
var pcb_board = z140.object({
  type: z140.literal("pcb_board"),
  pcb_board_id: getZodPrefixedIdWithDefault("pcb_board"),
  pcb_panel_id: z140.string().optional(),
  carrier_pcb_board_id: z140.string().optional(),
  is_subcircuit: z140.boolean().optional(),
  subcircuit_id: z140.string().optional(),
  is_mounted_to_carrier_board: z140.boolean().optional(),
  is_via_in_pad_allowed: z140.boolean().optional(),
  default_via_tented_on_top: z140.boolean().optional(),
  default_via_tented_on_bottom: z140.boolean().optional(),
  default_via_plugged: z140.boolean().optional(),
  width: length.optional(),
  height: length.optional(),
  center: point,
  display_offset_x: z140.string().optional().describe(
    "How to display the x offset for this board, usually corresponding with how the user specified it"
  ),
  display_offset_y: z140.string().optional().describe(
    "How to display the y offset for this board, usually corresponding with how the user specified it"
  ),
  thickness: length.optional().default(1.4),
  num_layers: z140.number().optional().default(4),
  allow_blind_and_buried_vias: z140.boolean().optional().describe(
    "Whether autorouters may generate blind and buried vias. False restricts newly generated vias to the full board stack."
  ),
  outline: z140.array(point).optional(),
  shape: z140.enum(["rect", "polygon"]).optional(),
  material: z140.enum(["fr4", "fr1", "flex"]).default("fr4"),
  solder_mask_color: z140.string().optional(),
  silkscreen_color: z140.string().optional(),
  anchor_position: point.optional(),
  anchor_alignment: ninePointAnchor.optional(),
  position_mode: z140.enum(["relative_to_panel_anchor", "none"]).optional()
}).merge(manufacturing_drc_properties).describe("Defines the board outline of the PCB");
expectTypesMatch(true);

// src/pcb/pcb_stackup.ts
import { z as z141 } from "zod";
var positive_length = length.pipe(z141.number().finite().positive());
var nonnegative_length = length.pipe(z141.number().finite().nonnegative());
var positive_number = z141.number().finite().positive();
var nonnegative_number = z141.number().finite().nonnegative();
var pcb_stackup_soldermask_layer = z141.object({
  layer_type: z141.literal("soldermask").describe("Soldermask layer"),
  thickness: positive_length.optional().describe("Soldermask thickness in mm, omitted when unknown"),
  relative_permittivity: positive_number.optional().describe("Soldermask relative permittivity")
});
expectTypesMatch(true);
var pcb_stackup_copper_layer = z141.object({
  layer_type: z141.literal("copper").describe("Copper layer"),
  layer: layer_ref.describe("PCB copper layer, such as top, inner1 or bottom"),
  thickness: positive_length.describe("Copper thickness in mm"),
  electrical_conductivity_s_per_m: positive_number.optional().describe(
    "Electrical conductivity in S/m, consumers may assume 5.8e7 (annealed copper) when omitted"
  ),
  rms_surface_roughness: nonnegative_length.optional().describe("RMS copper surface roughness in mm")
});
expectTypesMatch(true);
var pcb_stackup_dielectric_layer = z141.object({
  layer_type: z141.literal("dielectric").describe("Dielectric layer"),
  dielectric_type: z141.enum(["core", "prepreg"]).optional().describe("Core or prepreg construction"),
  material_name: z141.string().optional().describe("Fabricator material name, such as FR-4 or 7628"),
  thickness: positive_length.describe("Dielectric thickness in mm"),
  relative_permittivity: positive_number.optional().describe("Dielectric relative permittivity, Dk"),
  loss_tangent: nonnegative_number.optional().describe("Dielectric loss tangent, Df"),
  dielectric_properties_frequency_hz: positive_number.optional().describe(
    "Frequency in Hz at which relative_permittivity and loss_tangent were measured"
  )
});
expectTypesMatch(true);
var pcb_stackup_layer = z141.discriminatedUnion("layer_type", [
  pcb_stackup_soldermask_layer,
  pcb_stackup_copper_layer,
  pcb_stackup_dielectric_layer
]);
expectTypesMatch(true);
var pcb_stackup = z141.object({
  type: z141.literal("pcb_stackup"),
  pcb_stackup_id: getZodPrefixedIdWithDefault("pcb_stackup"),
  pcb_board_id: z141.string().describe("Board described by this stackup"),
  subcircuit_id: z141.string().optional(),
  plated_hole_copper_thickness: positive_length.optional().describe("Copper thickness of plated hole and via barrel walls in mm"),
  layers: z141.array(pcb_stackup_layer).min(1).describe("Physical layers ordered from top to bottom")
}).describe("Physical layer construction and material data for a PCB board");
expectTypesMatch(true);

// src/pcb/pcb_bend.ts
import { z as z142 } from "zod";
var finite_point = point.extend({
  x: length.pipe(z142.number().finite()),
  y: length.pipe(z142.number().finite())
});
var pcb_bend = z142.object({
  type: z142.literal("pcb_bend"),
  pcb_bend_id: getZodPrefixedIdWithDefault("pcb_bend"),
  pcb_board_id: z142.string(),
  pcb_group_id: z142.string().optional(),
  subcircuit_id: z142.string().optional(),
  name: z142.string().optional(),
  start: finite_point,
  end: finite_point,
  bend_angle: rotation.pipe(z142.number().finite()),
  bend_radius: length.pipe(z142.number().finite().positive()),
  bend_side: z142.enum(["left", "right"])
}).refine(({ start, end }) => start.x !== end.x || start.y !== end.y, {
  message: "Bend centerline endpoints must be distinct",
  path: ["end"]
}).describe(
  "Defines a finite-radius bend on a flat PCB for runtime CAD folding"
);
expectTypesMatch(true);

// src/pcb/pcb_stiffener.ts
import { z as z143 } from "zod";
var positive_length2 = length.pipe(z143.number().finite().positive());
var finite_point2 = point.extend({
  x: length.pipe(z143.number().finite()),
  y: length.pipe(z143.number().finite())
});
var pcb_stiffener_base = z143.object({
  type: z143.literal("pcb_stiffener"),
  pcb_stiffener_id: getZodPrefixedIdWithDefault("pcb_stiffener"),
  pcb_board_id: z143.string(),
  pcb_group_id: z143.string().optional(),
  subcircuit_id: z143.string().optional(),
  name: z143.string().optional(),
  layer: z143.enum(["top", "bottom"]),
  material: z143.enum(["fr4", "polyimide", "stainless_steel", "aluminum"]),
  thickness: positive_length2,
  adhesive_thickness: length.pipe(z143.number().finite().nonnegative()).optional()
});
var pcb_stiffener_rect = pcb_stiffener_base.extend({
  shape: z143.literal("rect"),
  center: finite_point2,
  rotation: rotation.pipe(z143.number().finite()).optional(),
  width: positive_length2,
  height: positive_length2,
  outline: z143.never().optional()
});
expectTypesMatch(true);
var pcb_stiffener_polygon = pcb_stiffener_base.extend({
  shape: z143.literal("polygon"),
  outline: z143.array(finite_point2).min(3).refine((points) => {
    const twice_area = points.reduce((sum, p, i) => {
      const next = points[(i + 1) % points.length];
      return sum + p.x * next.y - next.x * p.y;
    }, 0);
    return Number.isFinite(twice_area) && twice_area !== 0;
  }, "Stiffener outline must enclose a nonzero area"),
  center: z143.never().optional(),
  rotation: z143.never().optional(),
  width: z143.never().optional(),
  height: z143.never().optional()
});
expectTypesMatch(
  true
);
var pcb_stiffener = z143.discriminatedUnion("shape", [pcb_stiffener_rect, pcb_stiffener_polygon]).describe(
  "Defines bonded mechanical PCB reinforcement without adding copper layers"
);
expectTypesMatch(true);

// src/pcb/pcb_panel.ts
import { z as z144 } from "zod";
var pcb_panel = z144.object({
  type: z144.literal("pcb_panel"),
  pcb_panel_id: getZodPrefixedIdWithDefault("pcb_panel"),
  width: length,
  height: length,
  center: point,
  thickness: length.optional().default(1.4),
  covered_with_solder_mask: z144.boolean().optional().default(true)
}).describe("Defines a PCB panel that can contain multiple boards");
expectTypesMatch(true);

// src/pcb/pcb_placement_error.ts
import { z as z145 } from "zod";
var pcb_placement_error = base_circuit_json_error.extend({
  type: z145.literal("pcb_placement_error"),
  pcb_placement_error_id: getZodPrefixedIdWithDefault("pcb_placement_error"),
  error_type: z145.literal("pcb_placement_error").default("pcb_placement_error"),
  subcircuit_id: z145.string().optional()
}).describe("Defines a placement error on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_packing_error.ts
import { z as z146 } from "zod";
var pcb_packing_error = base_circuit_json_error.extend({
  type: z146.literal("pcb_packing_error"),
  pcb_packing_error_id: getZodPrefixedIdWithDefault("pcb_packing_error"),
  error_type: z146.literal("pcb_packing_error").default("pcb_packing_error"),
  pcb_group_id: z146.string().optional(),
  subcircuit_id: z146.string().optional()
}).describe("Defines a failure to pack PCB components within layout bounds");
expectTypesMatch(true);

// src/pcb/pcb_panelization_placement_error.ts
import { z as z147 } from "zod";
var pcb_panelization_placement_error = base_circuit_json_error.extend({
  type: z147.literal("pcb_panelization_placement_error"),
  pcb_panelization_placement_error_id: getZodPrefixedIdWithDefault(
    "pcb_panelization_placement_error"
  ),
  error_type: z147.literal("pcb_panelization_placement_error").default("pcb_panelization_placement_error"),
  pcb_panel_id: z147.string().optional(),
  pcb_board_id: z147.string().optional(),
  subcircuit_id: z147.string().optional()
}).describe("Defines a panelization placement error on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_trace_hint.ts
import { z as z148 } from "zod";
var pcb_trace_hint = z148.object({
  type: z148.literal("pcb_trace_hint"),
  pcb_trace_hint_id: getZodPrefixedIdWithDefault("pcb_trace_hint"),
  pcb_port_id: z148.string(),
  pcb_component_id: z148.string(),
  route: z148.array(route_hint_point),
  subcircuit_id: z148.string().optional()
}).describe("A hint that can be used during generation of a PCB trace");
expectTypesMatch(true);

// src/pcb/pcb_silkscreen_line.ts
import { z as z149 } from "zod";
var pcb_silkscreen_line = z149.object({
  type: z149.literal("pcb_silkscreen_line"),
  pcb_silkscreen_line_id: getZodPrefixedIdWithDefault("pcb_silkscreen_line"),
  pcb_component_id: z149.string(),
  pcb_group_id: z149.string().optional(),
  subcircuit_id: z149.string().optional(),
  stroke_width: distance.default("0.1mm"),
  x1: distance,
  y1: distance,
  x2: distance,
  y2: distance,
  layer: visible_layer
}).describe("Defines a silkscreen line on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_silkscreen_path.ts
import { z as z150 } from "zod";
var pcb_silkscreen_path = z150.object({
  type: z150.literal("pcb_silkscreen_path"),
  pcb_silkscreen_path_id: getZodPrefixedIdWithDefault("pcb_silkscreen_path"),
  pcb_component_id: z150.string(),
  pcb_group_id: z150.string().optional(),
  subcircuit_id: z150.string().optional(),
  layer: visible_layer,
  route: z150.array(point),
  stroke_width: length
}).describe("Defines a silkscreen path on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_silkscreen_text.ts
import { z as z151 } from "zod";
var pcb_silkscreen_text = z151.object({
  type: z151.literal("pcb_silkscreen_text"),
  pcb_silkscreen_text_id: getZodPrefixedIdWithDefault("pcb_silkscreen_text"),
  pcb_group_id: z151.string().optional(),
  subcircuit_id: z151.string().optional(),
  font: z151.literal("tscircuit2024").default("tscircuit2024"),
  font_size: distance.default("0.2mm"),
  pcb_component_id: z151.string(),
  text: z151.string(),
  is_knockout: z151.boolean().default(false).optional(),
  knockout_padding: z151.object({
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
  ccw_rotation: z151.number().optional(),
  layer: layer_ref,
  is_mirrored: z151.boolean().default(false).optional(),
  anchor_position: point.default({ x: 0, y: 0 }),
  anchor_alignment: ninePointAnchor.default("center")
}).describe("Defines silkscreen text on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_copper_text.ts
import { z as z152 } from "zod";
var pcb_copper_text = z152.object({
  type: z152.literal("pcb_copper_text"),
  pcb_copper_text_id: getZodPrefixedIdWithDefault("pcb_copper_text"),
  pcb_group_id: z152.string().optional(),
  subcircuit_id: z152.string().optional(),
  font: z152.literal("tscircuit2024").default("tscircuit2024"),
  font_size: distance.default("0.2mm"),
  pcb_component_id: z152.string(),
  text: z152.string(),
  is_knockout: z152.boolean().default(false).optional(),
  knockout_padding: z152.object({
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
  ccw_rotation: z152.number().optional(),
  layer: layer_ref,
  is_mirrored: z152.boolean().default(false).optional(),
  anchor_position: point.default({ x: 0, y: 0 }),
  anchor_alignment: ninePointAnchor.default("center")
}).describe("Defines copper text on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_silkscreen_rect.ts
import { z as z153 } from "zod";
var pcb_silkscreen_rect = z153.object({
  type: z153.literal("pcb_silkscreen_rect"),
  pcb_silkscreen_rect_id: getZodPrefixedIdWithDefault("pcb_silkscreen_rect"),
  pcb_component_id: z153.string(),
  pcb_group_id: z153.string().optional(),
  subcircuit_id: z153.string().optional(),
  center: point,
  width: length,
  height: length,
  layer: layer_ref,
  stroke_width: length.default("1mm"),
  corner_radius: length.optional(),
  is_filled: z153.boolean().default(true).optional(),
  has_stroke: z153.boolean().optional(),
  is_stroke_dashed: z153.boolean().optional(),
  ccw_rotation: z153.number().optional()
}).describe("Defines a silkscreen rect on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_silkscreen_circle.ts
import { z as z154 } from "zod";
var pcb_silkscreen_circle = z154.object({
  type: z154.literal("pcb_silkscreen_circle"),
  pcb_silkscreen_circle_id: getZodPrefixedIdWithDefault(
    "pcb_silkscreen_circle"
  ),
  pcb_component_id: z154.string(),
  pcb_group_id: z154.string().optional(),
  subcircuit_id: z154.string().optional(),
  center: point,
  radius: length,
  layer: visible_layer,
  stroke_width: length.default("1mm"),
  is_filled: z154.boolean().optional()
}).describe("Defines a silkscreen circle on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_silkscreen_oval.ts
import { z as z155 } from "zod";
var pcb_silkscreen_oval = z155.object({
  type: z155.literal("pcb_silkscreen_oval"),
  pcb_silkscreen_oval_id: getZodPrefixedIdWithDefault("pcb_silkscreen_oval"),
  pcb_component_id: z155.string(),
  pcb_group_id: z155.string().optional(),
  subcircuit_id: z155.string().optional(),
  center: point,
  radius_x: distance,
  radius_y: distance,
  layer: visible_layer,
  ccw_rotation: rotation.optional()
}).describe("Defines a silkscreen oval on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_silkscreen_graphic.ts
import { z as z156 } from "zod";
var pcb_silkscreen_graphic_base = z156.object({
  type: z156.literal("pcb_silkscreen_graphic"),
  pcb_silkscreen_graphic_id: getZodPrefixedIdWithDefault(
    "pcb_silkscreen_graphic"
  ),
  pcb_component_id: z156.string(),
  pcb_group_id: z156.string().optional(),
  subcircuit_id: z156.string().optional(),
  layer: visible_layer,
  image_asset: asset.optional()
});
var pcb_silkscreen_graphic_brep = pcb_silkscreen_graphic_base.extend({
  shape: z156.literal("brep"),
  brep_shape
}).describe("Defines a BRep silkscreen graphic on the PCB");
expectTypesMatch(
  true
);
var pcb_silkscreen_graphic = z156.discriminatedUnion("shape", [pcb_silkscreen_graphic_brep]).describe("Defines a silkscreen graphic on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_silkscreen_pill.ts
import { z as z157 } from "zod";
var pcb_silkscreen_pill = z157.object({
  type: z157.literal("pcb_silkscreen_pill"),
  pcb_silkscreen_pill_id: getZodPrefixedIdWithDefault("pcb_silkscreen_pill"),
  pcb_component_id: z157.string(),
  pcb_group_id: z157.string().optional(),
  subcircuit_id: z157.string().optional(),
  center: point,
  width: length,
  height: length,
  layer: layer_ref,
  ccw_rotation: z157.number().optional()
}).describe("Defines a silkscreen pill on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_fabrication_note_text.ts
import { z as z158 } from "zod";
var pcb_fabrication_note_text = z158.object({
  type: z158.literal("pcb_fabrication_note_text"),
  pcb_fabrication_note_text_id: getZodPrefixedIdWithDefault(
    "pcb_fabrication_note_text"
  ),
  subcircuit_id: z158.string().optional(),
  pcb_group_id: z158.string().optional(),
  font: z158.literal("tscircuit2024").default("tscircuit2024"),
  font_size: distance.default("1mm"),
  pcb_component_id: z158.string(),
  text: z158.string(),
  ccw_rotation: z158.number().optional(),
  layer: visible_layer,
  anchor_position: point.default({ x: 0, y: 0 }),
  anchor_alignment: z158.enum(["center", "top_left", "top_right", "bottom_left", "bottom_right"]).default("center"),
  color: z158.string().optional()
}).describe(
  "Defines a fabrication note in text on the PCB, useful for leaving notes for assemblers or fabricators"
);
expectTypesMatch(true);

// src/pcb/pcb_fabrication_note_path.ts
import { z as z159 } from "zod";
var pcb_fabrication_note_path = z159.object({
  type: z159.literal("pcb_fabrication_note_path"),
  pcb_fabrication_note_path_id: getZodPrefixedIdWithDefault(
    "pcb_fabrication_note_path"
  ),
  pcb_component_id: z159.string(),
  subcircuit_id: z159.string().optional(),
  layer: layer_ref,
  route: z159.array(point),
  stroke_width: length,
  color: z159.string().optional(),
  is_filled: z159.boolean().optional(),
  has_stroke: z159.boolean().optional()
}).describe(
  "Defines a fabrication path on the PCB for fabricators or assemblers"
);
expectTypesMatch(true);

// src/pcb/pcb_fabrication_note_rect.ts
import { z as z160 } from "zod";
var pcb_fabrication_note_rect = z160.object({
  type: z160.literal("pcb_fabrication_note_rect"),
  pcb_fabrication_note_rect_id: getZodPrefixedIdWithDefault(
    "pcb_fabrication_note_rect"
  ),
  pcb_component_id: z160.string(),
  pcb_group_id: z160.string().optional(),
  subcircuit_id: z160.string().optional(),
  center: point,
  width: length,
  height: length,
  layer: visible_layer,
  stroke_width: length.default("0.1mm"),
  corner_radius: length.optional(),
  is_filled: z160.boolean().optional(),
  has_stroke: z160.boolean().optional(),
  is_stroke_dashed: z160.boolean().optional(),
  color: z160.string().optional()
}).describe("Defines a fabrication note rectangle on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_fabrication_note_dimension.ts
import { z as z161 } from "zod";
var pcb_fabrication_note_dimension = z161.object({
  type: z161.literal("pcb_fabrication_note_dimension"),
  pcb_fabrication_note_dimension_id: getZodPrefixedIdWithDefault(
    "pcb_fabrication_note_dimension"
  ),
  pcb_component_id: z161.string(),
  pcb_group_id: z161.string().optional(),
  subcircuit_id: z161.string().optional(),
  layer: visible_layer,
  from: point,
  to: point,
  text: z161.string().optional(),
  text_ccw_rotation: z161.number().optional(),
  offset: length.optional(),
  offset_distance: length.optional(),
  offset_direction: z161.object({
    x: z161.number(),
    y: z161.number()
  }).optional(),
  font: z161.literal("tscircuit2024").default("tscircuit2024"),
  font_size: length.default("1mm"),
  color: z161.string().optional(),
  arrow_size: length.default("1mm")
}).describe("Defines a measurement annotation within PCB fabrication notes");
expectTypesMatch(true);

// src/pcb/pcb_note_text.ts
import { z as z162 } from "zod";
var pcb_note_text = z162.object({
  type: z162.literal("pcb_note_text"),
  pcb_note_text_id: getZodPrefixedIdWithDefault("pcb_note_text"),
  pcb_component_id: z162.string().optional(),
  pcb_group_id: z162.string().optional(),
  subcircuit_id: z162.string().optional(),
  name: z162.string().optional(),
  font: z162.literal("tscircuit2024").default("tscircuit2024"),
  font_size: distance.default("1mm"),
  text: z162.string().optional(),
  anchor_position: point.default({ x: 0, y: 0 }),
  anchor_alignment: z162.enum(["center", "top_left", "top_right", "bottom_left", "bottom_right"]).default("center"),
  layer: visible_layer.default("top"),
  is_mirrored_from_top_view: z162.boolean().optional(),
  color: z162.string().optional()
}).describe("Defines a documentation note in text on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_note_rect.ts
import { z as z163 } from "zod";
var pcb_note_rect = z163.object({
  type: z163.literal("pcb_note_rect"),
  pcb_note_rect_id: getZodPrefixedIdWithDefault("pcb_note_rect"),
  pcb_component_id: z163.string().optional(),
  pcb_group_id: z163.string().optional(),
  subcircuit_id: z163.string().optional(),
  name: z163.string().optional(),
  text: z163.string().optional(),
  center: point,
  width: length,
  height: length,
  layer: visible_layer.default("top"),
  stroke_width: length.default("0.1mm"),
  corner_radius: length.optional(),
  is_filled: z163.boolean().optional(),
  has_stroke: z163.boolean().optional(),
  is_stroke_dashed: z163.boolean().optional(),
  color: z163.string().optional()
}).describe("Defines a rectangular documentation note on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_note_path.ts
import { z as z164 } from "zod";
var pcb_note_path = z164.object({
  type: z164.literal("pcb_note_path"),
  pcb_note_path_id: getZodPrefixedIdWithDefault("pcb_note_path"),
  pcb_component_id: z164.string().optional(),
  pcb_group_id: z164.string().optional(),
  subcircuit_id: z164.string().optional(),
  name: z164.string().optional(),
  text: z164.string().optional(),
  route: z164.array(point),
  layer: visible_layer.default("top"),
  stroke_width: length.default("0.1mm"),
  color: z164.string().optional()
}).describe("Defines a polyline documentation note on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_note_line.ts
import { z as z165 } from "zod";
var pcb_note_line = z165.object({
  type: z165.literal("pcb_note_line"),
  pcb_note_line_id: getZodPrefixedIdWithDefault("pcb_note_line"),
  pcb_component_id: z165.string().optional(),
  pcb_group_id: z165.string().optional(),
  subcircuit_id: z165.string().optional(),
  name: z165.string().optional(),
  text: z165.string().optional(),
  x1: distance,
  y1: distance,
  x2: distance,
  y2: distance,
  layer: visible_layer.default("top"),
  stroke_width: distance.default("0.1mm"),
  color: z165.string().optional(),
  is_dashed: z165.boolean().optional()
}).describe("Defines a straight documentation note line on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_note_dimension.ts
import { z as z166 } from "zod";
var pcb_note_dimension = z166.object({
  type: z166.literal("pcb_note_dimension"),
  pcb_note_dimension_id: getZodPrefixedIdWithDefault("pcb_note_dimension"),
  pcb_component_id: z166.string().optional(),
  pcb_group_id: z166.string().optional(),
  subcircuit_id: z166.string().optional(),
  name: z166.string().optional(),
  from: point,
  to: point,
  text: z166.string().optional(),
  text_ccw_rotation: z166.number().optional(),
  offset_distance: length.optional(),
  offset_direction: z166.object({
    x: z166.number(),
    y: z166.number()
  }).optional(),
  font: z166.literal("tscircuit2024").default("tscircuit2024"),
  font_size: length.default("1mm"),
  layer: visible_layer.default("top"),
  color: z166.string().optional(),
  arrow_size: length.default("1mm")
}).describe("Defines a measurement annotation within PCB documentation notes");
expectTypesMatch(true);

// src/pcb/pcb_footprint_overlap_error.ts
import { z as z167 } from "zod";
var pcb_footprint_overlap_error = base_circuit_json_error.extend({
  type: z167.literal("pcb_footprint_overlap_error"),
  pcb_error_id: getZodPrefixedIdWithDefault("pcb_error"),
  error_type: z167.literal("pcb_footprint_overlap_error").default("pcb_footprint_overlap_error"),
  pcb_smtpad_ids: z167.array(z167.string()).optional(),
  pcb_plated_hole_ids: z167.array(z167.string()).optional(),
  pcb_hole_ids: z167.array(z167.string()).optional(),
  pcb_keepout_ids: z167.array(z167.string()).optional()
}).describe("Error emitted when a pcb footprint overlaps with another element");
expectTypesMatch(
  true
);

// src/pcb/pcb_courtyard_overlap_error.ts
import { z as z168 } from "zod";
var pcb_courtyard_overlap_error = base_circuit_json_error.extend({
  type: z168.literal("pcb_courtyard_overlap_error"),
  pcb_error_id: getZodPrefixedIdWithDefault("pcb_error"),
  error_type: z168.literal("pcb_courtyard_overlap_error").default("pcb_courtyard_overlap_error"),
  pcb_component_ids: z168.tuple([z168.string(), z168.string()])
}).describe(
  "Error emitted when the courtyard (CrtYd) of one PCB component overlaps with the courtyard of another"
);
expectTypesMatch(
  true
);

// src/pcb/pcb_keepout.ts
import { z as z169 } from "zod";
var pcb_keepout_outline = z169.object({
  type: z169.literal("pcb_keepout"),
  shape: z169.literal("outline"),
  pcb_component_id: z169.string().optional(),
  pcb_group_id: z169.string().optional(),
  subcircuit_id: z169.string().optional(),
  outline: z169.array(point).min(2),
  stroke_width: length,
  pcb_keepout_id: z169.string(),
  layers: z169.array(z169.string()),
  description: z169.string().optional(),
  excluded_pcb_component_ids: z169.array(z169.string()).optional(),
  warning_only: z169.boolean().optional(),
  allow_traces: z169.boolean().optional(),
  allow_placements: z169.boolean().optional()
});
var pcb_keepout = z169.object({
  type: z169.literal("pcb_keepout"),
  shape: z169.literal("rect"),
  pcb_component_id: z169.string().optional(),
  pcb_group_id: z169.string().optional(),
  subcircuit_id: z169.string().optional(),
  center: point,
  width: distance,
  height: distance,
  pcb_keepout_id: z169.string(),
  layers: z169.array(z169.string()),
  // Specify layers where the keepout applies
  description: z169.string().optional(),
  // Optional description of the keepout
  excluded_pcb_component_ids: z169.array(z169.string()).optional(),
  warning_only: z169.boolean().optional(),
  allow_traces: z169.boolean().optional(),
  allow_placements: z169.boolean().optional()
}).or(
  z169.object({
    type: z169.literal("pcb_keepout"),
    shape: z169.literal("circle"),
    pcb_component_id: z169.string().optional(),
    pcb_group_id: z169.string().optional(),
    subcircuit_id: z169.string().optional(),
    center: point,
    radius: distance,
    pcb_keepout_id: z169.string(),
    layers: z169.array(z169.string()),
    // Specify layers where the keepout applies
    description: z169.string().optional(),
    // Optional description of the keepout
    excluded_pcb_component_ids: z169.array(z169.string()).optional(),
    warning_only: z169.boolean().optional(),
    allow_traces: z169.boolean().optional(),
    allow_placements: z169.boolean().optional()
  })
).or(pcb_keepout_outline);
expectTypesMatch(true);
expectTypesMatch(true);

// src/pcb/pcb_keepout_overlap_warning.ts
import { z as z170 } from "zod";
var pcb_keepout_overlap_warning = z170.object({
  type: z170.literal("pcb_keepout_overlap_warning"),
  pcb_keepout_overlap_warning_id: getZodPrefixedIdWithDefault(
    "pcb_keepout_overlap_warning"
  ),
  warning_type: z170.literal("pcb_keepout_overlap_warning").default("pcb_keepout_overlap_warning"),
  message: z170.string(),
  pcb_keepout_id: z170.string(),
  pcb_component_ids: z170.array(z170.string()).optional(),
  pcb_trace_ids: z170.array(z170.string()).optional(),
  pcb_smtpad_ids: z170.array(z170.string()).optional(),
  pcb_plated_hole_ids: z170.array(z170.string()).optional(),
  pcb_via_ids: z170.array(z170.string()).optional(),
  center: point.optional(),
  subcircuit_id: z170.string().optional()
}).describe(
  "Warning emitted when copper overlaps a PCB keepout with warning_only enabled"
);
expectTypesMatch(
  true
);

// src/pcb/pcb_cutout.ts
import { z as z171 } from "zod";
var pcb_cutout_base = z171.object({
  type: z171.literal("pcb_cutout"),
  pcb_cutout_id: getZodPrefixedIdWithDefault("pcb_cutout"),
  pcb_component_id: z171.string().optional(),
  pcb_group_id: z171.string().optional(),
  subcircuit_id: z171.string().optional(),
  pcb_board_id: z171.string().optional(),
  pcb_panel_id: z171.string().optional()
});
var pcb_cutout_rect = pcb_cutout_base.extend({
  shape: z171.literal("rect"),
  center: point,
  width: length,
  height: length,
  rotation: rotation.optional(),
  corner_radius: length.optional()
});
expectTypesMatch(true);
var pcb_cutout_circle = pcb_cutout_base.extend({
  shape: z171.literal("circle"),
  center: point,
  radius: length
});
expectTypesMatch(true);
var pcb_cutout_polygon = pcb_cutout_base.extend({
  shape: z171.literal("polygon"),
  points: z171.array(point)
});
expectTypesMatch(true);
var pcb_cutout_path = pcb_cutout_base.extend({
  shape: z171.literal("path"),
  route: z171.array(point),
  slot_width: length,
  slot_length: length.optional(),
  space_between_slots: length.optional(),
  slot_corner_radius: length.optional()
});
expectTypesMatch(true);
var pcb_cutout = z171.discriminatedUnion("shape", [
  pcb_cutout_rect,
  pcb_cutout_circle,
  pcb_cutout_polygon,
  pcb_cutout_path
]).describe("Defines a cutout on the PCB, removing board material.");
expectTypesMatch(true);

// src/pcb/pcb_missing_footprint_error.ts
import { z as z172 } from "zod";
var pcb_missing_footprint_error = base_circuit_json_error.extend({
  type: z172.literal("pcb_missing_footprint_error"),
  pcb_missing_footprint_error_id: getZodPrefixedIdWithDefault(
    "pcb_missing_footprint_error"
  ),
  pcb_group_id: z172.string().optional(),
  subcircuit_id: z172.string().optional(),
  error_type: z172.literal("pcb_missing_footprint_error").default("pcb_missing_footprint_error"),
  source_component_id: z172.string()
}).describe("Defines a missing footprint error on the PCB");
expectTypesMatch(
  true
);

// src/pcb/external_footprint_load_error.ts
import { z as z173 } from "zod";
var external_footprint_load_error = base_circuit_json_error.extend({
  type: z173.literal("external_footprint_load_error"),
  external_footprint_load_error_id: getZodPrefixedIdWithDefault(
    "external_footprint_load_error"
  ),
  pcb_component_id: z173.string(),
  source_component_id: z173.string(),
  pcb_group_id: z173.string().optional(),
  subcircuit_id: z173.string().optional(),
  footprinter_string: z173.string().optional(),
  error_type: z173.literal("external_footprint_load_error").default("external_footprint_load_error")
}).describe("Defines an error when an external footprint fails to load");
expectTypesMatch(true);

// src/pcb/circuit_json_footprint_load_error.ts
import { z as z174 } from "zod";
var circuit_json_footprint_load_error = base_circuit_json_error.extend({
  type: z174.literal("circuit_json_footprint_load_error"),
  circuit_json_footprint_load_error_id: getZodPrefixedIdWithDefault(
    "circuit_json_footprint_load_error"
  ),
  pcb_component_id: z174.string(),
  source_component_id: z174.string(),
  pcb_group_id: z174.string().optional(),
  subcircuit_id: z174.string().optional(),
  error_type: z174.literal("circuit_json_footprint_load_error").default("circuit_json_footprint_load_error"),
  circuit_json: z174.array(z174.any()).optional()
}).describe("Defines an error when a circuit JSON footprint fails to load");
expectTypesMatch(true);

// src/pcb/pcb_group.ts
import { z as z175 } from "zod";
var pcb_group = z175.object({
  type: z175.literal("pcb_group"),
  pcb_group_id: getZodPrefixedIdWithDefault("pcb_group"),
  source_group_id: z175.string(),
  is_subcircuit: z175.boolean().optional(),
  subcircuit_id: z175.string().optional(),
  width: length.optional(),
  height: length.optional(),
  center: point,
  display_offset_x: z175.string().optional().describe(
    "How to display the x offset for this group, usually corresponding with how the user specified it"
  ),
  display_offset_y: z175.string().optional().describe(
    "How to display the y offset for this group, usually corresponding with how the user specified it"
  ),
  outline: z175.array(point).optional(),
  anchor_position: point.optional(),
  anchor_alignment: ninePointAnchor.default("center"),
  position_mode: z175.enum(["packed", "relative_to_group_anchor", "none"]).optional(),
  positioned_relative_to_pcb_group_id: z175.string().optional(),
  positioned_relative_to_pcb_board_id: z175.string().optional(),
  pcb_component_ids: z175.array(z175.string()),
  child_layout_mode: z175.enum(["packed", "none"]).optional(),
  name: z175.string().optional(),
  description: z175.string().optional(),
  layout_mode: z175.string().optional(),
  autorouter_configuration: z175.object({
    trace_clearance: length
  }).optional(),
  autorouter_used_string: z175.string().optional()
}).describe("Defines a group of components on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_autorouting_error.ts
import { z as z176 } from "zod";
var pcb_autorouting_error = base_circuit_json_error.extend({
  type: z176.literal("pcb_autorouting_error"),
  pcb_error_id: getZodPrefixedIdWithDefault("pcb_autorouting_error"),
  error_type: z176.literal("pcb_autorouting_error").default("pcb_autorouting_error"),
  subcircuit_id: z176.string().optional()
}).describe("The autorouting has failed to route a portion of the board");
expectTypesMatch(true);

// src/pcb/pcb_preflight_routing_error.ts
import { z as z177 } from "zod";
var pcb_preflight_routing_error = base_circuit_json_error.extend({
  type: z177.literal("pcb_preflight_routing_error"),
  pcb_preflight_routing_error_id: getZodPrefixedIdWithDefault(
    "pcb_preflight_routing_error"
  ),
  error_type: z177.literal("pcb_preflight_routing_error").default("pcb_preflight_routing_error"),
  error_code: z177.string(),
  subcircuit_id: z177.string().optional(),
  pcb_group_id: z177.string().optional(),
  routing_phase_index: z177.number().int().optional(),
  phase_name: z177.string().optional(),
  source_trace_ids: z177.array(z177.string()).optional(),
  pcb_component_ids: z177.array(z177.string()).optional(),
  pcb_port_ids: z177.array(z177.string()).optional(),
  related_error_ids: z177.array(z177.string()).optional(),
  measurements: z177.record(z177.number().finite()).optional()
});
expectTypesMatch(true);

// src/pcb/pcb_manual_edit_conflict_warning.ts
import { z as z178 } from "zod";
var pcb_manual_edit_conflict_warning = z178.object({
  type: z178.literal("pcb_manual_edit_conflict_warning"),
  pcb_manual_edit_conflict_warning_id: getZodPrefixedIdWithDefault(
    "pcb_manual_edit_conflict_warning"
  ),
  warning_type: z178.literal("pcb_manual_edit_conflict_warning").default("pcb_manual_edit_conflict_warning"),
  message: z178.string(),
  pcb_component_id: z178.string(),
  pcb_group_id: z178.string().optional(),
  subcircuit_id: z178.string().optional(),
  source_component_id: z178.string()
}).describe(
  "Warning emitted when a component has both manual placement and explicit pcbX/pcbY coordinates"
);
expectTypesMatch(true);

// src/pcb/pcb_connector_not_in_accessible_orientation_warning.ts
import { z as z179 } from "zod";
var connectorOrientationDirection = z179.enum(["x-", "x+", "y+", "y-"]);
var pcb_connector_not_in_accessible_orientation_warning = z179.object({
  type: z179.literal("pcb_connector_not_in_accessible_orientation_warning"),
  pcb_connector_not_in_accessible_orientation_warning_id: getZodPrefixedIdWithDefault(
    "pcb_connector_not_in_accessible_orientation_warning"
  ),
  warning_type: z179.literal("pcb_connector_not_in_accessible_orientation_warning").default("pcb_connector_not_in_accessible_orientation_warning"),
  message: z179.string(),
  pcb_component_id: z179.string(),
  source_component_id: z179.string().optional(),
  pcb_board_id: z179.string().optional(),
  facing_direction: connectorOrientationDirection,
  recommended_facing_direction: connectorOrientationDirection,
  subcircuit_id: z179.string().optional()
}).describe(
  "Warning emitted when a connector PCB component is facing inward toward the board and should be reoriented to an outward-facing direction"
);
expectTypesMatch(true);

// src/pcb/pcb_component_missing_courtyard_warning.ts
import { z as z180 } from "zod";
var pcb_component_missing_courtyard_warning = z180.object({
  type: z180.literal("pcb_component_missing_courtyard_warning"),
  pcb_component_missing_courtyard_warning_id: getZodPrefixedIdWithDefault(
    "pcb_component_missing_courtyard_warning"
  ),
  warning_type: z180.literal("pcb_component_missing_courtyard_warning").default("pcb_component_missing_courtyard_warning"),
  message: z180.string(),
  pcb_component_id: z180.string(),
  source_component_id: z180.string().optional(),
  subcircuit_id: z180.string().optional()
}).describe("Warning emitted when a PCB component has no courtyard geometry");
expectTypesMatch(true);

// src/pcb/supplier_footprint_mismatch_warning.ts
import { z as z181 } from "zod";
var supplier_footprint_mismatch_warning = z181.object({
  type: z181.literal("supplier_footprint_mismatch_warning"),
  supplier_footprint_mismatch_warning_id: getZodPrefixedIdWithDefault(
    "supplier_footprint_mismatch_warning"
  ),
  warning_type: z181.literal("supplier_footprint_mismatch_warning").default("supplier_footprint_mismatch_warning"),
  message: z181.string(),
  source_component_id: z181.string(),
  pcb_component_id: z181.string().optional(),
  pcb_group_id: z181.string().optional(),
  subcircuit_id: z181.string().optional(),
  supplier_name: supplier_name.optional(),
  supplier_part_number: z181.string().optional(),
  supplier_footprint_url: z181.string().optional(),
  footprint_copper_intersection_over_union: z181.number()
}).describe(
  "Warning emitted when a supplier part footprint does not match the expected footprint"
);
expectTypesMatch(true);

// src/pcb/pcb_fabricator_extra_charge_warning.ts
import { z as z182 } from "zod";
var pcb_fabricator_extra_charge_warning = z182.object({
  type: z182.literal("pcb_fabricator_extra_charge_warning"),
  pcb_fabricator_extra_charge_warning_id: getZodPrefixedIdWithDefault(
    "pcb_fabricator_extra_charge_warning"
  ),
  warning_type: z182.literal("pcb_fabricator_extra_charge_warning").default("pcb_fabricator_extra_charge_warning"),
  message: z182.string(),
  fabricator_preset: z182.string(),
  pcb_board_id: z182.string().optional(),
  pcb_via_ids: z182.array(z182.string()).optional(),
  subcircuit_id: z182.string().optional()
}).describe(
  "Warning that a design feature incurs an extra charge for the selected fabricator preset, such as via hole diameters below 0.3 mm with JLCPCB economy or standard presets."
);
expectTypesMatch(true);

// src/pcb/pcb_breakout_point.ts
import { z as z183 } from "zod";
var pcb_breakout_point = z183.object({
  type: z183.literal("pcb_breakout_point"),
  pcb_breakout_point_id: getZodPrefixedIdWithDefault("pcb_breakout_point"),
  pcb_group_id: z183.string(),
  subcircuit_id: z183.string().optional(),
  source_trace_id: z183.string().optional(),
  source_port_id: z183.string().optional(),
  source_net_id: z183.string().optional(),
  layer: layer_ref.optional(),
  x: distance,
  y: distance
}).describe(
  "Defines a routing target within a pcb_group for a source_trace or source_net"
);
expectTypesMatch(true);

// src/pcb/pcb_ground_plane.ts
import { z as z184 } from "zod";
var pcb_ground_plane = z184.object({
  type: z184.literal("pcb_ground_plane"),
  pcb_ground_plane_id: getZodPrefixedIdWithDefault("pcb_ground_plane"),
  source_pcb_ground_plane_id: z184.string(),
  source_net_id: z184.string(),
  pcb_group_id: z184.string().optional(),
  subcircuit_id: z184.string().optional()
}).describe("Defines a ground plane on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_ground_plane_region.ts
import { z as z185 } from "zod";
var pcb_ground_plane_region = z185.object({
  type: z185.literal("pcb_ground_plane_region"),
  pcb_ground_plane_region_id: getZodPrefixedIdWithDefault(
    "pcb_ground_plane_region"
  ),
  pcb_ground_plane_id: z185.string(),
  pcb_group_id: z185.string().optional(),
  subcircuit_id: z185.string().optional(),
  layer: layer_ref,
  points: z185.array(point)
}).describe("Defines a polygon region of a ground plane");
expectTypesMatch(true);

// src/pcb/pcb_thermal_spoke.ts
import { z as z186 } from "zod";
var pcb_thermal_spoke = z186.object({
  type: z186.literal("pcb_thermal_spoke"),
  pcb_thermal_spoke_id: getZodPrefixedIdWithDefault("pcb_thermal_spoke"),
  pcb_ground_plane_id: z186.string(),
  shape: z186.string(),
  spoke_count: z186.number(),
  spoke_thickness: distance,
  spoke_inner_diameter: distance,
  spoke_outer_diameter: distance,
  pcb_plated_hole_id: z186.string().optional(),
  subcircuit_id: z186.string().optional()
}).describe("Pattern for connecting a ground plane to a plated hole");
expectTypesMatch(true);

// src/pcb/pcb_copper_pour.ts
import { z as z187 } from "zod";
var pcb_copper_pour_base = z187.object({
  type: z187.literal("pcb_copper_pour"),
  pcb_copper_pour_id: getZodPrefixedIdWithDefault("pcb_copper_pour"),
  pcb_group_id: z187.string().optional(),
  subcircuit_id: z187.string().optional(),
  layer: layer_ref,
  source_net_id: z187.string().optional(),
  covered_with_solder_mask: z187.boolean().optional().default(true)
});
var pcb_copper_pour_rect = pcb_copper_pour_base.extend({
  shape: z187.literal("rect"),
  center: point,
  width: length,
  height: length,
  rotation: rotation.optional()
});
expectTypesMatch(true);
var pcb_copper_pour_brep = pcb_copper_pour_base.extend({
  shape: z187.literal("brep"),
  brep_shape
});
expectTypesMatch(true);
var pcb_copper_pour_polygon = pcb_copper_pour_base.extend({
  shape: z187.literal("polygon"),
  points: z187.array(point)
});
expectTypesMatch(true);
var pcb_copper_pour = z187.discriminatedUnion("shape", [
  pcb_copper_pour_rect,
  pcb_copper_pour_brep,
  pcb_copper_pour_polygon
]).describe("Defines a copper pour on the PCB.");
expectTypesMatch(true);

// src/pcb/pcb_component_outside_board_error.ts
import { z as z188 } from "zod";
var pcb_component_outside_board_error = base_circuit_json_error.extend({
  type: z188.literal("pcb_component_outside_board_error"),
  pcb_component_outside_board_error_id: getZodPrefixedIdWithDefault(
    "pcb_component_outside_board_error"
  ),
  error_type: z188.literal("pcb_component_outside_board_error").default("pcb_component_outside_board_error"),
  pcb_component_id: z188.string(),
  pcb_board_id: z188.string(),
  component_center: point,
  component_bounds: z188.object({
    min_x: z188.number(),
    max_x: z188.number(),
    min_y: z188.number(),
    max_y: z188.number()
  }),
  subcircuit_id: z188.string().optional(),
  source_component_id: z188.string().optional()
}).describe(
  "Error emitted when a PCB component is placed outside the board boundaries"
);
expectTypesMatch(true);

// src/pcb/pcb_component_not_on_board_edge_error.ts
import { z as z189 } from "zod";
var pcb_component_not_on_board_edge_error = base_circuit_json_error.extend({
  type: z189.literal("pcb_component_not_on_board_edge_error"),
  pcb_component_not_on_board_edge_error_id: getZodPrefixedIdWithDefault(
    "pcb_component_not_on_board_edge_error"
  ),
  error_type: z189.literal("pcb_component_not_on_board_edge_error").default("pcb_component_not_on_board_edge_error"),
  pcb_component_id: z189.string(),
  pcb_board_id: z189.string(),
  component_center: point,
  pad_to_nearest_board_edge_distance: z189.number(),
  source_component_id: z189.string().optional(),
  subcircuit_id: z189.string().optional()
}).describe(
  "Error emitted when a component that must be placed on the board edge is centered away from the edge"
);
expectTypesMatch(true);

// src/pcb/pcb_component_invalid_layer_error.ts
import { z as z190 } from "zod";
var pcb_component_invalid_layer_error = base_circuit_json_error.extend({
  type: z190.literal("pcb_component_invalid_layer_error"),
  pcb_component_invalid_layer_error_id: getZodPrefixedIdWithDefault(
    "pcb_component_invalid_layer_error"
  ),
  error_type: z190.literal("pcb_component_invalid_layer_error").default("pcb_component_invalid_layer_error"),
  pcb_component_id: z190.string().optional(),
  source_component_id: z190.string(),
  layer: layer_ref,
  subcircuit_id: z190.string().optional()
}).describe(
  "Error emitted when a component is placed on an invalid layer (components can only be on 'top' or 'bottom' layers)"
);
expectTypesMatch(true);

// src/pcb/pcb_via_clearance_error.ts
import { z as z191 } from "zod";
var pcb_via_clearance_error = base_circuit_json_error.extend({
  type: z191.literal("pcb_via_clearance_error"),
  pcb_error_id: getZodPrefixedIdWithDefault("pcb_error"),
  error_type: z191.literal("pcb_via_clearance_error").default("pcb_via_clearance_error"),
  pcb_via_ids: z191.array(z191.string()).min(2),
  minimum_clearance: distance.optional(),
  actual_clearance: distance.optional(),
  pcb_center: z191.object({
    x: z191.number().optional(),
    y: z191.number().optional()
  }).optional(),
  subcircuit_id: z191.string().optional()
}).describe("Error emitted when vias are closer than the allowed clearance");
expectTypesMatch(true);

// src/pcb/pcb_via_trace_clearance_error.ts
import { z as z192 } from "zod";
var pcb_via_trace_clearance_error = base_circuit_json_error.extend({
  type: z192.literal("pcb_via_trace_clearance_error"),
  pcb_via_trace_clearance_error_id: getZodPrefixedIdWithDefault(
    "pcb_via_trace_clearance_error"
  ),
  error_type: z192.literal("pcb_via_trace_clearance_error").default("pcb_via_trace_clearance_error"),
  pcb_via_id: z192.string(),
  pcb_trace_id: z192.string(),
  minimum_clearance: distance.optional(),
  actual_clearance: distance.optional(),
  center: z192.object({
    x: z192.number().optional(),
    y: z192.number().optional()
  }).optional(),
  subcircuit_id: z192.string().optional()
}).describe(
  "Error emitted when a via and trace are closer than the allowed clearance"
);
expectTypesMatch(
  true
);

// src/pcb/pcb_pad_pad_clearance_error.ts
import { z as z193 } from "zod";
var pcb_pad_pad_clearance_error = base_circuit_json_error.extend({
  type: z193.literal("pcb_pad_pad_clearance_error"),
  pcb_pad_pad_clearance_error_id: getZodPrefixedIdWithDefault(
    "pcb_pad_pad_clearance_error"
  ),
  error_type: z193.literal("pcb_pad_pad_clearance_error").default("pcb_pad_pad_clearance_error"),
  pcb_pad_ids: z193.array(z193.string()).min(2),
  minimum_clearance: distance.optional(),
  actual_clearance: distance.optional(),
  center: z193.object({
    x: z193.number().optional(),
    y: z193.number().optional()
  }).optional(),
  subcircuit_id: z193.string().optional()
}).describe("Error emitted when pads are closer than the allowed clearance");
expectTypesMatch(true);

// src/pcb/pcb_pad_trace_clearance_error.ts
import { z as z194 } from "zod";
var pcb_pad_trace_clearance_error = base_circuit_json_error.extend({
  type: z194.literal("pcb_pad_trace_clearance_error"),
  pcb_pad_trace_clearance_error_id: getZodPrefixedIdWithDefault(
    "pcb_pad_trace_clearance_error"
  ),
  error_type: z194.literal("pcb_pad_trace_clearance_error").default("pcb_pad_trace_clearance_error"),
  pcb_pad_id: z194.string(),
  pcb_trace_id: z194.string(),
  minimum_clearance: distance.optional(),
  actual_clearance: distance.optional(),
  center: z194.object({
    x: z194.number().optional(),
    y: z194.number().optional()
  }).optional(),
  subcircuit_id: z194.string().optional()
}).describe(
  "Error emitted when a pad and trace are closer than allowed clearance"
);
expectTypesMatch(
  true
);

// src/pcb/pcb_courtyard_rect.ts
import { z as z195 } from "zod";
var pcb_courtyard_rect = z195.object({
  type: z195.literal("pcb_courtyard_rect"),
  pcb_courtyard_rect_id: getZodPrefixedIdWithDefault("pcb_courtyard_rect"),
  pcb_component_id: z195.string(),
  pcb_group_id: z195.string().optional(),
  subcircuit_id: z195.string().optional(),
  center: point,
  width: length,
  height: length,
  layer: visible_layer,
  ccw_rotation: rotation.optional(),
  color: z195.string().optional()
}).describe("Defines a courtyard rectangle on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_courtyard_outline.ts
import { z as z196 } from "zod";
var pcb_courtyard_outline = z196.object({
  type: z196.literal("pcb_courtyard_outline"),
  pcb_courtyard_outline_id: getZodPrefixedIdWithDefault(
    "pcb_courtyard_outline"
  ),
  pcb_component_id: z196.string(),
  pcb_group_id: z196.string().optional(),
  subcircuit_id: z196.string().optional(),
  layer: visible_layer,
  outline: z196.array(point).min(2)
}).describe("Defines a courtyard outline on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_courtyard_polygon.ts
import { z as z197 } from "zod";
var pcb_courtyard_polygon = z197.object({
  type: z197.literal("pcb_courtyard_polygon"),
  pcb_courtyard_polygon_id: getZodPrefixedIdWithDefault(
    "pcb_courtyard_polygon"
  ),
  pcb_component_id: z197.string(),
  pcb_group_id: z197.string().optional(),
  subcircuit_id: z197.string().optional(),
  layer: visible_layer,
  points: z197.array(point).min(3),
  color: z197.string().optional()
}).describe("Defines a courtyard polygon on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_courtyard_circle.ts
import { z as z198 } from "zod";
var pcb_courtyard_circle = z198.object({
  type: z198.literal("pcb_courtyard_circle"),
  pcb_courtyard_circle_id: getZodPrefixedIdWithDefault(
    "pcb_courtyard_circle"
  ),
  pcb_component_id: z198.string(),
  pcb_group_id: z198.string().optional(),
  subcircuit_id: z198.string().optional(),
  center: point,
  radius: length,
  layer: visible_layer,
  color: z198.string().optional()
}).describe("Defines a courtyard circle on the PCB");
expectTypesMatch(true);

// src/pcb/pcb_courtyard_pill.ts
import { z as z199 } from "zod";
var pcb_courtyard_pill = z199.object({
  type: z199.literal("pcb_courtyard_pill"),
  pcb_courtyard_pill_id: getZodPrefixedIdWithDefault("pcb_courtyard_pill"),
  pcb_component_id: z199.string(),
  pcb_group_id: z199.string().optional(),
  subcircuit_id: z199.string().optional(),
  center: point,
  width: length,
  height: length,
  radius: length,
  layer: visible_layer,
  color: z199.string().optional()
}).describe("Defines a courtyard pill on the PCB");
expectTypesMatch(true);

// src/cad/cad_component.ts
import { z as z200 } from "zod";

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
var cad_component = z200.object({
  type: z200.literal("cad_component"),
  cad_component_id: z200.string(),
  pcb_component_id: z200.string().optional().describe(
    "Optional PCB component reference; omit for CAD geometry without a PCB component"
  ),
  source_component_id: z200.string(),
  position: point3,
  rotation: point3.optional(),
  is_on_folded_board: z200.boolean().optional().describe(
    "True when position and rotation describe the assembled folded board pose. False or omitted means the flat board pose. PCB records remain flat; pcb_component_id identifies the flat mount and owning board for reversible transforms."
  ),
  size: point3.optional(),
  layer: layer_ref.optional(),
  subcircuit_id: z200.string().optional(),
  // These are all ways to generate/load the 3d model
  footprinter_string: z200.string().optional(),
  model_obj_url: z200.string().optional(),
  model_stl_url: z200.string().optional(),
  model_3mf_url: z200.string().optional(),
  model_gltf_url: z200.string().optional(),
  model_glb_url: z200.string().optional(),
  model_step_url: z200.string().optional(),
  model_wrl_url: z200.string().optional(),
  model_asset: asset.optional(),
  model_unit_to_mm_scale_factor: z200.number().optional(),
  model_board_normal_direction: z200.enum(cad_model_axis_directions).optional().describe(
    `The direction in the model's coordinate space that is considered "up" or "coming out of the board surface"`
  ),
  model_origin_position: point3.optional(),
  model_origin_alignment: z200.enum([
    "unknown",
    "center",
    "center_of_component_on_board_surface",
    "bottom_center_of_component"
  ]).optional(),
  model_object_fit: z200.enum(["contain_within_bounds", "fill_bounds"]).optional().default("contain_within_bounds"),
  model_jscad: z200.any().optional(),
  color: z200.string().trim().min(1).optional().describe(
    "Explicit color override for CAD geometry, including authored JSCAD material colors. Omit to preserve model materials."
  ),
  show_as_translucent_model: z200.boolean().optional(),
  show_as_bounding_box: z200.boolean().optional(),
  show_hidden_edges: z200.boolean().optional(),
  anchor_alignment: z200.enum(["center", "center_of_component_on_board_surface"]).optional().default("center")
}).describe("Defines CAD geometry, optionally associated with a PCB component");
expectTypesMatch(true);

// src/cad/cad_collision_error.ts
import { z as z201 } from "zod";
var cad_collision_error = base_circuit_json_error.extend({
  type: z201.literal("cad_collision_error"),
  cad_collision_error_id: getZodPrefixedIdWithDefault("cad_collision_error"),
  error_type: z201.literal("cad_collision_error").default("cad_collision_error"),
  cad_component_ids: z201.array(z201.string()).min(1),
  pcb_component_ids: z201.array(z201.string()).optional(),
  source_component_ids: z201.array(z201.string()).min(1),
  intersection_area_mm2: z201.number().finite().nonnegative(),
  threshold_area_mm2: z201.number().finite().nonnegative()
}).describe(
  "An aperture-bearing part intersects the finished enclosure. The intersection_area_mm2 is the union silhouette area of the solid intersection projected along the aperture face normal, in the right-handed Circuit JSON world frame (+X right, +Y top, +Z above). It is an area in square millimetres, not intersection volume or surface area. This indicates possible aperture misplacement, insufficient size/depth, or body clearance problems; it does not prove which cause applies."
);
expectTypesMatch(true);

// src/cad/cad_cable.ts
import { z as z202 } from "zod";
var connectorPin1Position = point3.refine(
  (point2) => [point2.x, point2.y, point2.z].every(Number.isFinite),
  "Connector pin 1 positions must be finite"
).describe(
  "Resolved pin 1 position at the connector mating face, in right-handed circuit world, millimeters: +X right, +Y top, +Z above. An absolute point, not a direction. Computed by the circuit producer from endpoint geometry. Together with the endpoint path tangent, fixes connector roll and identifies its pin 1 side; renderers must not infer it from footprints."
);
var cad_cable = z202.object({
  type: z202.literal("cad_cable"),
  cad_cable_id: z202.string(),
  name: z202.string().min(1),
  from_source_component_id: z202.string(),
  to_source_component_id: z202.string(),
  from_connector_pin1_position: connectorPin1Position.optional(),
  to_connector_pin1_position: connectorPin1Position.optional(),
  cableprinter_string: z202.string().min(1).describe(
    'Physical cable definition, e.g. "usb_c" or "jst_ph_pins6". Independent of the route.'
  ),
  path: z202.array(point3).min(2).refine(
    (path) => path.every(
      (point2, i) => [point2.x, point2.y, point2.z].every(Number.isFinite) && (i === 0 || Math.hypot(
        point2.x - path[i - 1].x,
        point2.y - path[i - 1].y,
        point2.z - path[i - 1].z
      ) > 1e-8)
    ),
    "Cable paths require finite, distinct consecutive points"
  ).describe(
    "Resolved cable centerline points in right-handed circuit world, millimeters: +X right, +Y top, +Z above. First/last samples are connector wire exits; their tangents point into/out of the cable. Includes routing/slack; renderers must not recompute the path."
  )
}).describe(
  "A physical assembly cable with a resolved 3D route. Several cables are independent cad_cable records, each with its own endpoints, definition and path. Does not imply electrical pin mapping."
);
expectTypesMatch(true);

// src/cad/cad_reference_surface.ts
import { z as z203 } from "zod";
var FRAME_TOLERANCE = 1e-6;
var unitDirection = z203.object({
  x: z203.number().finite(),
  y: z203.number().finite(),
  z: z203.number().finite()
}).refine(
  (v) => Math.abs(Math.hypot(v.x, v.y, v.z) - 1) <= FRAME_TOLERANCE,
  "Reference surface directions must be unit vectors"
);
var extent = distance.pipe(z203.number().finite().positive());
var cad_reference_surface = z203.object({
  type: z203.literal("cad_reference_surface"),
  cad_reference_surface_id: z203.string().min(1),
  source_component_id: z203.string().min(1).describe(
    "Owning assembly part's source component ID. The part may have no CAD geometry."
  ),
  name: z203.string().trim().min(1).describe(
    "Reference name, unique within the owning part, e.g. shade in STEM.shade."
  ),
  shape: z203.literal("rect"),
  center: point3.refine(
    (p) => [p.x, p.y, p.z].every(Number.isFinite),
    "Reference surface centers must be finite"
  ).describe(
    "Resolved surface center in right-handed circuit-world XYZ, millimeters: +X right, +Y top, +Z above. An absolute point after assembly placement."
  ),
  normal: unitDirection.describe(
    "Outward unit normal in circuit-world XYZ. Dimensionless direction; transform with the part's rotation, without translation."
  ),
  x_axis: unitDirection.describe(
    "In-plane unit X direction in circuit-world XYZ, perpendicular to normal. The second tangent is normal cross x_axis, giving a right-handed frame."
  ),
  width: extent.optional().describe(
    "Rectangular extent along x_axis in millimeters. Supply together with height. Omission leaves the surface's display size unspecified."
  ),
  height: extent.optional().describe(
    "Rectangular extent along normal cross x_axis in millimeters. Supply together with width."
  ),
  subcircuit_id: z203.string().optional()
}).superRefine((surface, ctx) => {
  if (surface.width === void 0 !== (surface.height === void 0))
    ctx.addIssue({
      code: z203.ZodIssueCode.custom,
      path: ["width"],
      message: "Provide width and height together"
    });
  const { normal: n, x_axis: x } = surface;
  if (Math.abs(n.x * x.x + n.y * x.y + n.z * x.z) > FRAME_TOLERANCE)
    ctx.addIssue({
      code: z203.ZodIssueCode.custom,
      path: ["x_axis"],
      message: "x_axis must be perpendicular to normal"
    });
}).describe(
  "A named assembly mounting surface with a resolved world-space frame. Reference geometry for optional visualization; does not add solid material or electrical connectivity. The producer resolves part placement independently of CAD-model offsets; renderers consume the world frame without reapplying the owning model's transform."
);
expectTypesMatch(
  true
);

// src/simulation/simulation_voltage_source.ts
import { z as z204 } from "zod";
var wave_shape = z204.enum(["sinewave", "square", "triangle", "sawtooth"]);
var percentage = z204.union([z204.string(), z204.number()]).transform((val) => {
  if (typeof val === "string") {
    if (val.endsWith("%")) {
      return parseFloat(val.slice(0, -1)) / 100;
    }
    return parseFloat(val);
  }
  return val;
}).pipe(
  z204.number().min(0, "Duty cycle must be non-negative").max(1, "Duty cycle cannot be greater than 100%")
);
var simulation_dc_voltage_source = z204.object({
  type: z204.literal("simulation_voltage_source"),
  simulation_voltage_source_id: getZodPrefixedIdWithDefault(
    "simulation_voltage_source"
  ),
  is_dc_source: z204.literal(true).optional().default(true),
  positive_source_port_id: z204.string().optional(),
  negative_source_port_id: z204.string().optional(),
  positive_source_net_id: z204.string().optional(),
  negative_source_net_id: z204.string().optional(),
  voltage,
  ac_magnitude: voltage.optional(),
  ac_phase: rotation.optional()
}).describe("Defines a DC voltage source for simulation");
var simulation_ac_voltage_source = z204.object({
  type: z204.literal("simulation_voltage_source"),
  simulation_voltage_source_id: getZodPrefixedIdWithDefault(
    "simulation_voltage_source"
  ),
  is_dc_source: z204.literal(false),
  terminal1_source_port_id: z204.string().optional(),
  terminal2_source_port_id: z204.string().optional(),
  terminal1_source_net_id: z204.string().optional(),
  terminal2_source_net_id: z204.string().optional(),
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
var simulation_voltage_source = z204.union([simulation_dc_voltage_source, simulation_ac_voltage_source]).describe("Defines a voltage source for simulation");
expectTypesMatch(true);
expectTypesMatch(true);
expectTypesMatch(true);

// src/simulation/simulation_current_source.ts
import { z as z205 } from "zod";
var percentage2 = z205.union([z205.string(), z205.number()]).transform((val) => {
  if (typeof val === "string") {
    if (val.endsWith("%")) {
      return parseFloat(val.slice(0, -1)) / 100;
    }
    return parseFloat(val);
  }
  return val;
}).pipe(
  z205.number().min(0, "Duty cycle must be non-negative").max(1, "Duty cycle cannot be greater than 100%")
);
var simulation_dc_current_source = z205.object({
  type: z205.literal("simulation_current_source"),
  simulation_current_source_id: getZodPrefixedIdWithDefault(
    "simulation_current_source"
  ),
  is_dc_source: z205.literal(true).optional().default(true),
  positive_source_port_id: z205.string().optional(),
  negative_source_port_id: z205.string().optional(),
  positive_source_net_id: z205.string().optional(),
  negative_source_net_id: z205.string().optional(),
  current,
  ac_magnitude: current.optional(),
  ac_phase: rotation.optional()
}).describe("Defines a DC current source for simulation");
var simulation_ac_current_source = z205.object({
  type: z205.literal("simulation_current_source"),
  simulation_current_source_id: getZodPrefixedIdWithDefault(
    "simulation_current_source"
  ),
  is_dc_source: z205.literal(false),
  terminal1_source_port_id: z205.string().optional(),
  terminal2_source_port_id: z205.string().optional(),
  terminal1_source_net_id: z205.string().optional(),
  terminal2_source_net_id: z205.string().optional(),
  current: current.optional(),
  frequency: frequency.optional(),
  peak_to_peak_current: current.optional(),
  wave_shape: wave_shape.optional(),
  phase: rotation.optional(),
  duty_cycle: percentage2.optional(),
  ac_magnitude: current.optional(),
  ac_phase: rotation.optional()
}).describe("Defines an AC current source for simulation");
var simulation_current_source = z205.union([simulation_dc_current_source, simulation_ac_current_source]).describe("Defines a current source for simulation");
expectTypesMatch(true);
expectTypesMatch(true);
expectTypesMatch(true);

// src/simulation/simulation_experiment.ts
import { z as z207 } from "zod";

// src/simulation/simulation_units.ts
import { z as z206 } from "zod";
var simulation_dc_sweep_unit = z206.custom(
  (dcSweepUnit) => dcSweepUnit === "V" || dcSweepUnit === "A"
);
var simulation_parameter_unit = z206.custom(
  (parameterUnit) => parameterUnit === "\u03A9" || parameterUnit === "F" || parameterUnit === "H" || parameterUnit === "V" || parameterUnit === "A"
);

// src/simulation/simulation_experiment.ts
var experiment_type = z207.union([
  z207.literal("spice_dc_sweep"),
  z207.literal("spice_dc_operating_point"),
  z207.literal("spice_transient_analysis"),
  z207.literal("spice_ac_analysis"),
  z207.literal("pcb_return_current")
]);
var spice_simulation_options = z207.object({
  method: z207.enum(["trap", "gear"]).optional(),
  reltol: z207.union([z207.number(), z207.string()]).optional(),
  abstol: z207.union([z207.number(), z207.string()]).optional(),
  vntol: z207.union([z207.number(), z207.string()]).optional()
}).describe("SPICE solver options for a simulation experiment");
var pcb_spice_channel = z207.object({
  reduction: z207.union([
    z207.literal("routed-copper"),
    z207.literal("straightened-stages")
  ]),
  sections: z207.number().int().min(1).max(128),
  lanes: z207.array(
    z207.object({
      name: z207.string().min(1),
      driver_source_port_id: z207.string().min(1),
      receiver_source_port_id: z207.string().min(1)
    })
  ).min(1).max(3),
  reference_source_port_id: z207.string().min(1),
  passive_source_component_ids: z207.array(z207.string().min(1)).optional(),
  extraction: z207.object({
    minimum_frequency_hz: z207.number().finite().positive(),
    maximum_frequency_hz: z207.number().finite().positive(),
    model_frequency_hz: z207.number().finite().positive(),
    filaments: z207.number().int().positive(),
    refinement_filaments: z207.number().int().positive(),
    convergence_tolerance: z207.number().finite().positive(),
    capacitance_tolerance: z207.number().finite().positive(),
    reciprocity_tolerance: z207.number().finite().positive(),
    dc_resistance_tolerance: z207.number().finite().positive(),
    max_panel_length_mm: z207.number().finite().positive(),
    ground_mesh_size_mm: z207.number().finite().positive().optional()
  }).refine(
    (extraction) => extraction.refinement_filaments > extraction.filaments,
    {
      path: ["refinement_filaments"],
      message: "refinement_filaments must be greater than filaments"
    }
  ),
  relative_permittivity: z207.number().finite().positive().optional(),
  via_plating_thickness_mm: z207.number().finite().positive().optional(),
  via_equivalent_width_mm: z207.number().finite().positive().optional(),
  omit_through_via_stubs: z207.boolean().optional(),
  straightened_stage_profiles: z207.record(
    z207.object({
      spacing_mm: z207.number().finite().positive(),
      relative_permittivity: z207.number().finite().positive(),
      return: z207.object({
        width_mm: z207.number().finite().positive(),
        thickness_mm: z207.number().finite().positive(),
        length_factor: z207.number().finite().positive(),
        center_y_mm: z207.number().finite(),
        center_z_mm: z207.number().finite()
      })
    })
  ).optional()
});
expectTypesMatch(true);
var simulation_experiment = z207.object({
  type: z207.literal("simulation_experiment"),
  simulation_experiment_id: getZodPrefixedIdWithDefault(
    "simulation_experiment"
  ),
  name: z207.string(),
  experiment_type,
  subcircuit_id: z207.string().optional(),
  spice_engine: z207.string().optional(),
  time_per_step: duration_ms.optional(),
  start_time_ms: ms.optional(),
  end_time_ms: ms.optional(),
  spice_options: spice_simulation_options.optional(),
  pcb_spice_channel: pcb_spice_channel.optional(),
  dc_sweep_voltage_source_id: z207.string().optional(),
  dc_sweep_current_source_id: z207.string().optional(),
  dc_sweep_start: z207.number().optional(),
  dc_sweep_stop: z207.number().optional(),
  dc_sweep_step: z207.number().refine((dcSweepStep) => dcSweepStep !== 0).optional(),
  dc_sweep_unit: simulation_dc_sweep_unit.optional(),
  ac_sweep_type: z207.enum(["linear", "decade", "octave"]).optional(),
  ac_samples_per_interval: z207.number().int().positive().optional(),
  ac_sample_count: z207.number().int().positive().optional(),
  ac_start_frequency_hz: z207.number().positive().optional(),
  ac_stop_frequency_hz: z207.number().positive().optional()
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
          code: z207.ZodIssueCode.custom,
          path: [field],
          message: `${field} is required for a DC sweep`
        });
      }
    }
    const hasVoltageSource = experiment.dc_sweep_voltage_source_id !== void 0;
    const hasCurrentSource = experiment.dc_sweep_current_source_id !== void 0;
    if (hasVoltageSource === hasCurrentSource) {
      context.addIssue({
        code: z207.ZodIssueCode.custom,
        path: ["dc_sweep_voltage_source_id"],
        message: "Exactly one DC sweep voltage or current source ID is required"
      });
    }
  }
  if (experiment.experiment_type === "spice_ac_analysis") {
    if (experiment.ac_sweep_type === void 0) {
      context.addIssue({
        code: z207.ZodIssueCode.custom,
        path: ["ac_sweep_type"],
        message: "ac_sweep_type is required for an AC analysis"
      });
    }
    if (experiment.ac_start_frequency_hz === void 0) {
      context.addIssue({
        code: z207.ZodIssueCode.custom,
        path: ["ac_start_frequency_hz"],
        message: "ac_start_frequency_hz is required for an AC analysis"
      });
    }
    if (experiment.ac_stop_frequency_hz === void 0) {
      context.addIssue({
        code: z207.ZodIssueCode.custom,
        path: ["ac_stop_frequency_hz"],
        message: "ac_stop_frequency_hz is required for an AC analysis"
      });
    }
    if (experiment.ac_sweep_type === "linear" && experiment.ac_sample_count === void 0) {
      context.addIssue({
        code: z207.ZodIssueCode.custom,
        path: ["ac_sample_count"],
        message: "ac_sample_count is required for a linear AC analysis"
      });
    }
    if ((experiment.ac_sweep_type === "decade" || experiment.ac_sweep_type === "octave") && experiment.ac_samples_per_interval === void 0) {
      context.addIssue({
        code: z207.ZodIssueCode.custom,
        path: ["ac_samples_per_interval"],
        message: "ac_samples_per_interval is required for decade and octave AC analyses"
      });
    }
  }
}).describe("Defines a simulation experiment configuration");
expectTypesMatch(true);

// src/simulation/simulation_transient_voltage_graph.ts
import { z as z209 } from "zod";

// src/simulation/simulation_parameter_sweep_coordinate.ts
import { z as z208 } from "zod";
var simulation_parameter_sweep_coordinate = z208.object({
  simulation_parameter_sweep_id: z208.string(),
  sweep_index: z208.number().int().nonnegative(),
  parameter_value: z208.number(),
  parameter_unit: simulation_parameter_unit
});
expectTypesMatch(true);

// src/simulation/simulation_transient_voltage_graph.ts
var simulation_transient_voltage_graph = z209.object({
  type: z209.literal("simulation_transient_voltage_graph"),
  simulation_transient_voltage_graph_id: getZodPrefixedIdWithDefault(
    "simulation_transient_voltage_graph"
  ),
  simulation_experiment_id: z209.string(),
  simulation_voltage_probe_id: z209.string().optional(),
  simulation_parameter_sweep_coordinate: simulation_parameter_sweep_coordinate.optional(),
  timestamps_ms: z209.array(z209.number()).optional(),
  voltage_levels: z209.array(z209.number()),
  source_component_id: z209.string().optional(),
  subcircuit_connectivity_map_key: z209.string().optional(),
  time_per_step: duration_ms,
  start_time_ms: ms,
  end_time_ms: ms,
  name: z209.string().optional(),
  color: z209.string().optional()
}).describe("Stores voltage measurements over time for a simulation");
expectTypesMatch(true);

// src/simulation/simulation_transient_current_graph.ts
import { z as z210 } from "zod";
var simulation_transient_current_graph = z210.object({
  type: z210.literal("simulation_transient_current_graph"),
  simulation_transient_current_graph_id: getZodPrefixedIdWithDefault(
    "simulation_transient_current_graph"
  ),
  simulation_experiment_id: z210.string(),
  simulation_parameter_sweep_coordinate: simulation_parameter_sweep_coordinate.optional(),
  timestamps_ms: z210.array(z210.number()).optional(),
  current_levels: z210.array(z210.number()),
  source_component_id: z210.string().optional(),
  subcircuit_connectivity_map_key: z210.string().optional(),
  time_per_step: duration_ms,
  start_time_ms: ms,
  end_time_ms: ms,
  name: z210.string().optional(),
  color: z210.string().optional()
}).describe("Stores current measurements over time for a simulation");
expectTypesMatch(true);

// src/simulation/simulation_switch.ts
import { z as z211 } from "zod";
var simulation_switch = z211.object({
  type: z211.literal("simulation_switch"),
  simulation_switch_id: getZodPrefixedIdWithDefault("simulation_switch"),
  source_component_id: z211.string().optional(),
  closes_at: ms.optional(),
  opens_at: ms.optional(),
  starts_closed: z211.boolean().optional(),
  switching_frequency: frequency.optional()
}).describe("Defines a switch for simulation timing control");
expectTypesMatch(true);

// src/simulation/simulation_voltage_probe.ts
import { z as z212 } from "zod";
var simulation_voltage_probe = z212.object({
  type: z212.literal("simulation_voltage_probe"),
  simulation_voltage_probe_id: getZodPrefixedIdWithDefault(
    "simulation_voltage_probe"
  ),
  source_component_id: z212.string().optional(),
  name: z212.string().optional(),
  signal_input_source_port_id: z212.string().optional(),
  signal_input_source_net_id: z212.string().optional(),
  reference_input_source_port_id: z212.string().optional(),
  reference_input_source_net_id: z212.string().optional(),
  subcircuit_id: z212.string().optional(),
  color: z212.string().optional()
}).describe(
  "Defines a voltage probe for simulation. If a reference input is not provided, it measures against ground. If a reference input is provided, it measures the differential voltage between two points."
).superRefine((data, ctx) => {
  const is_differential = data.reference_input_source_port_id || data.reference_input_source_net_id;
  if (is_differential) {
    const has_ports = !!data.signal_input_source_port_id || !!data.reference_input_source_port_id;
    const has_nets = !!data.signal_input_source_net_id || !!data.reference_input_source_net_id;
    if (has_ports && has_nets) {
      ctx.addIssue({
        code: z212.ZodIssueCode.custom,
        message: "Cannot mix port and net connections in a differential probe."
      });
    } else if (has_ports) {
      if (!data.signal_input_source_port_id || !data.reference_input_source_port_id) {
        ctx.addIssue({
          code: z212.ZodIssueCode.custom,
          message: "Differential port probe requires both signal_input_source_port_id and reference_input_source_port_id."
        });
      }
    } else if (has_nets) {
      if (!data.signal_input_source_net_id || !data.reference_input_source_net_id) {
        ctx.addIssue({
          code: z212.ZodIssueCode.custom,
          message: "Differential net probe requires both signal_input_source_net_id and reference_input_source_net_id."
        });
      }
    }
  } else {
    if (!!data.signal_input_source_port_id === !!data.signal_input_source_net_id) {
      ctx.addIssue({
        code: z212.ZodIssueCode.custom,
        message: "A voltage probe must have exactly one of signal_input_source_port_id or signal_input_source_net_id."
      });
    }
  }
});
expectTypesMatch(true);

// src/simulation/simulation_current_probe.ts
import { z as z213 } from "zod";
var simulation_current_probe = z213.object({
  type: z213.literal("simulation_current_probe"),
  simulation_current_probe_id: getZodPrefixedIdWithDefault(
    "simulation_current_probe"
  ),
  source_component_id: z213.string().optional(),
  name: z213.string().optional(),
  positive_source_port_id: z213.string().optional(),
  negative_source_port_id: z213.string().optional(),
  positive_source_net_id: z213.string().optional(),
  negative_source_net_id: z213.string().optional(),
  subcircuit_id: z213.string().optional(),
  color: z213.string().optional()
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
      code: z213.ZodIssueCode.custom,
      message: "Cannot mix port and net connections in a current probe."
    });
    return;
  }
  if (hasPorts) {
    if (!hasPositivePort || !hasNegativePort) {
      ctx.addIssue({
        code: z213.ZodIssueCode.custom,
        message: "Current probe using source ports requires both positive_source_port_id and negative_source_port_id."
      });
    }
    return;
  }
  if (hasNets) {
    if (!hasPositiveNet || !hasNegativeNet) {
      ctx.addIssue({
        code: z213.ZodIssueCode.custom,
        message: "Current probe using source nets requires both positive_source_net_id and negative_source_net_id."
      });
    }
    return;
  }
  ctx.addIssue({
    code: z213.ZodIssueCode.custom,
    message: "A current probe must have either positive/negative source port ids or positive/negative source net ids."
  });
});
expectTypesMatch(true);

// src/simulation/simulation_unknown_experiment_error.ts
import { z as z214 } from "zod";
var simulation_unknown_experiment_error = base_circuit_json_error.extend({
  type: z214.literal("simulation_unknown_experiment_error"),
  simulation_unknown_experiment_error_id: getZodPrefixedIdWithDefault(
    "simulation_unknown_experiment_error"
  ),
  error_type: z214.literal("simulation_unknown_experiment_error").default("simulation_unknown_experiment_error"),
  simulation_experiment_id: z214.string().optional(),
  subcircuit_id: z214.string().optional()
}).describe("An unknown error occurred during the simulation experiment.");
expectTypesMatch(true);

// src/simulation/simulation_parameter_sweep.ts
import { z as z215 } from "zod";
var simulation_parameter_type = z215.enum([
  "resistance",
  "capacitance",
  "inductance",
  "voltage",
  "current"
]);
var simulation_parameter_sweep_base = z215.object({
  type: z215.literal("simulation_parameter_sweep"),
  simulation_parameter_sweep_id: getZodPrefixedIdWithDefault(
    "simulation_parameter_sweep"
  ),
  simulation_experiment_id: z215.string(),
  name: z215.string().optional(),
  parameter_values: z215.array(z215.number()).min(1),
  parameter_unit: simulation_parameter_unit
});
var simulation_parameter_sweep = z215.discriminatedUnion("parameter_type", [
  simulation_parameter_sweep_base.extend({
    parameter_type: z215.literal("resistance"),
    resistor_source_component_id: z215.string()
  }),
  simulation_parameter_sweep_base.extend({
    parameter_type: z215.literal("capacitance"),
    capacitor_source_component_id: z215.string()
  }),
  simulation_parameter_sweep_base.extend({
    parameter_type: z215.literal("inductance"),
    inductor_source_component_id: z215.string()
  }),
  simulation_parameter_sweep_base.extend({
    parameter_type: z215.literal("voltage"),
    source_net_id: z215.string()
  }),
  simulation_parameter_sweep_base.extend({
    parameter_type: z215.literal("current"),
    current_source_component_id: z215.string()
  })
]).describe("Repeats a simulation experiment over component parameter values");
expectTypesMatch(
  true
);

// src/simulation/simulation_dc_operating_point_voltage.ts
import { z as z216 } from "zod";
var simulation_dc_operating_point_voltage = z216.object({
  type: z216.literal("simulation_dc_operating_point_voltage"),
  simulation_dc_operating_point_voltage_id: getZodPrefixedIdWithDefault(
    "simulation_dc_operating_point_voltage"
  ),
  simulation_experiment_id: z216.string(),
  simulation_parameter_sweep_coordinate: simulation_parameter_sweep_coordinate.optional(),
  simulation_voltage_probe_id: z216.string(),
  voltage: z216.number(),
  name: z216.string().optional(),
  color: z216.string().optional()
});
expectTypesMatch(true);

// src/simulation/simulation_dc_operating_point_current.ts
import { z as z217 } from "zod";
var simulation_dc_operating_point_current = z217.object({
  type: z217.literal("simulation_dc_operating_point_current"),
  simulation_dc_operating_point_current_id: getZodPrefixedIdWithDefault(
    "simulation_dc_operating_point_current"
  ),
  simulation_experiment_id: z217.string(),
  simulation_parameter_sweep_coordinate: simulation_parameter_sweep_coordinate.optional(),
  simulation_current_probe_id: z217.string(),
  current: z217.number(),
  name: z217.string().optional(),
  color: z217.string().optional()
});
expectTypesMatch(true);

// src/simulation/simulation_dc_sweep_voltage_graph.ts
import { z as z218 } from "zod";
var simulation_dc_sweep_voltage_graph = z218.object({
  type: z218.literal("simulation_dc_sweep_voltage_graph"),
  simulation_dc_sweep_voltage_graph_id: getZodPrefixedIdWithDefault(
    "simulation_dc_sweep_voltage_graph"
  ),
  simulation_experiment_id: z218.string(),
  simulation_parameter_sweep_coordinate: simulation_parameter_sweep_coordinate.optional(),
  simulation_voltage_probe_id: z218.string(),
  sweep_values: z218.array(z218.number()),
  sweep_unit: simulation_dc_sweep_unit,
  voltage_levels: z218.array(z218.number()),
  name: z218.string().optional(),
  color: z218.string().optional()
}).refine(
  (graph) => graph.sweep_values.length === graph.voltage_levels.length,
  {
    message: "sweep_values and voltage_levels must have the same length"
  }
);
expectTypesMatch(true);

// src/simulation/simulation_dc_sweep_current_graph.ts
import { z as z219 } from "zod";
var simulation_dc_sweep_current_graph = z219.object({
  type: z219.literal("simulation_dc_sweep_current_graph"),
  simulation_dc_sweep_current_graph_id: getZodPrefixedIdWithDefault(
    "simulation_dc_sweep_current_graph"
  ),
  simulation_experiment_id: z219.string(),
  simulation_parameter_sweep_coordinate: simulation_parameter_sweep_coordinate.optional(),
  simulation_current_probe_id: z219.string(),
  sweep_values: z219.array(z219.number()),
  sweep_unit: simulation_dc_sweep_unit,
  current_levels: z219.array(z219.number()),
  name: z219.string().optional(),
  color: z219.string().optional()
}).refine(
  (graph) => graph.sweep_values.length === graph.current_levels.length,
  {
    message: "sweep_values and current_levels must have the same length"
  }
);
expectTypesMatch(true);

// src/simulation/simulation_ac_sweep_voltage_graph.ts
import { z as z221 } from "zod";

// src/simulation/simulation_complex_sample.ts
import { z as z220 } from "zod";
var simulation_complex_sample = z220.object({
  re: z220.number(),
  im: z220.number()
});
expectTypesMatch(true);

// src/simulation/simulation_ac_sweep_voltage_graph.ts
var simulation_ac_sweep_voltage_graph = z221.object({
  type: z221.literal("simulation_ac_sweep_voltage_graph"),
  simulation_ac_sweep_voltage_graph_id: getZodPrefixedIdWithDefault(
    "simulation_ac_sweep_voltage_graph"
  ),
  simulation_experiment_id: z221.string(),
  simulation_parameter_sweep_coordinate: simulation_parameter_sweep_coordinate.optional(),
  simulation_voltage_probe_id: z221.string(),
  frequencies_hz: z221.array(z221.number()),
  complex_voltages: z221.array(simulation_complex_sample),
  name: z221.string().optional(),
  color: z221.string().optional()
}).refine(
  (graph) => graph.frequencies_hz.length === graph.complex_voltages.length,
  {
    message: "frequencies_hz and complex_voltages must have the same length"
  }
);
expectTypesMatch(true);

// src/simulation/simulation_ac_sweep_current_graph.ts
import { z as z222 } from "zod";
var simulation_ac_sweep_current_graph = z222.object({
  type: z222.literal("simulation_ac_sweep_current_graph"),
  simulation_ac_sweep_current_graph_id: getZodPrefixedIdWithDefault(
    "simulation_ac_sweep_current_graph"
  ),
  simulation_experiment_id: z222.string(),
  simulation_parameter_sweep_coordinate: simulation_parameter_sweep_coordinate.optional(),
  simulation_current_probe_id: z222.string(),
  frequencies_hz: z222.array(z222.number()),
  complex_currents: z222.array(simulation_complex_sample),
  name: z222.string().optional(),
  color: z222.string().optional()
}).refine(
  (graph) => graph.frequencies_hz.length === graph.complex_currents.length,
  {
    message: "frequencies_hz and complex_currents must have the same length"
  }
);
expectTypesMatch(true);

// src/simulation/simulation_op_amp.ts
import { z as z223 } from "zod";
var simulation_op_amp = z223.object({
  type: z223.literal("simulation_op_amp"),
  simulation_op_amp_id: getZodPrefixedIdWithDefault("simulation_op_amp"),
  source_component_id: z223.string().optional(),
  inverting_input_source_port_id: z223.string(),
  non_inverting_input_source_port_id: z223.string(),
  output_source_port_id: z223.string(),
  positive_supply_source_port_id: z223.string(),
  negative_supply_source_port_id: z223.string()
}).describe("Defines a simple ideal operational amplifier for simulation");
expectTypesMatch(true);

// src/simulation/simulation_spice_subcircuit.ts
import { z as z224 } from "zod";
var simulation_spice_subcircuit = z224.object({
  type: z224.literal("simulation_spice_subcircuit"),
  simulation_spice_subcircuit_id: getZodPrefixedIdWithDefault(
    "simulation_spice_subcircuit"
  ),
  source_component_id: z224.string(),
  spice_pin_to_source_port_map: z224.record(z224.string(), z224.string()),
  subcircuit_source: z224.string()
}).describe("Defines a custom SPICE subcircuit model for simulation");
expectTypesMatch(
  true
);

// src/simulation/simulation_oscilloscope_trace.ts
import { z as z225 } from "zod";
var hasValue = (value) => value !== void 0;
var simulation_oscilloscope_trace = z225.object({
  type: z225.literal("simulation_oscilloscope_trace"),
  simulation_oscilloscope_trace_id: getZodPrefixedIdWithDefault(
    "simulation_oscilloscope_trace"
  ),
  simulation_transient_voltage_graph_id: z225.string().optional(),
  simulation_transient_current_graph_id: z225.string().optional(),
  simulation_voltage_probe_id: z225.string().optional(),
  simulation_current_probe_id: z225.string().optional(),
  display_name: z225.string().optional(),
  color: z225.string().optional(),
  display_center_value: z225.number().optional(),
  display_center_offset_divs: z225.number().optional(),
  volts_per_div: z225.number().positive().optional(),
  amps_per_div: z225.number().positive().optional()
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
      code: z225.ZodIssueCode.custom,
      message: "An oscilloscope trace must reference exactly one voltage graph, current graph, voltage probe, or current probe."
    });
  }
  if (voltageReferences > 0 && data.amps_per_div !== void 0) {
    ctx.addIssue({
      code: z225.ZodIssueCode.custom,
      message: "Voltage oscilloscope traces must use volts_per_div, not amps_per_div."
    });
  }
  if (currentReferences > 0 && data.volts_per_div !== void 0) {
    ctx.addIssue({
      code: z225.ZodIssueCode.custom,
      message: "Current oscilloscope traces must use amps_per_div, not volts_per_div."
    });
  }
});
expectTypesMatch(true);

// src/simulation/simulation_ibis_model.ts
import { z as z226 } from "zod";
var ibisAssetPath = z226.string().min(1).regex(/^(?!\s|[a-z][a-z\d+.-]*:|[/\\])[^\\\u0000-\u001f\u007f]+$/i);
var simulation_ibis_model = z226.object({
  type: z226.literal("simulation_ibis_model"),
  simulation_ibis_model_id: getZodPrefixedIdWithDefault(
    "simulation_ibis_model"
  ),
  source_component_id: z226.string().min(1),
  // Consumers must still apply their own fetch policy to prevent SSRF.
  ibis_model_asset: asset.extend({
    project_relative_path: ibisAssetPath,
    url: z226.string().url().regex(/^https?:\/\//i).or(ibisAssetPath)
  }).describe(
    "Reference to the .ibs file containing the vendor's IBIS models"
  ),
  ibis_component_name: z226.string().min(1).describe("Name of the [Component] section in the IBIS file"),
  ibis_pin_name_to_source_port_id: z226.record(z226.string().min(1), z226.string().min(1)).refine(
    (pins) => Object.keys(pins).length > 0,
    "At least one physical IBIS pin is required"
  ).describe(
    "Maps pin names from the IBIS [Pin] table, such as A1 or 12, to physical source_port_id values"
  ),
  ibis_pin_name_to_model_name: z226.record(z226.string().min(1), z226.string().min(1)).optional().describe(
    "Maps an IBIS pin name to the selected [Model] name when its [Model Selector] has multiple buffers"
  ),
  ibis_pin_name_to_reference_source_port_ids: z226.record(
    z226.string().min(1),
    z226.object({
      pullup_reference_source_port_id: z226.string().min(1).optional(),
      pulldown_reference_source_port_id: z226.string().min(1).optional(),
      power_clamp_reference_source_port_id: z226.string().min(1).optional(),
      ground_clamp_reference_source_port_id: z226.string().min(1).optional(),
      external_reference_source_port_id: z226.string().min(1).optional()
    }).strict()
  ).optional().describe(
    "Maps each IBIS signal pin name to the physical source ports used as its buffer supply/clamp references"
  ),
  model_value_corner: z226.union([z226.literal("typical"), z226.literal("minimum"), z226.literal("maximum")]).describe(
    "Selects the typ, min, or max column of numerical data in the IBIS model"
  ),
  include_package_parasitics: z226.boolean().describe(
    "Whether the runner includes the IBIS vendor's package resistance, inductance, and capacitance"
  )
}).superRefine((model, context) => {
  const boundPins = new Set(
    Object.keys(model.ibis_pin_name_to_source_port_id)
  );
  for (const field of [
    "ibis_pin_name_to_model_name",
    "ibis_pin_name_to_reference_source_port_ids"
  ]) {
    for (const pin of Object.keys(model[field] ?? {})) {
      if (!boundPins.has(pin)) {
        context.addIssue({
          code: z226.ZodIssueCode.custom,
          path: [field, pin],
          message: `IBIS pin "${pin}" must be bound in ibis_pin_name_to_source_port_id`
        });
      }
    }
  }
}).describe(
  "Attaches an IBIS component and its physical pin bindings to a source component"
);

// src/simulation/simulation_ibis_pin_state.ts
import { z as z227 } from "zod";
var simulation_ibis_pin_state = z227.object({
  type: z227.literal("simulation_ibis_pin_state"),
  simulation_ibis_pin_state_id: getZodPrefixedIdWithDefault(
    "simulation_ibis_pin_state"
  ),
  simulation_experiment_id: z227.string().min(1),
  source_port_id: z227.string().min(1),
  is_output: z227.boolean().describe(
    "True selects output mode; false selects input mode for this experiment"
  ),
  is_output_enabled: z227.boolean().optional()
}).superRefine((pin, context) => {
  if (pin.is_output && pin.is_output_enabled === void 0 || !pin.is_output && pin.is_output_enabled !== void 0) {
    context.addIssue({
      code: z227.ZodIssueCode.custom,
      path: ["is_output_enabled"],
      message: "Only output pins require an explicit is_output_enabled boolean"
    });
  }
}).describe(
  "Declares an IBIS pin's direction and output-enable state for one experiment"
);

// src/simulation/simulation_digital_stimulus.ts
import { z as z228 } from "zod";
var MAX_PATTERN_BITS = 65536;
var simulation_digital_stimulus = z228.object({
  type: z228.literal("simulation_digital_stimulus"),
  simulation_digital_stimulus_id: getZodPrefixedIdWithDefault(
    "simulation_digital_stimulus"
  ),
  name: z228.string().min(1),
  simulation_experiment_id: z228.string().min(1),
  source_port_id: z228.string().min(1),
  bit_duration_ms: ms.refine((milliseconds) => milliseconds > 0),
  start_time_ms: ms.refine((milliseconds) => milliseconds >= 0),
  initial_state: z228.union([z228.literal(0), z228.literal(1)]),
  inverted: z228.boolean(),
  transmission_pattern: z228.object({
    transmission_type: z228.literal("bits"),
    bits: z228.string().max(MAX_PATTERN_BITS).regex(/^[01]+$/).or(
      z228.array(z228.union([z228.literal(0), z228.literal(1)])).min(1).max(MAX_PATTERN_BITS)
    ),
    repeat: z228.boolean()
  }).strict()
}).describe(
  "Declares a digital transmission pattern and bit duration in milliseconds for a physical source port"
);

// src/simulation/simulation_eye_diagram.ts
import { z as z229 } from "zod";
var simulation_eye_diagram = z229.object({
  type: z229.literal("simulation_eye_diagram"),
  simulation_eye_diagram_id: getZodPrefixedIdWithDefault(
    "simulation_eye_diagram"
  ),
  name: z229.string().min(1),
  simulation_experiment_id: z229.string().min(1),
  simulation_voltage_probe_id: z229.string().min(1),
  unit_interval_ms: ms.refine((milliseconds) => milliseconds > 0),
  time_origin_ms: ms,
  start_time_ms: ms.refine((milliseconds) => milliseconds >= 0).optional(),
  end_time_ms: ms.refine((milliseconds) => milliseconds > 0).optional()
}).superRefine((eye, context) => {
  if (eye.start_time_ms !== void 0 && eye.end_time_ms !== void 0 && eye.start_time_ms >= eye.end_time_ms) {
    context.addIssue({
      code: z229.ZodIssueCode.custom,
      path: ["end_time_ms"],
      message: "Eye gate end must follow its start"
    });
  }
}).describe(
  "Declares probe-bound eye folding, fixed origin and optional measurement gate in milliseconds"
);

// src/simulation/simulation_return_current_contact.ts
import { z as z230 } from "zod";
var contact_position = z230.object({
  x: z230.number().finite(),
  y: z230.number().finite(),
  layer: layer_ref
});
var simulation_return_current_contact = z230.discriminatedUnion("contact_type", [
  contact_position.extend({
    contact_type: z230.literal("pcb_port"),
    pcb_port_id: z230.string().min(1)
  }),
  contact_position.extend({
    contact_type: z230.literal("pcb_via"),
    pcb_via_id: z230.string().min(1)
  }),
  contact_position.extend({
    contact_type: z230.literal("pcb_copper_pour"),
    pcb_copper_pour_id: z230.string().min(1)
  })
]).describe("Identifies the reference conductor at a return-current contact");
expectTypesMatch(true);

// src/simulation/simulation_terminal_port.ts
import { z as z231 } from "zod";
var simulation_terminal_port = z231.object({
  signal_pcb_port_id: z231.string().min(1),
  reference_pcb_port_id: z231.string().min(1).optional(),
  reference_layer: layer_ref,
  resistance: z231.number().finite().positive()
}).describe(
  "A two-terminal return-current excitation port with resistance in ohms"
);
expectTypesMatch(true);

// src/simulation/simulation_return_current_excitation.ts
import { z as z232 } from "zod";
var simulation_return_current_excitation = z232.object({
  type: z232.literal("simulation_return_current_excitation"),
  simulation_return_current_excitation_id: getZodPrefixedIdWithDefault(
    "simulation_return_current_excitation"
  ),
  simulation_experiment_id: z232.string().min(1),
  pcb_trace_id: z232.string().min(1),
  ground_source_net_id: z232.string().min(1),
  current: z232.number().finite(),
  return_source: simulation_return_current_contact,
  return_sink: simulation_return_current_contact,
  source_port: simulation_terminal_port.optional(),
  load_port: simulation_terminal_port.optional()
}).describe(
  "Excites a signal trace with signed current in amperes, peak for AC; return_source is near the load and return_sink near the driver for positive current"
);
expectTypesMatch(true);

// src/simulation/simulation_pcb_return_current_result.ts
import { z as z233 } from "zod";
var simulation_pcb_return_current_result = z233.object({
  type: z233.literal("simulation_pcb_return_current_result"),
  simulation_pcb_return_current_result_id: getZodPrefixedIdWithDefault(
    "simulation_pcb_return_current_result"
  ),
  simulation_experiment_id: z233.string().min(1),
  pcb_board_id: z233.string().min(1),
  simulation_return_current_excitation_ids: z233.array(z233.string().min(1)).min(1).refine(
    (ids) => new Set(ids).size === ids.length,
    "Excitation IDs must be unique"
  ),
  frequency_hz: z233.number().finite().positive().optional()
}).describe(
  "A PCB return-current result at one frequency, or a frequency-independent result when frequency_hz is absent"
);
expectTypesMatch(true);

// src/simulation/simulation_return_current_asset.ts
import { z as z234 } from "zod";
function createSimulationReturnCurrentAssetSchema(mimetypes) {
  return asset.extend({
    project_relative_path: z234.string().min(1),
    url: z234.string().url()
  }).superRefine((value, context) => {
    if (!mimetypes.includes(value.mimetype)) {
      context.addIssue({
        code: z234.ZodIssueCode.custom,
        path: ["mimetype"],
        message: `Expected one of: ${mimetypes.join(", ")}`
      });
    }
    if (value.url.startsWith("data:")) {
      const mediaType = /^data:([^;,]*)(?:;[^,]*)?,/i.exec(value.url)?.[1];
      if (mediaType?.toLowerCase() !== value.mimetype) {
        context.addIssue({
          code: z234.ZodIssueCode.custom,
          path: ["url"],
          message: "Data URL media type must match asset.mimetype"
        });
      }
    }
  });
}
var simulation_return_current_field_asset = createSimulationReturnCurrentAssetSchema([
  "application/json",
  "application/gzip"
]);
var simulation_return_current_image_asset = createSimulationReturnCurrentAssetSchema(["image/png", "image/webp"]);

// src/simulation/simulation_pcb_return_current_field.ts
import { z as z235 } from "zod";
var simulation_pcb_return_current_field = z235.object({
  type: z235.literal("simulation_pcb_return_current_field"),
  simulation_pcb_return_current_field_id: getZodPrefixedIdWithDefault(
    "simulation_pcb_return_current_field"
  ),
  simulation_pcb_return_current_result_id: z235.string().min(1),
  layer: layer_ref,
  source_net_id: z235.string().min(1),
  field_type: z235.enum(["real", "complex_phasor"]),
  min_x: z235.number().finite(),
  min_y: z235.number().finite(),
  columns: z235.number().int().positive().safe(),
  rows: z235.number().int().positive().safe(),
  cell_width: z235.number().finite().positive(),
  cell_height: z235.number().finite().positive(),
  copper_thickness: z235.number().finite().positive(),
  data_format: z235.literal("simulation_return_current_grid_json_v1"),
  field_asset: simulation_return_current_field_asset
}).superRefine((field, context) => {
  if (!Number.isSafeInteger(field.columns * field.rows)) {
    context.addIssue({
      code: z235.ZodIssueCode.custom,
      path: ["columns"],
      message: "The grid cell count must be a safe integer"
    });
  }
}).describe(
  "A sampled sheet-current field in A/mm, using plain or gzipped JSON Asset URLs; dimensions are PCB millimeters"
);
expectTypesMatch(true);

// src/simulation/simulation_return_current_grid_json.ts
import { z as z236 } from "zod";
var channel = z236.array(z236.number().finite().nullable()).min(1);
var simulation_return_current_grid_json = z236.discriminatedUnion("field_type", [
  z236.object({
    field_type: z236.literal("real"),
    sheet_current_x: channel,
    sheet_current_y: channel
  }),
  z236.object({
    field_type: z236.literal("complex_phasor"),
    sheet_current_x_real: channel,
    sheet_current_x_imag: channel,
    sheet_current_y_real: channel,
    sheet_current_y_imag: channel
  })
]).superRefine((grid, context) => {
  const channels = grid.field_type === "real" ? [grid.sheet_current_x, grid.sheet_current_y] : [
    grid.sheet_current_x_real,
    grid.sheet_current_x_imag,
    grid.sheet_current_y_real,
    grid.sheet_current_y_imag
  ];
  const first = channels[0];
  if (channels.some((values) => values.length !== first.length)) {
    context.addIssue({
      code: z236.ZodIssueCode.custom,
      message: "Current channels must have equal lengths"
    });
    return;
  }
  for (let index = 0; index < first.length; index++) {
    const masked = first[index] === null;
    if (channels.some((values) => values[index] === null !== masked)) {
      context.addIssue({
        code: z236.ZodIssueCode.custom,
        message: `Cell ${index} must be null in every channel or finite in every channel`
      });
      return;
    }
  }
}).describe(
  "Decoded real or complex sheet-current arrays with a shared conductor mask"
);
expectTypesMatch(true);
function getSimulationReturnCurrentGridJsonSchema(field) {
  const count = field.columns * field.rows;
  if (!Number.isSafeInteger(field.columns) || field.columns <= 0 || !Number.isSafeInteger(field.rows) || field.rows <= 0 || !Number.isSafeInteger(count))
    throw new Error("Grid dimensions must be positive safe integers");
  return simulation_return_current_grid_json.superRefine((grid, context) => {
    if (grid.field_type !== field.field_type) {
      context.addIssue({
        code: z236.ZodIssueCode.custom,
        path: ["field_type"],
        message: "Decoded field_type must match the parent field"
      });
    }
    const first = grid.field_type === "real" ? grid.sheet_current_x : grid.sheet_current_x_real;
    if (first.length !== count) {
      context.addIssue({
        code: z236.ZodIssueCode.custom,
        message: `Each current channel must have ${count} entries (columns * rows)`
      });
    }
  });
}

// src/simulation/simulation_pcb_return_current_heatmap.ts
import { z as z237 } from "zod";
var simulation_pcb_return_current_heatmap = z237.object({
  type: z237.literal("simulation_pcb_return_current_heatmap"),
  simulation_pcb_return_current_heatmap_id: getZodPrefixedIdWithDefault(
    "simulation_pcb_return_current_heatmap"
  ),
  simulation_pcb_return_current_result_id: z237.string().min(1),
  layer: layer_ref,
  source_net_id: z237.string().min(1),
  min_x: z237.number().finite(),
  min_y: z237.number().finite(),
  max_x: z237.number().finite(),
  max_y: z237.number().finite(),
  image_asset: simulation_return_current_image_asset
}).superRefine((heatmap, context) => {
  for (const axis of ["x", "y"]) {
    if (heatmap[`max_${axis}`] <= heatmap[`min_${axis}`]) {
      context.addIssue({
        code: z237.ZodIssueCode.custom,
        path: [`max_${axis}`],
        message: "Heatmap bounds must have positive width and height"
      });
    }
  }
}).describe(
  "A transparent PNG/WebP current-density overlay in A/mm\xB2; the top-left pixel maps to (min_x, max_y)"
);
expectTypesMatch(true);

// src/simulation/simulation_pcb_return_current_marker.ts
import { z as z238 } from "zod";
var marker_base = z238.object({
  type: z238.literal("simulation_pcb_return_current_marker"),
  simulation_pcb_return_current_marker_id: getZodPrefixedIdWithDefault(
    "simulation_pcb_return_current_marker"
  ),
  simulation_pcb_return_current_result_id: z238.string().min(1),
  role: z238.enum([
    "signal_source",
    "signal_load",
    "return_source",
    "return_sink",
    "signal_transition",
    "return_transition"
  ]),
  label: z238.string().optional(),
  label_x: z238.number().finite().optional(),
  label_y: z238.number().finite().optional()
});
var simulation_pcb_return_current_marker = z238.discriminatedUnion("target_type", [
  marker_base.extend({
    target_type: z238.literal("pcb_port"),
    pcb_port_id: z238.string().min(1),
    layer: layer_ref
  }),
  marker_base.extend({
    target_type: z238.literal("pcb_via"),
    pcb_via_id: z238.string().min(1),
    from_layer: layer_ref,
    to_layer: layer_ref
  })
]).superRefine((marker, context) => {
  if (marker.label_x === void 0 !== (marker.label_y === void 0)) {
    context.addIssue({
      code: z238.ZodIssueCode.custom,
      path: ["label_x"],
      message: "label_x and label_y must be provided together"
    });
  }
  if (marker.target_type === "pcb_via" && marker.from_layer === marker.to_layer) {
    context.addIssue({
      code: z238.ZodIssueCode.custom,
      path: ["to_layer"],
      message: "A via transition must connect distinct layers"
    });
  }
}).describe(
  "A signal/return port or via highlight; markers do not assert measured via-transfer currents"
);
expectTypesMatch(true);

// src/any_circuit_element.ts
import { z as z243 } from "zod";

// src/drawing/drawing_page.ts
import { z as z240 } from "zod";

// src/drawing/drawing_page_size.ts
import { z as z239 } from "zod";
var drawingPageSizes = {
  iso_a0: [1189, 841],
  iso_a1: [841, 594],
  iso_a2: [594, 420],
  iso_a3: [420, 297],
  iso_a4: [297, 210],
  ansi_a: [279.4, 215.9],
  ansi_b: [431.8, 279.4],
  ansi_c: [558.8, 431.8],
  ansi_d: [863.6, 558.8],
  ansi_e: [1117.6, 863.6]
};
var drawing_page_size = z239.enum([
  "iso_a0",
  "iso_a1",
  "iso_a2",
  "iso_a3",
  "iso_a4",
  "ansi_a",
  "ansi_b",
  "ansi_c",
  "ansi_d",
  "ansi_e"
]);
function getDrawingPageDimensions(size2, orientation = "landscape") {
  const [width, height] = drawingPageSizes[size2];
  return orientation === "portrait" ? { width: height, height: width } : { width, height };
}

// src/drawing/drawing_page.ts
var drawing_page = z240.object({
  type: z240.literal("drawing_page"),
  drawing_page_id: z240.string().min(1),
  name: z240.string().optional(),
  display_name: z240.string().optional(),
  page_size: drawing_page_size.optional(),
  orientation: z240.enum(["landscape", "portrait"]).optional(),
  width: z240.number().finite().positive(),
  height: z240.number().finite().positive()
}).superRefine((page, ctx) => {
  if (!page.page_size) {
    if (page.orientation)
      ctx.addIssue({
        code: "custom",
        path: ["orientation"],
        message: "Orientation requires page_size; custom pages use explicit dimensions"
      });
    return;
  }
  const expected = getDrawingPageDimensions(page.page_size, page.orientation);
  if (Math.abs(page.width - expected.width) > 1e-6 || Math.abs(page.height - expected.height) > 1e-6)
    ctx.addIssue({
      code: "custom",
      path: ["page_size"],
      message: "Dimensions must match the named sheet size and orientation"
    });
}).describe(
  "A paper-space drawing page containing configured part views. Dimensions are mm."
);
expectTypesMatch(true);

// src/drawing/drawing_part_view.ts
import { z as z241 } from "zod";
var drawing_part_view_direction = z241.enum([
  "x_positive",
  "x_negative",
  "y_positive",
  "y_negative",
  "z_positive",
  "z_negative",
  "isometric"
]);
var drawing_section_plane = z241.object({
  axis: z241.enum(["x", "y", "z"]),
  offset: z241.number().finite(),
  keep_side: z241.enum(["less", "greater"]),
  hatch_spacing: z241.number().finite().positive().optional()
});
var drawing_part_view = z241.object({
  type: z241.literal("drawing_part_view"),
  drawing_part_view_id: z241.string().min(1),
  drawing_page_id: z241.string().min(1),
  source_group_id: z241.string().min(1).optional(),
  source_component_ids: z241.array(z241.string().min(1)).optional(),
  name: z241.string().optional(),
  display_name: z241.string().optional(),
  direction: drawing_part_view_direction,
  center: z241.object({ x: z241.number().finite(), y: z241.number().finite() }),
  width: z241.number().finite().positive(),
  height: z241.number().finite().positive(),
  scale: z241.number().finite().positive().optional(),
  show_hidden_edges: z241.boolean().optional(),
  section: drawing_section_plane.optional()
}).describe(
  "A configured orthographic view of selected assembly geometry. Paper coordinates are mm, origin at sheet center, +X right/+Y up. Directions and section planes use CAD world coordinates in mm with +Z up."
);
expectTypesMatch(
  true
);
expectTypesMatch(true);

// src/drawing/drawing_page_title_block.ts
import { z as z242 } from "zod";
var drawing_page_title_block = z242.object({
  type: z242.literal("drawing_page_title_block"),
  drawing_page_title_block_id: z242.string().min(1),
  drawing_page_id: z242.string().min(1),
  title: z242.string().min(1),
  legal_owner: z242.string().optional(),
  identification_number: z242.string().optional(),
  revision_index: z242.string().optional(),
  date_of_issue: z242.string().optional(),
  creator: z242.string().optional(),
  approval_person: z242.string().optional(),
  sheet_number: z242.number().int().positive().optional(),
  number_of_sheets: z242.number().int().positive().optional()
}).refine(
  (block) => block.sheet_number == null || block.number_of_sheets == null || block.sheet_number <= block.number_of_sheets,
  {
    message: "sheet_number must not exceed number_of_sheets",
    path: ["sheet_number"]
  }
);
expectTypesMatch(true);

// src/any_circuit_element.ts
var any_circuit_element = z243.union([
  drawing_page,
  drawing_page_title_block,
  drawing_part_view,
  source_runtime_error,
  source_datasheet,
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
  source_component_availability_warning,
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
  pcb_trace_style_warning,
  pcb_trace_too_long_warning,
  pcb_trace_too_long_error,
  pcb_bus_length_skew_error,
  pcb_trace_too_many_vias_warning,
  pcb_via,
  pcb_smtpad,
  pcb_solder_paste,
  pcb_soldermask_opening,
  pcb_board,
  pcb_stackup,
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
  pcb_bus_routing_constraint_error,
  pcb_bus_routing_constraint_warning,
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
  schematic_sheet_styling_warning,
  schematic_missing_sheet_warning,
  schematic_element_outside_sheet_warning,
  schematic_graphic,
  schematic_group,
  schematic_sheet,
  schematic_table,
  schematic_table_cell,
  cad_component,
  cad_cable,
  cad_reference_surface,
  cad_collision_error,
  simulation_voltage_source,
  simulation_current_source,
  simulation_experiment,
  simulation_ibis_model,
  simulation_ibis_pin_state,
  simulation_digital_stimulus,
  simulation_eye_diagram,
  simulation_return_current_excitation,
  simulation_pcb_return_current_result,
  simulation_pcb_return_current_field,
  simulation_pcb_return_current_heatmap,
  simulation_pcb_return_current_marker,
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
  cad_cable,
  cad_collision_error,
  cad_component,
  cad_model_axis_directions,
  cad_model_formats,
  cad_reference_surface,
  capacitance,
  circle_shape,
  circuit_json_footprint_load_error,
  current,
  distance,
  drawingPageSizes,
  drawing_page,
  drawing_page_size,
  drawing_page_title_block,
  drawing_part_view,
  drawing_part_view_direction,
  drawing_section_plane,
  duration_ms,
  experiment_type,
  external_footprint_load_error,
  frequency,
  getDrawingPageDimensions,
  getRotationBetweenPcbPin1Locations,
  getSimulationReturnCurrentGridJsonSchema,
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
  pcb_bus_routing_constraint_error,
  pcb_bus_routing_constraint_warning,
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
  pcb_spice_channel,
  pcb_stackup,
  pcb_stackup_copper_layer,
  pcb_stackup_dielectric_layer,
  pcb_stackup_layer,
  pcb_stackup_soldermask_layer,
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
  pcb_trace_style_warning,
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
  polygon_shape,
  port_arrangement,
  position,
  position3,
  rect_shape,
  resistance,
  ring,
  rotated_rect_shape,
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
  schematic_sheet_styling_warning,
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
  simulation_digital_stimulus,
  simulation_experiment,
  simulation_eye_diagram,
  simulation_ibis_model,
  simulation_ibis_pin_state,
  simulation_op_amp,
  simulation_oscilloscope_trace,
  simulation_parameter_sweep,
  simulation_parameter_sweep_coordinate,
  simulation_parameter_type,
  simulation_parameter_unit,
  simulation_pcb_return_current_field,
  simulation_pcb_return_current_heatmap,
  simulation_pcb_return_current_marker,
  simulation_pcb_return_current_result,
  simulation_return_current_contact,
  simulation_return_current_excitation,
  simulation_return_current_field_asset,
  simulation_return_current_grid_json,
  simulation_return_current_image_asset,
  simulation_spice_subcircuit,
  simulation_switch,
  simulation_terminal_port,
  simulation_transient_current_graph,
  simulation_transient_voltage_graph,
  simulation_unknown_experiment_error,
  simulation_voltage_probe,
  simulation_voltage_source,
  size,
  source_ambiguous_port_reference,
  source_board,
  source_bus,
  source_component_availability_warning,
  source_component_base,
  source_component_internal_connection,
  source_component_misconfigured_error,
  source_component_pins_underspecified_warning,
  source_confusing_net_name_warning,
  source_datasheet,
  source_failed_to_create_component_error,
  source_group,
  source_i2c_misconfigured_error,
  source_interconnect,
  source_invalid_component_property_error,
  source_manually_placed_via,
  source_missing_manufacturer_part_number_warning,
  source_missing_property_error,
  source_motor,
  source_net,
  source_no_ground_pin_defined_warning,
  source_no_power_pin_defined_warning,
  source_part_not_found_warning,
  source_pcb_ground_plane,
  source_pin_attributes,
  source_pin_missing_trace_warning,
  source_pin_must_be_connected_error,
  source_port,
  source_printed_part,
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
  source_subassembly,
  source_trace,
  source_trace_not_connected_error,
  source_unnamed_trace_warning,
  spice_simulation_options,
  standard_shape,
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