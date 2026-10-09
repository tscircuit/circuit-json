import { test, expect } from "bun:test"
import { gzipSync, gunzipSync } from "node:zlib"
import {
  any_circuit_element,
  simulation_experiment,
  simulation_pcb_noise_asset,
  simulation_pcb_noise_configuration,
  simulation_pcb_noise_result,
  simulation_pcb_noise_waveform_source,
  simulation_pcb_noise_network_json,
  simulation_pcb_noise_waveform_json,
  simulation_pcb_noise_eye_json,
  simulation_pcb_noise_spectrum_json,
  simulation_pcb_noise_manifest_json,
  validatePcbNoiseCircuitJson,
  validatePcbNoiseDecodedAssets,
  type SimulationPcbNoiseConfigurationInput,
  type SimulationPcbNoiseAsset,
  type SimulationPcbNoiseWaveformJson,
} from "../src"

const hash = "a".repeat(64)
const contact = (id: string, x: number) => ({
  contact_type: "pcb_port" as const,
  pcb_port_id: id,
  x,
  y: 0,
  layer: "top" as const,
})
const config = {
  type: "simulation_pcb_noise_configuration",
  simulation_pcb_noise_configuration_id: "config",
  simulation_experiment_id: "experiment",
  pcb_board_id: "board",
  duration_s: 128e-9,
  sample_interval_s: 20e-12,
  ports: [
    {
      name: "tx",
      signal_contact: contact("signal_tx", 0),
      reference_contact: contact("reference", 1),
    },
    {
      name: "rx",
      signal_contact: contact("signal_rx", 2),
      reference_contact: contact("reference", 1),
    },
  ],
  sources: [
    {
      name: "driver",
      port_name: "tx",
      role: "victim",
      source_model: { kind: "thevenin", resistance_ohms: 50 },
      waveform: {
        kind: "prbs",
        order: 7,
        baud_rate_hz: 500e6,
        low_voltage_v: 0,
        high_voltage_v: 1,
        rise_time_s: 200e-12,
        fall_time_s: 200e-12,
        edge_time_convention: "10_90",
        seed: 1,
        algorithm: "lfsr_fibonacci",
        algorithm_version: "1",
      },
    },
  ],
  terminations: [
    {
      name: "load",
      port_name: "rx",
      model: {
        kind: "parallel_rc",
        resistance_ohms: 50,
        capacitance_f: 1e-12,
        bias_voltage_v: 0,
      },
    },
  ],
  observations: [{ name: "receiver", port_name: "rx", quantity: "voltage" }],
  eyes: [
    {
      observation_name: "receiver",
      modulation: "nrz",
      timing: {
        kind: "known_ui",
        unit_interval_s: 2e-9,
        sample_offset_s: 1e-9,
        origin: { kind: "authored_epoch", epoch_s: 0 },
      },
    },
  ],
} satisfies SimulationPcbNoiseConfigurationInput
const descriptor = (
  kind: "network" | "waveform" | "manifest" | "eye" | "spectrum",
): SimulationPcbNoiseAsset => ({
  asset: {
    project_relative_path: `${kind}.json`,
    url: "data:application/json,%7B%7D",
    mimetype: "application/json",
  },
  data_format: `simulation_pcb_noise_${kind}_json_v1`,
  sha256: hash,
  encoded_sha256: hash,
  canonical_sha256: hash,
  byte_length: 2,
  decoded_byte_length: 2,
})
const result = {
  type: "simulation_pcb_noise_result",
  simulation_pcb_noise_result_id: "result",
  simulation_experiment_id: "experiment",
  simulation_pcb_noise_configuration_id: "config",
  pcb_board_id: "board",
  run_id: "run",
  status: "completed",
  observation_names: ["receiver"],
  model_tier: "analytic_fixture",
  validity_band_hz: { min_hz: 0, max_hz: 1e9 },
  validation: {
    state: "validated",
    residuals: [{ name: "analytic_error", value: 0, unit: "V", limit: 1e-6 }],
  },
  manifest_asset: descriptor("manifest"),
  network_asset: descriptor("network"),
  waveform_assets: [
    {
      observation_name: "receiver",
      variant: "total",
      asset: descriptor("waveform"),
    },
  ],
}
const network = {
  format: "simulation_pcb_noise_network_json_v1",
  run_id: "run",
  input_sha256: hash,
  model_sha256: hash,
  ports: config.ports.map((p) => ({
    port_name: p.name,
    signal_contact: p.signal_contact,
    reference_contact: p.reference_contact,
    reference_impedance_ohms: 50,
    reference_plane: "terminal_contact_pair",
    polarity: "signal_minus_reference",
  })),
  frequencies_hz: [0, 1e9],
  representation: "s",
  matrix_units: "dimensionless",
  matrices: [0, 1].map(() => [
    [
      { real: 0, imag: 0 },
      { real: 1, imag: 0 },
    ],
    [
      { real: 1, imag: 0 },
      { real: 0, imag: 0 },
    ],
  ]),
  phasor_convention: "exp_positive_j_omega_t",
  current_sign_convention: "into_pcb",
  dc: { kind: "included" },
  extraction: {
    provider: "analytic",
    version: "1",
    normalization: "power_waves",
  },
}
const waveform = {
  format: "simulation_pcb_noise_waveform_json_v1",
  run_id: "run",
  observation_name: "receiver",
  unit: "V",
  variant: "total",
  full_resolution: true,
  time: { kind: "uniform", start_s: 0, step_s: 1e-9, count: 3 },
  values: [0, 1, 0],
  valid_intervals_s: [{ start_s: 0, end_s: 2e-9 }],
  bandwidth_hz: 1e9,
  input_sha256: hash,
  source_sha256: hash,
} satisfies SimulationPcbNoiseWaveformJson
const eye = {
  format: "simulation_pcb_noise_eye_json_v1",
  run_id: "run",
  observation_name: "receiver",
  waveform_sha256: hash,
  timing_sha256: hash,
  modulation: "nrz",
  unit_interval_s: 2e-9,
  extent_ui: 2,
  time_bins: 2,
  voltage_bins: 2,
  min_voltage_v: 0,
  max_voltage_v: 1,
  counts: [1, 0, 0, 1],
  complete_window_count: 64,
  transition_count: 32,
  excluded_intervals_s: [],
  resolved_timing: {
    kind: "known_ui",
    unit_interval_s: 2e-9,
    epoch_s: 0,
    sample_offset_s: 1e-9,
  },
  metrics: { jitter_rms_s: 0 },
  metric_definitions: {
    jitter_rms_s: "Centered crossing residual RMS; finite-record metric",
  },
}
const spectrum = {
  format: "simulation_pcb_noise_spectrum_json_v1",
  run_id: "run",
  observation_name: "receiver",
  waveform_sha256: hash,
  frequencies_hz: [0, 1e6],
  values: [0, 0.5],
  kind: "psd",
  unit: "V^2/Hz",
  sidedness: "one_sided",
  window: "rectangular",
  coherent_gain: 1,
  enbw_hz: 1e6,
  dc_treatment: "included",
  fft_length: 2,
  sample_rate_hz: 2e6,
  integrated_power: 0.5,
  windowed_mean_square: 0.5,
  parseval_relative_error: 0,
}
const manifest = {
  format: "simulation_pcb_noise_manifest_json_v1",
  canonicalization: "sorted-json-significant-12-v1",
  run_id: "run",
  experiment_id: "experiment",
  configuration_id: "config",
  board_id: "board",
  inputs: {
    geometry: { sha256: hash, canonical_sha256: hash },
    configuration: { sha256: hash, canonical_sha256: hash },
    sources: { sha256: hash, canonical_sha256: hash },
    loads: { sha256: hash, canonical_sha256: hash },
  },
  resolved_inputs: {
    geometry: { stackup: { dielectric_m: 0.001 } },
    configuration: config,
    sources: config.sources,
    loads: config.terminations,
  },
  solver: {
    backend: "analytic",
    version: "1",
    unit_adapter_version: "1",
    settings: { reference_impedance_ohms: 50 },
  },
  artifacts: ["network", "waveform", "eye", "spectrum"].map((kind) => {
    const { asset, ...desc } = descriptor(
      kind as "network" | "waveform" | "eye" | "spectrum",
    )
    return { name: kind, ...desc }
  }),
}
const document = () => [
  {
    type: "simulation_experiment",
    simulation_experiment_id: "experiment",
    name: "Noise fixture",
    experiment_type: "pcb_noise",
  },
  {
    type: "pcb_board",
    pcb_board_id: "board",
    center: { x: 0, y: 0 },
    width: 10,
    height: 10,
  },
  ...[
    contact("signal_tx", 0),
    contact("reference", 1),
    contact("signal_rx", 2),
  ].map((c) => ({
    type: "pcb_port",
    pcb_port_id: c.pcb_port_id,
    source_port_id: `source_${c.pcb_port_id}`,
    x: c.x,
    y: c.y,
    layers: [c.layer],
  })),
  config,
  result,
]

