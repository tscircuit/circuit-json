import { test } from "bun:test"
import assert from "node:assert/strict"
import { gzipSync, gunzipSync } from "node:zlib"
import {
  any_circuit_element,
  getSimulationReturnCurrentGridJsonSchema,
  simulation_return_current_contact,
  simulation_return_current_grid_json,
  simulation_experiment,
  simulation_pcb_return_current_field,
  simulation_pcb_return_current_heatmap,
  simulation_pcb_return_current_marker,
  simulation_pcb_return_current_result,
  simulation_return_current_excitation,
  simulation_terminal_port,
  type AnyCircuitElement,
  type SimulationPcbReturnCurrentFieldInput,
} from "../src"

const field = {
  type: "simulation_pcb_return_current_field",
  simulation_pcb_return_current_result_id: "result_1",
  layer: "bottom",
  source_net_id: "ground_1",
  field_type: "complex_phasor",
  min_x: -50,
  min_y: -40,
  columns: 2,
  rows: 2,
  cell_width: 0.2,
  cell_height: 0.2,
  copper_thickness: 0.035,
  data_format: "simulation_return_current_grid_json_v1",
  field_asset: {
    project_relative_path: "simulations/ddr-d12/bottom.json.gz",
    url: "https://example.com/bottom.json.gz",
    mimetype: "application/gzip",
  },
} satisfies SimulationPcbReturnCurrentFieldInput

const grid = {
  field_type: "complex_phasor",
  sheet_current_x_real: [0.001, null, 0, -0.001],
  sheet_current_x_imag: [0.0002, null, 0, -0.0002],
  sheet_current_y_real: [0.0005, null, 0, -0.0005],
  sheet_current_y_imag: [-0.0001, null, 0, 0.0001],
}

const excitation = {
  type: "simulation_return_current_excitation",
  simulation_experiment_id: "experiment_1",
  pcb_trace_id: "ddr_d12",
  ground_source_net_id: "ground_1",
  current: 0.005,
  return_source: {
    x: 2,
    y: 3,
    layer: "bottom",
    contact_type: "pcb_copper_pour",
    pcb_copper_pour_id: "pour_1",
  },
  return_sink: {
    x: -2,
    y: -3,
    layer: "top",
    contact_type: "pcb_port",
    pcb_port_id: "driver_ground",
  },
}

const result = {
  type: "simulation_pcb_return_current_result",
  simulation_experiment_id: "experiment_1",
  pcb_board_id: "board_1",
  simulation_return_current_excitation_ids: ["excitation_1"],
  frequency_hz: 1e6,
}

const heatmap = {
  type: "simulation_pcb_return_current_heatmap",
  simulation_pcb_return_current_result_id: "result_1",
  layer: "bottom",
  source_net_id: "ground_1",
  min_x: -50,
  min_y: -40,
  max_x: 50,
  max_y: 40,
  image_asset: {
    project_relative_path: "simulations/ddr-d12/bottom.png",
    url: "https://example.com/bottom.png",
    mimetype: "image/png",
  },
}

const marker = {
  type: "simulation_pcb_return_current_marker",
  simulation_pcb_return_current_result_id: "result_1",
  role: "signal_source",
  target_type: "pcb_port",
  pcb_port_id: "driver_k4",
  layer: "top",
  label: "DDR_D12 source · U1.K4",
}

test("registers every return-current element and generates prefixed IDs", () => {
  const elements = [excitation, result, field, heatmap, marker]
  for (const element of elements) {
    const parsed: AnyCircuitElement = any_circuit_element.parse(element)
    const id = (parsed as unknown as Record<string, unknown>)[
      `${parsed.type}_id`
    ]
    assert.equal(typeof id, "string")
    assert.ok((id as string).startsWith(`${parsed.type}_`))
  }
  const parsed = simulation_experiment.parse({
    type: "simulation_experiment",
    name: "DDR_D12 at 1 MHz",
    experiment_type: "pcb_return_current",
  })
  assert.equal(parsed.experiment_type, "pcb_return_current")
})

