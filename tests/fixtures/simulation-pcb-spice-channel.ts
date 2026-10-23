import type {
  PcbSpiceChannel,
  SimulationExperiment,
} from "../../src/simulation/simulation_experiment"

export const channel = {
  reduction: "straightened-stages",
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
} satisfies PcbSpiceChannel

export const experiment = {
  type: "simulation_experiment",
  simulation_experiment_id: "transient",
  name: "Channel extraction",
  experiment_type: "spice_transient_analysis",
  spice_engine: "pcb_spice",
  pcb_spice_channel: channel,
} satisfies SimulationExperiment