test("noise definitions join the Circuit JSON union and preserve legacy experiments", () => {
  expect(any_circuit_element.parse(config).type).toBe(
    "simulation_pcb_noise_configuration",
  )
  expect(any_circuit_element.parse(result).type).toBe(
    "simulation_pcb_noise_result",
  )
  for (const experiment_type of [
    "pcb_noise",
    "pcb_return_current",
    "spice_transient_analysis",
  ] as const)
    expect(
      simulation_experiment.parse({
        type: "simulation_experiment",
        name: "experiment",
        experiment_type,
      }).experiment_type,
    ).toBe(experiment_type)
  const { simulation_pcb_noise_configuration_id, ...input } = config
  expect(
    simulation_pcb_noise_configuration.parse(input)
      .simulation_pcb_noise_configuration_id,
  ).toStartWith("simulation_pcb_noise_configuration_")
})

test("config validates local refs while sharing a physical reference contact", () => {
  expect(simulation_pcb_noise_configuration.safeParse(config).success).toBe(
    true,
  )
  for (const bad of [
    { ports: [config.ports[0], config.ports[0]] },
    { observations: [{ ...config.observations[0], port_name: "missing" }] },
    { sources: [{ ...config.sources[0], source_model: { kind: "thevenin" } }] },
    {
      baseline: {
        kind: "quiet_sources",
        source_names: ["missing"],
        voltage_v: 0,
      },
    },
    { sample_interval_s: Infinity },
    { duration_s: 0 },
    { extra: 1 },
    {
      ports: [
        {
          ...config.ports[0],
          reference_contact: { ...config.ports[0]!.signal_contact, x: 5 },
        },
      ],
    },
  ])
    expect(
      simulation_pcb_noise_configuration.safeParse({ ...config, ...bad })
        .success,
    ).toBe(false)
})

