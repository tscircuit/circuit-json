import { expect, test } from "bun:test"
import { any_circuit_element, source_net } from "../src"

const project = {
  type: "source_project_metadata",
  metadata: {
    kicad_project: {
      net_settings: {
        meta: { version: 4 },
        classes: [
          { name: "Power", track_width: 0.8, clearance: 0.3 },
          { name: "Sense", track_width: 0.8, pcb_color: "rgba(1, 2, 3, 1)" },
          { name: "Unused", via_diameter: 0.7 },
        ],
        netclass_assignments: { "/POWER/VCC+": ["Power"] },
        netclass_patterns: [{ netclass: "Sense", pattern: "SENSE*" }],
        future_kicad_setting: { preserve: true },
      },
    },
  },
}
const net = {
  type: "source_net" as const,
  source_net_id: "power",
  name: "POWER_VCC_P",
  member_source_group_ids: [],
  trace_width: 0.8,
  metadata: {
    kicad_net: { name: "/POWER/VCC+", circuit_json_name: "POWER_VCC_P" },
  },
}

test("snapshot parsed converter metadata on existing records", () => {
  expect({
    project: any_circuit_element.parse(project),
    net: source_net.parse(net),
  }).toMatchSnapshot()
})

test.failing(
  "KiCad preservation metadata survives Circuit JSON parsing",
  () => {
    expect<unknown>(any_circuit_element.parse(project)).toEqual(project)
    expect(source_net.parse(JSON.parse(JSON.stringify(net)))).toEqual(net)
  },
)
