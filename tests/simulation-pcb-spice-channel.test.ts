import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { simulation_experiment } from "../src/simulation/simulation_experiment"
import { simulation_ibis_model } from "../src/simulation/simulation_ibis_model"
import { model } from "./fixtures/simulation-ibis"

const channel = {
  reduction: "straightened-stages" as const,
  sections: 8,
  lanes: [
    { name: "DQ0", driver_source_port_id: "tx", receiver_source_port_id: "rx" },
  ],
  reference_source_port_id: "gnd",
  passive_source_component_ids: ["termination"],
  extraction: {
    minimum_frequency_hz: 1,
    maximum_frequency_hz: 1e9,
    model_frequency_hz: 1e8,
    filaments: 2,
    refinement_filaments: 4,
    convergence_tolerance: 0.01,
    capacitance_tolerance: 0.02,
    reciprocity_tolerance: 0.03,
    dc_resistance_tolerance: 0.04,
    max_panel_length_mm: 0.1,
    ground_mesh_size_mm: 0.5,
  },
  relative_permittivity: 4.2,
  via_plating_thickness_mm: 0.025,
  via_equivalent_width_mm: 0.3,
  omit_through_via_stubs: true,
  straightened_stage_profiles: {
    top: {
      spacing_mm: 0.2,
      relative_permittivity: 4,
      return: {
        width_mm: 1,
        thickness_mm: 0.035,
        length_factor: 1.1,
        center_y_mm: -0.2,
        center_z_mm: 0,
      },
    },
  },
}

const experiment = {
  type: "simulation_experiment" as const,
  simulation_experiment_id: "transient",
  name: "Channel extraction",
  experiment_type: "spice_transient_analysis" as const,
  spice_engine: "pcb_spice",
  pcb_spice_channel: channel,
}

test("pcb_spice channel settings survive Circuit JSON parsing and serialization", () => {
  const parsed = simulation_experiment.parse(experiment)
  expect(parsed).toEqual(experiment)
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(parsed)))).toEqual(
    experiment,
  )
  expect(
    simulation_experiment.parse({
      ...experiment,
      pcb_spice_channel: undefined,
    }),
  ).toHaveProperty("pcb_spice_channel", undefined)
})

test("pcb_spice channel validates section counts, lane counts and filament refinement", () => {
  for (const sections of [0, 129, 1.5]) {
    expect(() =>
      simulation_experiment.parse({
        ...experiment,
        pcb_spice_channel: { ...channel, sections },
      }),
    ).toThrow()
  }
  for (const lanes of [[], Array(4).fill(channel.lanes[0])]) {
    expect(() =>
      simulation_experiment.parse({
        ...experiment,
        pcb_spice_channel: { ...channel, lanes },
      }),
    ).toThrow()
  }
  for (const extraction of [
    { ...channel.extraction, filaments: 0 },
    { ...channel.extraction, refinement_filaments: 2 },
    { ...channel.extraction, refinement_filaments: 1.5 },
  ]) {
    expect(() =>
      simulation_experiment.parse({
        ...experiment,
        pcb_spice_channel: { ...channel, extraction },
      }),
    ).toThrow()
  }
})

test("IBIS assets preserve and validate optional SHA-256 digests", () => {
  const sha256 = "aB01".repeat(16)
  const withDigest = {
    ...model,
    ibis_model_asset: { ...model.ibis_model_asset, sha256 },
  }
  expect(simulation_ibis_model.parse(withDigest).ibis_model_asset).toEqual(
    withDigest.ibis_model_asset,
  )
  for (const invalid of ["a".repeat(63), "a".repeat(65), "g".repeat(64)]) {
    expect(() =>
      simulation_ibis_model.parse({
        ...withDigest,
        ibis_model_asset: { ...withDigest.ibis_model_asset, sha256: invalid },
      }),
    ).toThrow()
  }
})
