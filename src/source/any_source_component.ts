import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import {
  type SourceFailedToCreateComponentError,
  source_failed_to_create_component_error,
} from "./source_failed_to_create_component_error"
import {
  type SourceMissingPropertyError,
  source_missing_property_error,
} from "./source_missing_property_error"
import {
  type SourcePinMissingTraceWarning,
  source_pin_missing_trace_warning,
} from "./source_pin_missing_trace_warning"
import {
  type SourceProjectMetadata,
  source_project_metadata,
} from "./source_project_metadata"
import {
  type SourcePropertyIgnoredWarning,
  source_property_ignored_warning,
} from "./source_property_ignored_warning"
import {
  type SourceSimpleBattery,
  source_simple_battery,
} from "./source_simple_battery"
import {
  type SourceSimpleCapacitor,
  source_simple_capacitor,
} from "./source_simple_capacitor"
import { type SourceSimpleChip, source_simple_chip } from "./source_simple_chip"
import {
  type SourceSimpleCrystal,
  source_simple_crystal,
} from "./source_simple_crystal"
import {
  type SourceSimpleDiode,
  source_simple_diode,
} from "./source_simple_diode"
import { type SourceSimpleFuse, source_simple_fuse } from "./source_simple_fuse"
import {
  type SourceSimpleGround,
  source_simple_ground,
} from "./source_simple_ground"
import {
  type SourceSimpleInductor,
  source_simple_inductor,
} from "./source_simple_inductor"
import { type SourceSimpleLed, source_simple_led } from "./source_simple_led"
import {
  type SourceSimpleMosfet,
  source_simple_mosfet,
} from "./source_simple_mosfet"
import {
  type SourceSimplePinHeader,
  source_simple_pin_header,
} from "./source_simple_pin_header"
import {
  type SourceSimplePinout,
  source_simple_pinout,
} from "./source_simple_pinout"
import {
  type SourceSimplePotentiometer,
  source_simple_potentiometer,
} from "./source_simple_potentiometer"
import {
  type SourceSimplePowerSource,
  source_simple_power_source,
} from "./source_simple_power_source"
import {
  type SourceSimplePushButton,
  source_simple_push_button,
} from "./source_simple_push_button"
import {
  type SourceSimpleResistor,
  source_simple_resistor,
} from "./source_simple_resistor"
import {
  type SourceSimpleResonator,
  source_simple_resonator,
} from "./source_simple_resonator"
import {
  type SourceSimpleSwitch,
  source_simple_switch,
} from "./source_simple_switch"
import {
  type SourceSimpleTestPoint,
  source_simple_test_point,
} from "./source_simple_test_point"
import {
  type SourceSimpleTransistor,
  source_simple_transistor,
} from "./source_simple_transistor"
import {
  type SourceTraceNotConnectedError,
  source_trace_not_connected_error,
} from "./source_trace_not_connected_error"

export const any_source_component = z.union([
  source_simple_resistor,
  source_simple_capacitor,
  source_simple_diode,
  source_simple_led,
  source_simple_ground,
  source_simple_chip,
  source_simple_power_source,
  source_simple_battery,
  source_simple_inductor,
  source_simple_push_button,
  source_simple_potentiometer,
  source_simple_crystal,
  source_simple_pin_header,
  source_simple_pinout,
  source_simple_resonator,
  source_simple_switch,
  source_simple_transistor,
  source_simple_test_point,
  source_simple_mosfet,
  source_simple_fuse,
  source_project_metadata,
  source_missing_property_error,
  source_failed_to_create_component_error,
  source_trace_not_connected_error,
  source_property_ignored_warning,
  source_pin_missing_trace_warning,
])

/**
 * Deprecated: use `AnySourceElement` instead
 */
export type AnySourceComponent = z.infer<typeof any_source_component>

export type AnySourceElement =
  | SourceSimpleResistor
  | SourceSimpleCapacitor
  | SourceSimpleDiode
  | SourceSimpleLed
  | SourceSimpleGround
  | SourceSimpleChip
  | SourceSimplePowerSource
  | SourceSimpleBattery
  | SourceSimpleInductor
  | SourceSimplePushButton
  | SourceSimplePotentiometer
  | SourceSimpleCrystal
  | SourceSimplePinHeader
  | SourceSimplePinout
  | SourceSimpleResonator
  | SourceSimpleSwitch
  | SourceSimpleTransistor
  | SourceSimpleTestPoint
  | SourceSimpleMosfet
  | SourceSimpleFuse
  | SourceProjectMetadata
  | SourceMissingPropertyError
  | SourceFailedToCreateComponentError
  | SourceTraceNotConnectedError
  | SourcePropertyIgnoredWarning
  | SourcePinMissingTraceWarning

expectTypesMatch<AnySourceElement, AnySourceComponent>(true)
