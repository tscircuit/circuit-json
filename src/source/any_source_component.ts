import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  source_simple_resistor,
  type SourceSimpleResistor,
} from "./source_simple_resistor"
import {
  source_simple_capacitor,
  type SourceSimpleCapacitor,
} from "./source_simple_capacitor"
import { source_simple_fuse, type SourceSimpleFuse } from "./source_simple_fuse"
import {
  source_simple_diode,
  type SourceSimpleDiode,
} from "./source_simple_diode"
import {
  source_simple_fiducial,
  type SourceSimpleFiducial,
} from "./source_simple_fiducial"
import { source_simple_led, type SourceSimpleLed } from "./source_simple_led"
import {
  source_simple_ground,
  type SourceSimpleGround,
} from "./source_simple_ground"
import { source_simple_chip, type SourceSimpleChip } from "./source_simple_chip"
import {
  source_simple_power_source,
  type SourceSimplePowerSource,
} from "./source_simple_power_source"
import {
  source_simple_battery,
  type SourceSimpleBattery,
} from "./source_simple_battery"
import {
  source_simple_inductor,
  type SourceSimpleInductor,
} from "./source_simple_inductor"
import {
  source_simple_push_button,
  type SourceSimplePushButton,
} from "./source_simple_push_button"
import {
  source_simple_potentiometer,
  type SourceSimplePotentiometer,
} from "./source_simple_potentiometer"
import {
  source_simple_crystal,
  type SourceSimpleCrystal,
} from "./source_simple_crystal"
import {
  source_simple_pin_header,
  type SourceSimplePinHeader,
} from "./source_simple_pin_header"
import {
  source_simple_pinout,
  type SourceSimplePinout,
} from "./source_simple_pinout"
import {
  source_simple_resonator,
  type SourceSimpleResonator,
} from "./source_simple_resonator"
import {
  source_simple_transistor,
  type SourceSimpleTransistor,
} from "./source_simple_transistor"
import {
  source_simple_test_point,
  type SourceSimpleTestPoint,
} from "./source_simple_test_point"
import {
  source_simple_mosfet,
  type SourceSimpleMosfet,
} from "./source_simple_mosfet"
import {
  source_simple_switch,
  type SourceSimpleSwitch,
} from "./source_simple_switch"
import {
  source_project_metadata,
  type SourceProjectMetadata,
} from "./source_project_metadata"
import {
  source_missing_property_error,
  type SourceMissingPropertyError,
} from "./source_missing_property_error"
import {
  source_failed_to_create_component_error,
  type SourceFailedToCreateComponentError,
} from "./source_failed_to_create_component_error"
import {
  source_trace_not_connected_error,
  type SourceTraceNotConnectedError,
} from "./source_trace_not_connected_error"
import {
  source_property_ignored_warning,
  type SourcePropertyIgnoredWarning,
} from "./source_property_ignored_warning"
import {
  source_pin_missing_trace_warning,
  type SourcePinMissingTraceWarning,
} from "./source_pin_missing_trace_warning"
import {
  source_simple_voltage_probe,
  type SourceSimpleVoltageProbe,
} from "./source_simple_voltage_probe"
import {
  source_interconnect,
  type SourceInterconnect,
} from "./source_interconnect"

export const any_source_component = z.union([
  source_simple_resistor,
  source_simple_capacitor,
  source_simple_diode,
  source_simple_fiducial,
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
  source_simple_voltage_probe,
  source_interconnect,
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
  | SourceSimpleFiducial
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
  | SourceSimpleVoltageProbe
  | SourceInterconnect
  | SourceProjectMetadata
  | SourceMissingPropertyError
  | SourceFailedToCreateComponentError
  | SourceTraceNotConnectedError
  | SourcePropertyIgnoredWarning
  | SourcePinMissingTraceWarning

expectTypesMatch<AnySourceElement, AnySourceComponent>(true)
