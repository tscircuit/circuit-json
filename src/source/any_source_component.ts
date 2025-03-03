import { z } from "zod"
import { source_simple_resistor } from "./source_simple_resistor"
import { source_simple_capacitor } from "./source_simple_capacitor"
import { source_simple_diode } from "./source_simple_diode"
import { source_simple_ground } from "./source_simple_ground"
import { source_simple_bug } from "./source_simple_bug"
import { source_simple_chip } from "./source_simple_chip"
import { source_led } from "./source_led"
import { source_simple_power_source } from "./source_simple_power_source"
import { source_simple_battery } from "./source_simple_battery"
import { source_simple_inductor } from "./source_simple_inductor"
import { source_simple_push_button } from "./source_simple_push_button"
import { source_simple_potentiometer } from "./source_simple_potentiometer"
import { source_simple_crystal } from "./source_simple_crystal"
import { source_simple_pin_header } from "./source_simple_pin_header"
import { source_simple_resonator } from "./source_simple_resonator"
import { source_simple_transistor } from "./source_simple_transistor"
import { source_simple_mosfet } from "./source_simple_mosfet"
import { source_simple_switch } from "./source_simple_switch"
import { source_project_metadata } from "./source_project_metadata"
import { source_software } from "./source_software"

export const any_source_component = z.union([
  source_simple_resistor,
  source_simple_capacitor,
  source_simple_diode,
  source_simple_ground,
  source_simple_chip,
  source_simple_bug,
  source_led,
  source_simple_power_source,
  source_simple_battery,
  source_simple_inductor,
  source_simple_push_button,
  source_simple_potentiometer,
  source_simple_crystal,
  source_simple_pin_header,
  source_simple_resonator,
  source_simple_switch,
  source_simple_transistor,
  source_simple_mosfet,
  source_project_metadata,
  source_software,
])

export type AnySourceComponent = z.infer<typeof any_source_component>
