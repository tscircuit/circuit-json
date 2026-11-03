import { expect, test } from "bun:test"
import "bun-match-svg"
import example from "../docs/system-block-example.json"
import {
  any_circuit_element,
  system_block_page,
  system_block_group,
  system_block_component,
  system_block_connection,
  type CircuitJson,
  type SystemBlockPage,
  type SystemBlockGroup,
  type SystemBlockComponent,
  type SystemBlockConnection,
} from "../src"

const page: SystemBlockPage = system_block_page.parse(example[0])
const group: SystemBlockGroup = system_block_group.parse(example[2])
const component: SystemBlockComponent = system_block_component.parse(example[3])
const connection: SystemBlockConnection = system_block_connection.parse(
  example[6],
)

test("resolved system records survive the public union and JSON round trip unchanged", () => {
  const circuit: CircuitJson = example.map((record) =>
    any_circuit_element.parse(record),
  )
  expect<unknown>(circuit).toEqual(example)
  expect(
    JSON.parse(JSON.stringify(circuit)).map((record: unknown) =>
      any_circuit_element.parse(record),
    ),
  ).toEqual(circuit)
  expect(system_block_group.parse(group).center).toEqual({ x: -28, y: -10 })
  // A nested component remains in page coordinates, not relative to its group.
  expect(system_block_component.parse(component).center).toEqual({
    x: -58,
    y: -12,
  })
})

test("pages and block bounds require resolved finite numeric geometry", () => {
  for (const [schema, record] of [
    [system_block_page, page],
    [system_block_group, group],
    [system_block_component, component],
  ] as const) {
    for (const field of ["width", "height"]) {
      for (const value of [
        undefined,
        null,
        0,
        -1,
        Infinity,
        -Infinity,
        NaN,
        "40mm",
        "auto",
      ]) {
        const invalid = { ...record, [field]: value }
        expect(schema.safeParse(invalid).success).toBe(false)
        expect(any_circuit_element.safeParse(invalid).success).toBe(false)
      }
    }
  }
  for (const [schema, record] of [
    [system_block_group, group],
    [system_block_component, component],
  ] as const) {
    for (const center of [
      undefined,
      null,
      {},
      { x: 0 },
      { y: 0 },
      { x: Infinity, y: 0 },
      { x: 0, y: -Infinity },
      { x: NaN, y: 0 },
      { x: 0, y: NaN },
      { x: "1mm", y: 0 },
      [0, 0],
    ]) {
      expect(schema.safeParse({ ...record, center }).success).toBe(false)
    }
    expect(
      schema.parse({ ...record, center: { x: -12.5, y: 0 } }).center,
    ).toEqual({ x: -12.5, y: 0 })
  }
})

test("components and groups retain resolved PCB IDs without requiring PCB geometry", () => {
  for (const [schema, record] of [
    [system_block_group, group],
    [system_block_component, component],
  ] as const) {
    for (const refs of [
      {},
      { pcb_component_ids: ["pcb_u1"] },
      { pcb_component_ids: ["pcb_u1", "pcb_c1"] },
      { pcb_group_id: "pcb_power" },
      { pcb_group_id: "pcb_power", pcb_component_ids: ["pcb_u1"] },
    ]) {
      expect(schema.parse({ ...record, ...refs })).toEqual({
        ...record,
        ...refs,
      })
    }
    for (const refs of [
      { pcb_component_ids: [] },
      { pcb_component_ids: [""] },
      { pcb_component_ids: [" "] },
      { pcb_component_ids: "pcb_u1" },
      { pcb_component_ids: [123] },
      { pcb_group_id: "" },
      { pcb_group_id: null },
    ]) {
      expect(schema.safeParse({ ...record, ...refs }).success).toBe(false)
    }
  }
  const {
    name,
    display_name,
    description,
    system_block_group_id,
    ...standalone
  } = component
  expect(system_block_component.parse(standalone)).toEqual(standalone)
})

test("connections preserve bends, direction, and explicit off-midpoint label positions", () => {
  const route = [
    { x: -38, y: -12 },
    { x: -32, y: -12 },
    { x: -32, y: -20 },
    { x: -20, y: -20 },
  ]
  for (const kind of ["signal", "power"] as const) {
    for (const direction of ["forward", "both", "none"] as const) {
      const input = {
        ...connection,
        route,
        kind,
        direction,
        label: "  3.3 V  ",
        label_center: { x: -35, y: 5 },
      }
      expect(system_block_connection.parse(input)).toEqual(input)
      expect(any_circuit_element.parse(input)).toEqual(input)
    }
  }
  const { label, label_center, ...unlabeled } = connection
  expect(system_block_connection.parse(unlabeled)).toEqual(unlabeled)
  // Self-loops may close the polyline, but no consecutive segment may be zero length.
  const loop = {
    ...unlabeled,
    to_system_block_component_id: connection.from_system_block_component_id,
    route: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 0 },
    ],
  }
  expect(system_block_connection.parse(loop)).toEqual(loop)
})

