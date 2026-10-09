import { z } from "zod"
import { any_circuit_element } from "../any_circuit_element"
import {
  simulation_pcb_noise_configuration,
  type SimulationPcbNoiseConfiguration,
} from "./simulation_pcb_noise_configuration"
import {
  simulation_pcb_noise_result,
  type SimulationPcbNoiseResult,
} from "./simulation_pcb_noise_result"
import { simulation_pcb_noise_network_json } from "./simulation_pcb_noise_network_json"
import { simulation_pcb_noise_waveform_json } from "./simulation_pcb_noise_waveform_json"
import {
  simulation_pcb_noise_eye_json,
  simulation_pcb_noise_spectrum_json,
} from "./simulation_pcb_noise_analysis_json"
import { simulation_pcb_noise_manifest_json } from "./simulation_pcb_noise_manifest_json"
import type {
  SimulationPcbNoiseAsset,
  SimulationPcbNoiseContact,
} from "./simulation_pcb_noise_shared"

function fail(message: string, path: (string | number)[] = []): never {
  throw new z.ZodError([{ code: "custom", message, path }])
}
const contactId = (c: SimulationPcbNoiseContact) =>
  c.contact_type === "pcb_port"
    ? c.pcb_port_id
    : c.contact_type === "pcb_via"
      ? c.pcb_via_id
      : c.pcb_copper_pour_id
const equalContact = (
  a: SimulationPcbNoiseContact,
  b: SimulationPcbNoiseContact,
) =>
  a.contact_type === b.contact_type &&
  contactId(a) === contactId(b) &&
  a.x === b.x &&
  a.y === b.y &&
  a.layer === b.layer

/** Validate ownership across a complete document; never fetches assets or runs a solver.
 * Keep original input separately: legacy element schemas can strip extension metadata.
 */
export function validatePcbNoiseCircuitJson(circuitJson: readonly unknown[]) {
  const elements = circuitJson.map((element) =>
    any_circuit_element.parse(element),
  )
  const records = new Map<string, Record<string, unknown>>()
  for (const element of elements) {
    const record = element as unknown as Record<string, unknown>
    const id = record[`${element.type}_id`]
    if (typeof id !== "string") continue
    if (records.has(id)) fail(`Duplicate Circuit JSON ID ${id}`)
    records.set(id, record)
  }
  const configurations = elements.filter(
    (e): e is SimulationPcbNoiseConfiguration =>
      e.type === "simulation_pcb_noise_configuration",
  )
  const results = elements.filter(
    (e): e is SimulationPcbNoiseResult =>
      e.type === "simulation_pcb_noise_result",
  )
  const owned = new Set<string>()
  for (const config of configurations) {
    if (owned.has(config.simulation_experiment_id))
      fail("A pcb_noise experiment requires exactly one configuration")
    owned.add(config.simulation_experiment_id)
    const experiment = records.get(config.simulation_experiment_id)
    if (
      experiment?.type !== "simulation_experiment" ||
      experiment.experiment_type !== "pcb_noise"
    )
      fail("Noise configuration must belong to a pcb_noise experiment")
    if (records.get(config.pcb_board_id)?.type !== "pcb_board")
      fail("Noise configuration board does not exist")
    for (const port of config.ports)
      for (const contact of [port.signal_contact, port.reference_contact]) {
        const target = records.get(contactId(contact))
        if (target?.type !== contact.contact_type)
          fail(
            `Missing physical ${contact.contact_type} contact ${contactId(contact)}`,
          )
        if (
          Array.isArray(target.layers) &&
          !target.layers.includes(contact.layer)
        )
          fail("Contact layer is absent from the physical port")
        if (typeof target.layer === "string" && target.layer !== contact.layer)
          fail("Contact layer differs from the physical conductor")
        if (
          contact.contact_type !== "pcb_copper_pour" &&
          (target.x !== contact.x || target.y !== contact.y)
        )
          fail("Contact coordinates differ from the physical port or via")
      }
  }
  for (const element of elements)
    if (
      element.type === "simulation_experiment" &&
      element.experiment_type === "pcb_noise" &&
      !owned.has(element.simulation_experiment_id)
    )
      fail("A pcb_noise experiment requires exactly one configuration")
  const runIds = new Set<string>()
  for (const result of results) {
    if (runIds.has(result.run_id))
      fail("Noise run IDs must be unique and immutable")
    runIds.add(result.run_id)
    const config = configurations.find(
      (c) =>
        c.simulation_pcb_noise_configuration_id ===
        result.simulation_pcb_noise_configuration_id,
    )
    if (
      !config ||
      config.simulation_experiment_id !== result.simulation_experiment_id ||
      config.pcb_board_id !== result.pcb_board_id
    )
      fail("Result configuration, experiment and board ownership must agree")
    if (result.status === "completed") {
      const names = new Set(config.observations.map((o) => o.name))
      if (
        result.observation_names.length !== names.size ||
        result.observation_names.some((n) => !names.has(n))
      )
        fail(
          "Completed result must cover exactly the configuration observations",
        )
      const eyeNames = new Set(config.eyes?.map((eye) => eye.observation_name))
      if (result.eye_assets?.some((eye) => !eyeNames.has(eye.observation_name)))
        fail("Eye result must reference an authored timing analysis")
      if (
        result.waveform_assets.some((a) => a.variant !== "total") &&
        !config.baseline
      )
        fail("Baseline and difference assets require authored baseline policy")
    }
  }
  return { circuitJson: elements, configurations, results }
}