test("deterministic source constraints reject zero LFSR state, invalid ramp and malformed PWL", () => {
  const prbs = config.sources[0]!.waveform
  for (const bad of [
    { seed: 0 },
    { seed: 128 },
    { rise_time_s: 1.6e-9 },
    { algorithm_version: "2" },
    { high_voltage_v: 0 },
  ])
    expect(
      simulation_pcb_noise_waveform_source.safeParse({ ...prbs, ...bad })
        .success,
    ).toBe(false)
  expect(
    simulation_pcb_noise_waveform_source.safeParse({
      kind: "pwl",
      interpolation: "linear",
      points: [
        { time_s: 0, voltage_v: 0 },
        { time_s: 0, voltage_v: 1 },
      ],
    }).success,
  ).toBe(false)
  expect(
    simulation_pcb_noise_waveform_source.parse({
      kind: "sine",
      offset_voltage_v: 0,
      amplitude_v: 1,
      amplitude_convention: "peak",
      frequency_hz: 1e6,
      phase_rad: 0,
    }).kind,
  ).toBe("sine")
})

test("eye clocks cannot silently align data to itself or call authored edges receiver timing", () => {
  const explicit = {
    kind: "explicit_clock",
    clock: { kind: "observation", observation_name: "receiver" },
    edge: "rising",
    threshold_v: 0.5,
    ui_per_selected_edge: 1,
    sample_offset_s: 1e-9,
    interpretation: "actual_receiver_clock",
  }
  const withEye = (timing: unknown) => ({
    ...config,
    eyes: [{ ...config.eyes[0], timing }],
  })
  expect(
    simulation_pcb_noise_configuration.safeParse(withEye(explicit)).success,
  ).toBe(false)
  expect(
    simulation_pcb_noise_configuration.safeParse(
      withEye({
        ...explicit,
        clock: { kind: "authored_edges", source_name: "driver" },
      }),
    ).success,
  ).toBe(false)
  expect(
    simulation_pcb_noise_configuration.safeParse(
      withEye({
        ...explicit,
        clock: { kind: "authored_edges", source_name: "driver" },
        interpretation: "nominal_reference",
      }),
    ).success,
  ).toBe(true)
})