test("rejects unresolved routes, invalid directions, and labels without placement", () => {
  for (const patch of [
    { route: undefined },
    { route: [] },
    { route: [{ x: 0, y: 0 }] },
    {
      route: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
    },
    {
      route: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 0 },
      ],
    },
    {
      route: [
        { x: 0, y: 0 },
        { x: Infinity, y: 1 },
      ],
    },
    {
      route: [
        { x: 0, y: 0 },
        { x: 1, y: NaN },
      ],
    },
    {
      route: [
        { x: "1mm", y: 0 },
        { x: 1, y: 1 },
      ],
    },
    { route: [{ x: 0, y: 0 }, { x: 1 }] },
    { kind: undefined },
    { kind: "electrical" },
    { direction: undefined },
    { direction: "reverse" },
    { label_center: undefined },
    { label_center: { x: 0, y: Infinity } },
    { label_center: null },
    { label: 123 },
  ]) {
    const invalid = { ...connection, ...patch }
    expect(system_block_connection.safeParse(invalid).success).toBe(false)
    expect(any_circuit_element.safeParse(invalid).success).toBe(false)
  }
  expect(
    system_block_connection.safeParse({
      ...connection,
      label: "",
      label_center: undefined,
    }).success,
  ).toBe(false)
})

test("requires identities and references and rejects a group as its own parent", () => {
  for (const [schema, record, fields] of [
    [system_block_page, page, ["system_block_page_id"]],
    [
      system_block_group,
      group,
      ["system_block_group_id", "system_block_page_id"],
    ],
    [
      system_block_component,
      component,
      ["system_block_component_id", "system_block_page_id"],
    ],
    [
      system_block_connection,
      connection,
      [
        "system_block_connection_id",
        "system_block_page_id",
        "from_system_block_component_id",
        "to_system_block_component_id",
      ],
    ],
  ] as const) {
    for (const field of fields) {
      for (const value of [undefined, "", " \t ", null, 123]) {
        expect(schema.safeParse({ ...record, [field]: value }).success).toBe(
          false,
        )
      }
    }
    expect(schema.safeParse({ ...record, name: " " }).success).toBe(false)
  }
  expect(
    system_block_group.safeParse({
      ...group,
      parent_system_block_group_id: group.system_block_group_id,
    }).success,
  ).toBe(false)
  expect(
    system_block_group.safeParse({
      ...group,
      parent_system_block_group_id: " ",
    }).success,
  ).toBe(false)
  expect(
    system_block_component.safeParse({
      ...component,
      system_block_group_id: " ",
    }).success,
  ).toBe(false)
})

test("renders the example entirely from supplied bounds, routes, and label centers", async () => {
  const groups = example
    .filter((r) => r.type === "system_block_group")
    .map((r) => system_block_group.parse(r))
  const blocks = example
    .filter((r) => r.type === "system_block_component")
    .map((r) => system_block_component.parse(r))
  const connections = example
    .filter((r) => r.type === "system_block_connection")
    .map((r) => system_block_connection.parse(r))
  const svgPoint = (p: { x: number; y: number }) => ({
    x: page.width / 2 + p.x,
    y: page.height / 2 - p.y,
  })
  const bounds = (b: SystemBlockComponent | SystemBlockGroup) => {
    const p = svgPoint(b.center)
    return `x="${p.x - b.width / 2}" y="${p.y - b.height / 2}" width="${b.width}" height="${b.height}"`
  }
  const escape = (s: string) =>
    s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  const pieces = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="500" viewBox="0 0 ${page.width} ${page.height}" font-family="sans-serif">`,
    `<rect width="${page.width}" height="${page.height}" fill="white"/>`,
    '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2563a6"/></marker></defs>',
    `<text x="8" y="10" font-size="4.5" fill="#20252d">${escape(page.display_name!)}</text>`,
  ]
  // This small fixture painter has no graph layout or text measurement step.
  for (const g of groups) {
    const p = svgPoint(g.center)
    pieces.push(
      `<rect ${bounds(g)} rx="1.5" fill="${g.parent_system_block_group_id ? "#eef2f7" : "#f8fafc"}" stroke="#cbd5e1" stroke-width="0.3"/>`,
    )
    pieces.push(
      `<text x="${p.x - g.width / 2 + 3}" y="${p.y - g.height / 2 + 5}" font-size="2.8" fill="#526174">${escape(g.display_name!)}</text>`,
    )
  }
  for (const c of connections) {
    const points = c.route.map(svgPoint)
    pieces.push(
      `<polyline points="${points.map((p) => `${p.x},${p.y}`).join(" ")}" fill="none" stroke="#2563a6" stroke-width="0.4"${c.direction !== "none" ? ' marker-end="url(#arrow)"' : ""}${c.direction === "both" ? ' marker-start="url(#arrow)"' : ""}/>`,
    )
    if (c.label !== undefined && c.label_center) {
      const p = svgPoint(c.label_center)
      pieces.push(
        `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="central" font-size="2.5" fill="#526174">${escape(c.label)}</text>`,
      )
    }
  }
  for (const b of blocks) {
    const p = svgPoint(b.center)
    pieces.push(
      `<rect ${bounds(b)} rx="1" fill="white" stroke="#64748b" stroke-width="0.3"/>`,
    )
    pieces.push(
      `<text x="${p.x}" y="${p.y - 2}" text-anchor="middle" font-size="3" fill="#20252d">${escape(b.display_name!)}</text>`,
    )
    pieces.push(
      `<text x="${p.x}" y="${p.y + 4}" text-anchor="middle" font-size="2.4" fill="#526174">${escape(b.description!)}</text>`,
    )
  }
  pieces.push("</svg>")
  await expect(pieces.join("\n")).toMatchSvgSnapshot(import.meta.path)
})