test("retains supplied IDs and supports negative excitation currents", () => {
  const parsed = simulation_return_current_excitation.parse({
    ...excitation,
    simulation_return_current_excitation_id: "excitation_1",
    current: -0.005,
    source_port: {
      signal_pcb_port_id: "driver_k4",
      reference_pcb_port_id: "driver_ground",
      reference_layer: "top",
      resistance: 50,
    },
  })
  assert.equal(parsed.simulation_return_current_excitation_id, "excitation_1")
  assert.equal(parsed.current, -0.005)
  assert.equal(parsed.source_port?.reference_pcb_port_id, "driver_ground")
})

test("contacts require the reference ID selected by contact_type", () => {
  for (const contact of [
    excitation.return_source,
    excitation.return_sink,
    {
      x: 0,
      y: 0,
      layer: "inner1",
      contact_type: "pcb_via",
      pcb_via_id: "via_1",
    },
  ])
    assert.ok(simulation_return_current_contact.safeParse(contact).success)
  assert.ok(
    !simulation_return_current_contact.safeParse({
      ...excitation.return_source,
      contact_type: "pcb_via",
    }).success,
  )
  assert.ok(
    !simulation_return_current_contact.safeParse({
      x: 0,
      y: 0,
      layer: "bottom",
    }).success,
  )
  assert.ok(
    !simulation_return_current_contact.safeParse({
      ...excitation.return_sink,
      x: Infinity,
    }).success,
  )
})

test("requires positive finite port resistance and finite current", () => {
  for (const resistance of [0, -50, Infinity, NaN]) {
    assert.ok(
      !simulation_terminal_port.safeParse({
        signal_pcb_port_id: "driver_k4",
        reference_layer: "bottom",
        resistance,
      }).success,
    )
  }
  for (const current of [Infinity, -Infinity, NaN]) {
    assert.ok(
      !simulation_return_current_excitation.safeParse({
        ...excitation,
        current,
      }).success,
    )
  }
})

test("results support frequency-independent fields and reject invalid excitation lists", () => {
  const { frequency_hz, ...independent } = result
  assert.equal(
    simulation_pcb_return_current_result.parse(independent).frequency_hz,
    undefined,
  )
  for (const frequency_hz of [0, -1, Infinity]) {
    assert.ok(
      !simulation_pcb_return_current_result.safeParse({
        ...result,
        frequency_hz,
      }).success,
    )
  }
  for (const ids of [[], [""], ["excitation_1", "excitation_1"]]) {
    assert.ok(
      !simulation_pcb_return_current_result.safeParse({
        ...result,
        simulation_return_current_excitation_ids: ids,
      }).success,
    )
  }
})

test("fields accept plain JSON, gzip and embedded URLs independent of filenames", () => {
  for (const field_asset of [
    field.field_asset,
    {
      ...field.field_asset,
      url: "https://example.com/no-extension",
      mimetype: "application/json",
    },
    {
      ...field.field_asset,
      url: "data:application/json,%7B%7D",
      mimetype: "application/json",
    },
    {
      ...field.field_asset,
      url: "data:application/gzip;base64,H4sI",
      mimetype: "application/gzip",
    },
  ])
    assert.ok(
      simulation_pcb_return_current_field.safeParse({ ...field, field_asset })
        .success,
    )
})

test("field assets reject unsupported MIME types and mismatched data URL headers", () => {
  for (const field_asset of [
    { ...field.field_asset, mimetype: "application/octet-stream" },
    { ...field.field_asset, url: "data:application/json;base64,e30=" },
    { ...field.field_asset, url: "data:application/gzip;base64" },
    { ...field.field_asset, url: "not a URL" },
    { ...field.field_asset, project_relative_path: "" },
  ])
    assert.ok(
      !simulation_pcb_return_current_field.safeParse({ ...field, field_asset })
        .success,
    )
})

test("field dimensions reject unsafe, fractional and nonpositive values", () => {
  for (const change of [
    { columns: 0 },
    { rows: -1 },
    { columns: 1.5 },
    { columns: Number.MAX_SAFE_INTEGER, rows: 2 },
    { cell_width: 0 },
    { cell_height: Infinity },
    { copper_thickness: -0.035 },
    { min_x: Infinity },
    { layer: "inner9" },
    { data_format: "unknown" },
  ])
    assert.ok(
      !simulation_pcb_return_current_field.safeParse({ ...field, ...change })
        .success,
    )
})