test("cross-record ownership rejects dangling contacts, duplicate configs and stale runs", () => {
  expect(validatePcbNoiseCircuitJson(document()).configurations).toHaveLength(1)
  for (const bad of [
    [...document(), config],
    document().filter(
      (r) => !("pcb_port_id" in r && r.pcb_port_id === "reference"),
    ),
    document().map((r) =>
      r.type === "simulation_pcb_noise_configuration"
        ? { ...r, pcb_board_id: "missing" }
        : r,
    ),
    document().map((r) =>
      r.type === "simulation_pcb_noise_result"
        ? { ...r, simulation_experiment_id: "other" }
        : r,
    ),
    document().map((r) => (r.type === "pcb_port" ? { ...r, x: 10 } : r)),
  ])
    expect(() => validatePcbNoiseCircuitJson<unknown>(bad)).toThrow()
})

test("noise validation preserves legacy numeric display metadata and raw board stackup", () => {
  const stackup = {
    dielectric_thickness_mm: 0.8,
    dielectric_permittivity: 4.2,
    copper_thickness_mm: 0.035,
  }
  const legacy = {
    type: "pcb_component",
    pcb_component_id: "legacy_component",
    source_component_id: "legacy_source",
    center: { x: 0, y: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    layer: "top",
    display_offset_x: 0,
    display_offset_y: 0,
    extension_metadata: { preserved: true },
  }
  const raw = [
    ...document().map((r) => (r.type === "pcb_board" ? { ...r, stackup } : r)),
    legacy,
  ]
  const before = JSON.stringify(raw)
  const validated = validatePcbNoiseCircuitJson(raw)
  expect(validated.circuitJson).toBe(raw)
  expect(validated.circuitJson.at(-1)).toBe(legacy)
  expect(JSON.stringify(validated.circuitJson)).toBe(before)
  expect(validated.configurations).toHaveLength(1)
  expect(validated.results).toHaveLength(1)
  for (const invalid of [
    raw.map((r) =>
      r.type === "simulation_experiment" ? { ...r, extra_noise_field: 1 } : r,
    ),
    raw.map((r) => (r.type === "pcb_port" ? { ...r, layers: [] } : r)),
    [...raw, raw.find((r) => r.type === "pcb_port")],
    raw.map((r) =>
      r.type === "simulation_pcb_noise_configuration"
        ? { ...r, extra_noise_field: 1 }
        : r,
    ),
  ])
    expect(() => validatePcbNoiseCircuitJson<unknown>(invalid)).toThrow()
})

test("full ordered networks reject malformed matrices, units, DC and port ordering", () => {
  expect(
    simulation_pcb_noise_network_json.parse(network).frequencies_hz[0],
  ).toBe(0)
  for (const bad of [
    { frequencies_hz: [1, 0] },
    { matrices: [network.matrices[0]] },
    { matrix_units: "ohm" },
    { dc: { kind: "unavailable", reason: "no DC" } },
    { ports: [network.ports[0], network.ports[0]] },
  ])
    expect(
      simulation_pcb_noise_network_json.safeParse({ ...network, ...bad })
        .success,
    ).toBe(false)
})

test("waveforms enforce SI time, exact counts, finite samples and continuous intervals", () => {
  expect(simulation_pcb_noise_waveform_json.parse(waveform).values).toEqual([
    0, 1, 0,
  ])
  const gapped = {
    ...waveform,
    time: { kind: "explicit", times_s: [0, 1e-9, 3e-9, 4e-9] },
    values: [0, 1, 0, 1],
    valid_intervals_s: [
      { start_s: 0, end_s: 1e-9 },
      { start_s: 3e-9, end_s: 4e-9 },
    ],
  }
  expect(simulation_pcb_noise_waveform_json.safeParse(gapped).success).toBe(
    true,
  )
  for (const bad of [
    { values: [0] },
    { values: [0, NaN, 0] },
    { time: { kind: "explicit", times_s: [0, 0, 1e-9] } },
    { valid_intervals_s: [{ start_s: 0, end_s: 1e-9 }] },
    { full_resolution: false },
    { unit: "mV" },
  ])
    expect(
      simulation_pcb_noise_waveform_json.safeParse({ ...waveform, ...bad })
        .success,
    ).toBe(false)
})

test("eye and spectrum metadata retain physical timing and distinguish PSD units", () => {
  expect(simulation_pcb_noise_eye_json.safeParse(eye).success).toBe(true)
  for (const bad of [
    { counts: [1] },
    { complete_window_count: 63 },
    { unit_interval_s: 1e-9 },
    { min_voltage_v: 1 },
  ])
    expect(
      simulation_pcb_noise_eye_json.safeParse({ ...eye, ...bad }).success,
    ).toBe(false)
  expect(simulation_pcb_noise_spectrum_json.safeParse(spectrum).success).toBe(
    true,
  )
  for (const bad of [
    { kind: "amplitude_peak" },
    { frequencies_hz: [0, 2e6] },
    { fft_length: 16 },
    { values: [NaN, 0] },
  ])
    expect(
      simulation_pcb_noise_spectrum_json.safeParse({ ...spectrum, ...bad })
        .success,
    ).toBe(false)
})

test("failed or unsupported runs cannot acquire completed assets or validated failures", () => {
  const {
    status,
    observation_names,
    model_tier,
    validity_band_hz,
    validation,
    manifest_asset,
    network_asset,
    waveform_assets,
    ...base
  } = result
  expect(
    simulation_pcb_noise_result.safeParse({
      ...base,
      status: "unsupported",
      diagnostics: [{ code: "geometry", message: "Curved traces unsupported" }],
    }).success,
  ).toBe(true)
  expect(
    simulation_pcb_noise_result.safeParse({
      ...base,
      status: "failed",
      diagnostics: [],
    }).success,
  ).toBe(false)
  expect(
    simulation_pcb_noise_result.safeParse({
      ...result,
      status: "unsupported",
      diagnostics: [{ code: "geometry", message: "Unsupported" }],
    }).success,
  ).toBe(false)
  expect(
    simulation_pcb_noise_result.safeParse({
      ...result,
      validation: {
        state: "validated",
        residuals: [{ name: "error", value: 2, unit: "V", limit: 1 }],
      },
    }).success,
  ).toBe(false)
})

test("asset MIME, version, full byte digests and lengths survive embedded gzip", () => {
  const bytes = Buffer.from(JSON.stringify(waveform))
  const compressed = gzipSync(bytes)
  const asset = {
    ...descriptor("waveform"),
    asset: {
      project_relative_path: "waveform.bin",
      url: `data:application/gzip;base64,${compressed.toString("base64")}`,
      mimetype: "application/gzip",
    },
    byte_length: compressed.length,
    decoded_byte_length: bytes.length,
  }
  expect(simulation_pcb_noise_asset.safeParse(asset).success).toBe(true)
  expect(
    simulation_pcb_noise_waveform_json.parse(
      JSON.parse(gunzipSync(compressed).toString()),
    ),
  ).toEqual(waveform)
  for (const bad of [
    { sha256: "stale" },
    { byte_length: 0 },
    { asset: { ...asset.asset, mimetype: "application/json" } },
  ])
    expect(
      simulation_pcb_noise_asset.safeParse({ ...asset, ...bad }).success,
    ).toBe(false)
})

test("selected decoded assets reject stale hashes, changed physical maps and analysis identity", () => {
  const withAnalyses = {
    ...result,
    eye_assets: [{ observation_name: "receiver", asset: descriptor("eye") }],
    spectrum_assets: [
      { observation_name: "receiver", asset: descriptor("spectrum") },
    ],
  }
  const assets = {
    manifest,
    network,
    waveforms: [waveform],
    eyes: [eye],
    spectra: [spectrum],
  }
  expect(
    validatePcbNoiseDecodedAssets(config, withAnalyses, assets).waveforms,
  ).toHaveLength(1)
  for (const bad of [
    { network: { ...network, input_sha256: "b".repeat(64) } },
    { network: { ...network, ports: [...network.ports].reverse() } },
    { manifest: { ...manifest, artifacts: [] } },
    { waveforms: [{ ...waveform, unit: "A" }] },
    { eyes: [{ ...eye, waveform_sha256: "b".repeat(64) }] },
    { spectra: [{ ...spectrum, unit: "A^2/Hz" }] },
  ])
    expect(() =>
      validatePcbNoiseDecodedAssets(config, withAnalyses, {
        ...assets,
        ...bad,
      }),
    ).toThrow()
})

test("manifest keeps original and canonical input digests and excludes recursive self hashes", () => {
  expect(simulation_pcb_noise_manifest_json.safeParse(manifest).success).toBe(
    true,
  )
  expect(
    simulation_pcb_noise_manifest_json.safeParse({
      ...manifest,
      canonicalization: "unspecified",
    }).success,
  ).toBe(false)
  expect(
    simulation_pcb_noise_manifest_json.safeParse({
      ...manifest,
      artifacts: [{ name: "manifest", ...descriptor("manifest") }],
    }).success,
  ).toBe(false)
  expect(
    simulation_pcb_noise_manifest_json.safeParse({
      ...manifest,
      resolved_inputs: {
        ...manifest.resolved_inputs,
        geometry: { sigma: Infinity },
      },
    }).success,
  ).toBe(false)
})
