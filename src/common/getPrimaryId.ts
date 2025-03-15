type ExpectedElementTypes =
  | "source_trace"
  | "source_port"
  | "source_component"
  | "source_net"
  | "source_group"
  | "pcb_component"
  | "pcb_hole"
  | "pcb_missing_footprint_error"
  | "pcb_manual_edit_conflict_error"
  | "pcb_plated_hole"
  | "pcb_keepout"
  | "pcb_port"
  | "pcb_text"
  | "pcb_trace"
  | "pcb_via"
  | "pcb_smtpad"
  | "pcb_solder_paste"
  | "pcb_board"
  | "pcb_group"
  | "pcb_trace_hint"
  | "pcb_silkscreen_line"
  | "pcb_silkscreen_path"
  | "pcb_silkscreen_text"
  | "pcb_silkscreen_rect"
  | "pcb_silkscreen_circle"
  | "pcb_silkscreen_oval"
  | "pcb_trace_error"
  | "pcb_placement_error"
  | "pcb_port_not_matched_error"
  | "pcb_fabrication_note_path"
  | "pcb_fabrication_note_text"
  | "pcb_autorouting_error"
  | "schematic_box"
  | "schematic_text"
  | "schematic_line"
  | "schematic_component"
  | "schematic_port"
  | "schematic_trace"
  | "schematic_path"
  | "schematic_error"
  | "schematic_net_label"
  | "schematic_debug_object"
  | "schematic_voltage_probe"
  | "cad_component"

/**
 * Function to get the primary ID of an element based on its type.
 * It checks for the correct field and suffix in the ID based on the element's type.
 * @param element - The circuit element object to validate.
 * @returns The ID string if found, otherwise a string indicating the error.
 */
export function getPrimaryId(element: any): string | undefined {
  if (!isValidType(element.type)) {
    return `Invalid primaryId for type: '${element.type}'. Expected one of the valid types.` // Improved error message
  }

  const expectedField = `${element.type}_id`

  if (element[expectedField]) {
    return element[expectedField]
  }

  const incorrectFieldName = Object.keys(element).find(
    (key) => key !== expectedField && key.endsWith("_id"),
  )
  if (incorrectFieldName) {
    return `Invalid primaryId for type: '${element.type}'. Expected primaryId to include '${expectedField}' instead of '${incorrectFieldName}'`
  }

  return `Invalid primaryId for type: '${element.type}'. Expected primaryId to include '${expectedField}'.`
}

/**
 * Validate if the element's type is valid.
 * @param type - The type of the circuit element to validate.
 * @returns true if the type is valid, otherwise false.
 */
function isValidType(type: any): type is ExpectedElementTypes {
  console.log("Checking type:", type) // Add a log to see what type is being checked
  return [
    "source_trace",
    "source_port",
    "source_component",
    "source_net",
    "source_group",
    "pcb_component",
    "pcb_hole",
    "pcb_missing_footprint_error",
    "pcb_manual_edit_conflict_error",
    "pcb_plated_hole",
    "pcb_keepout",
    "pcb_port",
    "pcb_text",
    "pcb_trace",
    "pcb_via",
    "pcb_smtpad",
    "pcb_solder_paste",
    "pcb_board",
    "pcb_group",
    "pcb_trace_hint",
    "pcb_silkscreen_line",
    "pcb_silkscreen_path",
    "pcb_silkscreen_text",
    "pcb_silkscreen_rect",
    "pcb_silkscreen_circle",
    "pcb_silkscreen_oval",
    "pcb_trace_error",
    "pcb_placement_error",
    "pcb_port_not_matched_error",
    "pcb_fabrication_note_path",
    "pcb_fabrication_note_text",
    "pcb_autorouting_error",
    "schematic_box",
    "schematic_text",
    "schematic_line",
    "schematic_component",
    "schematic_port",
    "schematic_trace",
    "schematic_path",
    "schematic_error",
    "schematic_net_label",
    "schematic_debug_object",
    "schematic_voltage_probe",
    "cad_component",
  ].includes(type)
}