test("decoded grids preserve null conductor masks and zero current cells", () => {
  assert.deepEqual(simulation_return_current_grid_json.parse(grid), grid)
  assert.deepEqual(
    simulation_return_current_grid_json.parse({
      field_type: "real",
      sheet_current_x: [0, null, -0.005],
      sheet_current_y: [0, null, 0.005],
    }).field_type,
    "real",
  )
})

test("decoded grids reject unequal lengths, inconsistent masks and nonfinite values", () => {
  for (const change of [
    { sheet_current_y_imag: [0] },
    { sheet_current_x_real: [0.001, 0, 0, -0.001] },
    { sheet_current_x_imag: [Infinity, null, 0, 0] },
    { sheet_current_x_imag: [NaN, null, 0, 0] },
    { field_type: "real" },
  ])
    assert.ok(
      !simulation_return_current_grid_json.safeParse({ ...grid, ...change })
        .success,
    )
})

test("parent field validation checks grid count and field_type", () => {
  const schema = getSimulationReturnCurrentGridJsonSchema(
    simulation_pcb_return_current_field.parse(field),
  )
  assert.ok(schema.safeParse(grid).success)
  assert.ok(
    !schema.safeParse({
      field_type: "real",
      sheet_current_x: [0, null, 0, 0],
      sheet_current_y: [0, null, 0, 0],
    }).success,
  )
  assert.ok(
    !getSimulationReturnCurrentGridJsonSchema({
      ...field,
      columns: 3,
    }).safeParse(grid).success,
  )
  assert.throws(() =>
    getSimulationReturnCurrentGridJsonSchema({ ...field, rows: 0 }),
  )
})

test("embedded gzip field survives asset validation and consumer decoding", () => {
  const encoded = gzipSync(JSON.stringify(grid)).toString("base64")
  const parsed = simulation_pcb_return_current_field.parse({
    ...field,
    field_asset: {
      ...field.field_asset,
      url: `data:application/gzip;base64,${encoded}`,
    },
  })
  const bytes = Buffer.from(parsed.field_asset.url.split(",")[1]!, "base64")
  const decoded = JSON.parse(gunzipSync(bytes).toString("utf8"))
  assert.deepEqual(
    getSimulationReturnCurrentGridJsonSchema(parsed).parse(decoded),
    grid,
  )
})

test("heatmaps validate bounds and support PNG/WebP assets and data URLs", () => {
  assert.ok(simulation_pcb_return_current_heatmap.safeParse(heatmap).success)
  assert.ok(
    simulation_pcb_return_current_heatmap.safeParse({
      ...heatmap,
      image_asset: {
        ...heatmap.image_asset,
        mimetype: "image/webp",
        url: "data:image/webp;base64,UklGRg==",
      },
    }).success,
  )
  for (const change of [
    { max_x: -50 },
    { max_y: -41 },
    { min_y: NaN },
    { image_asset: { ...heatmap.image_asset, mimetype: "image/svg+xml" } },
    {
      image_asset: {
        ...heatmap.image_asset,
        url: "data:image/webp;base64,UklGRg==",
      },
    },
  ])
    assert.ok(
      !simulation_pcb_return_current_heatmap.safeParse({
        ...heatmap,
        ...change,
      }).success,
    )
})

test("markers discriminate ports and vias and normalize layers", () => {
  assert.equal(
    simulation_pcb_return_current_marker.parse({
      ...marker,
      layer: { name: "top" },
      label_x: 0,
      label_y: 0,
    }).target_type,
    "pcb_port",
  )
  const via = {
    ...marker,
    role: "signal_transition",
    target_type: "pcb_via",
    pcb_via_id: "via_1",
    from_layer: "top",
    to_layer: "inner1",
  }
  assert.equal(
    simulation_pcb_return_current_marker.parse(via).target_type,
    "pcb_via",
  )
  assert.ok(
    !simulation_pcb_return_current_marker.safeParse({ ...via, to_layer: "top" })
      .success,
  )
  assert.ok(
    !simulation_pcb_return_current_marker.safeParse({ ...marker, label_x: 1 })
      .success,
  )
  assert.ok(
    !simulation_pcb_return_current_marker.safeParse({
      ...marker,
      target_type: "pcb_via",
    }).success,
  )
})
