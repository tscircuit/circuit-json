import { expect, test } from "bun:test"
import { schematic_config } from "../src/schematic/schematic_config"

test("schematic_config parses sheet presentation", () => {
  const config = schematic_config.parse({
    type: "schematic_config",
    schematic_config_id: "schematic_config_main",
    show_border: true,
    show_title_block: true,
    show_reference_zones: true,
    border_margin: "1mm",
    horizontal_zone_count: 6,
    vertical_zone_count: 4,
  })

  expect(config).toEqual({
    type: "schematic_config",
    schematic_config_id: "schematic_config_main",
    show_border: true,
    show_title_block: true,
    show_reference_zones: true,
    border_margin: 1,
    horizontal_zone_count: 6,
    vertical_zone_count: 4,
  })
})
