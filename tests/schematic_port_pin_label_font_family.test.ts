import { expect, test } from "bun:test"
import { schematic_port } from "src/schematic/schematic_port"

test("preserves the BeagleBone processor pin label font family", () => {
  // BeagleBone Black A5B, U5B R1: the Altium sheet selects Times New Roman.
  const port = {
    type: "schematic_port" as const,
    schematic_port_id: "schematic_port_u5b_r1",
    source_port_id: "source_port_u5_r1",
    schematic_component_id: "schematic_component_u5b",
    center: { x: 16.5, y: 11.3 },
    side_of_component: "right" as const,
    display_pin_label:
      "LCD_DATA0/GPMC_A0//EHRPWM2A//PR1_PRU1_PRU_R30_0/PR1_PRU1_PRU_R31_0/GPIO2_6",
    display_pin_label_font_size: 0.1,
    display_pin_label_font_family: "Times New Roman",
  }

  expect(schematic_port.parse(port)).toEqual(port)
})
