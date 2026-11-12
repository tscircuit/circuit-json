import type { SimulationIbisModelInput } from "../../src"

export const model = {
  type: "simulation_ibis_model",
  source_component_id: "source_component_tx",
  ibis_model_asset: {
    project_relative_path: "models/chip.ibs",
    url: "https://example.com/chip.ibs",
    mimetype: "text/plain",
  },
  ibis_component_name: "CHIP",
  ibis_pin_name_to_source_port_id: { A1: "source_port_tx" },
  ibis_pin_name_to_model_name: { A1: "OUTPUT" },
  ibis_pin_name_to_reference_source_port_ids: {
    A1: {
      pullup_reference_source_port_id: "source_port_vcc",
      pulldown_reference_source_port_id: "source_port_gnd",
      power_clamp_reference_source_port_id: "source_port_vcc",
      ground_clamp_reference_source_port_id: "source_port_gnd",
      external_reference_source_port_id: "source_port_vref",
    },
  },
} satisfies SimulationIbisModelInput