export interface PcbNoiseDecodedAssets {
  manifest: unknown
  network: unknown
  waveforms: unknown[]
  eyes?: unknown[]
  spectra?: unknown[]
}

/** Cross-check already decoded/hash-verified assets against selected config and result. */
export function validatePcbNoiseDecodedAssets(
  configuration: unknown,
  resultInput: unknown,
  assets: PcbNoiseDecodedAssets,
) {
  const config = simulation_pcb_noise_configuration.parse(configuration)
  const result = simulation_pcb_noise_result.parse(resultInput)
  if (result.status !== "completed")
    fail("Only completed runs have decoded assets")
  if (
    config.simulation_pcb_noise_configuration_id !==
      result.simulation_pcb_noise_configuration_id ||
    config.simulation_experiment_id !== result.simulation_experiment_id ||
    config.pcb_board_id !== result.pcb_board_id
  )
    fail("Selected result ownership does not match configuration")
  const manifest = simulation_pcb_noise_manifest_json.parse(assets.manifest)
  const network = simulation_pcb_noise_network_json.parse(assets.network)
  const waveforms = assets.waveforms.map((w) =>
    simulation_pcb_noise_waveform_json.parse(w),
  )
  const eyes = (assets.eyes ?? []).map((eye) =>
    simulation_pcb_noise_eye_json.parse(eye),
  )
  const spectra = (assets.spectra ?? []).map((s) =>
    simulation_pcb_noise_spectrum_json.parse(s),
  )
  if (
    manifest.run_id !== result.run_id ||
    manifest.experiment_id !== result.simulation_experiment_id ||
    manifest.configuration_id !==
      result.simulation_pcb_noise_configuration_id ||
    manifest.board_id !== result.pcb_board_id
  )
    fail("Manifest run and definition identities must match result")
  if (
    network.run_id !== result.run_id ||
    network.input_sha256 !== manifest.inputs.geometry.sha256
  )
    fail("Network input is stale or belongs to another run")
  if (
    network.ports.length !== config.ports.length ||
    network.ports.some((p, i) => {
      const c = config.ports[i]!
      return (
        p.port_name !== c.name ||
        !equalContact(p.signal_contact, c.signal_contact) ||
        !equalContact(p.reference_contact, c.reference_contact)
      )
    })
  )
    fail(
      "Network port order, polarity and physical contact map must match configuration",
    )
  const attest = (descriptor: SimulationPcbNoiseAsset) => {
    if (
      !manifest.artifacts.some(
        (a) =>
          a.data_format === descriptor.data_format &&
          a.sha256 === descriptor.sha256 &&
          a.encoded_sha256 === descriptor.encoded_sha256 &&
          a.canonical_sha256 === descriptor.canonical_sha256 &&
          a.byte_length === descriptor.byte_length &&
          a.decoded_byte_length === descriptor.decoded_byte_length,
      )
    )
      fail("Manifest artifact digests or lengths differ from result descriptor")
  }
  attest(result.network_asset)
  if (
    waveforms.length !== result.waveform_assets.length ||
    eyes.length !== (result.eye_assets?.length ?? 0) ||
    spectra.length !== (result.spectrum_assets?.length ?? 0)
  )
    fail("Decoded asset count must match selected result")
  waveforms.forEach((waveform, i) => {
    const ref = result.waveform_assets[i]!
    const observation = config.observations.find(
      (o) => o.name === waveform.observation_name,
    )
    if (
      waveform.run_id !== result.run_id ||
      waveform.observation_name !== ref.observation_name ||
      waveform.variant !== ref.variant ||
      waveform.input_sha256 !== network.input_sha256 ||
      !observation ||
      waveform.unit !== (observation.quantity === "voltage" ? "V" : "A")
    )
      fail(
        "Waveform ownership, input hash, variant or units differ from selected observation",
      )
    attest(ref.asset)
  })
  const totalRef = (name: string) =>
    result.waveform_assets.find(
      (w) => w.observation_name === name && w.variant === "total",
    )
  eyes.forEach((eye, i) => {
    const ref = result.eye_assets![i]!
    const authored = config.eyes?.find(
      (e) => e.observation_name === eye.observation_name,
    )
    if (
      eye.run_id !== result.run_id ||
      eye.observation_name !== ref.observation_name ||
      eye.waveform_sha256 !== totalRef(eye.observation_name)?.asset.sha256 ||
      !authored ||
      authored.timing.kind !== eye.resolved_timing.kind
    )
      fail(
        "Eye waveform identity or authored timing mode differs from selected analysis",
      )
    if (
      authored.timing.kind === "known_ui" &&
      authored.timing.unit_interval_s !== eye.unit_interval_s
    )
      fail("Eye UI differs from authored UI")
    if (
      authored.timing.kind === "known_ui" &&
      eye.resolved_timing.kind === "known_ui" &&
      (authored.timing.sample_offset_s !==
        eye.resolved_timing.sample_offset_s ||
        (authored.timing.origin.kind === "authored_epoch" &&
          authored.timing.origin.epoch_s !== eye.resolved_timing.epoch_s))
    )
      fail("Resolved phase differs from authored fixed timing")
    if (
      authored.timing.kind === "explicit_clock" &&
      eye.resolved_timing.kind === "explicit_clock"
    ) {
      const actual = eye.resolved_timing
      if (
        actual.interpretation !== authored.timing.interpretation ||
        actual.edge_polarity !== authored.timing.edge ||
        actual.clock_source.kind !== authored.timing.clock.kind ||
        (actual.clock_source.kind === "observation" &&
          authored.timing.clock.kind === "observation" &&
          actual.clock_source.observation_name !==
            authored.timing.clock.observation_name) ||
        (actual.clock_source.kind === "authored_edges" &&
          authored.timing.clock.kind === "authored_edges" &&
          actual.clock_source.source_name !== authored.timing.clock.source_name)
      )
        fail("Resolved clock provenance differs from authored timing intent")
      if (
        actual.clock_source.kind === "observation" &&
        actual.clock_waveform_sha256 !==
          totalRef(actual.clock_source.observation_name)?.asset.sha256
      )
        fail(
          "Resolved receiver clock waveform hash differs from selected clock observation",
        )
    }
    attest(ref.asset)
  })
  spectra.forEach((spectrum, i) => {
    const ref = result.spectrum_assets![i]!
    const waveform = waveforms.find(
      (w) =>
        w.observation_name === spectrum.observation_name &&
        w.variant === "total",
    )
    if (
      spectrum.run_id !== result.run_id ||
      spectrum.observation_name !== ref.observation_name ||
      spectrum.waveform_sha256 !==
        totalRef(spectrum.observation_name)?.asset.sha256 ||
      spectrum.unit !==
        (spectrum.kind === "psd" ? `${waveform?.unit}^2/Hz` : waveform?.unit)
    )
      fail(
        "Spectrum waveform identity or units differ from selected observation",
      )
    attest(ref.asset)
  })
  return { manifest, network, waveforms, eyes, spectra }
}
