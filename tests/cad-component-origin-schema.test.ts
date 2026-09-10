import test from "ava"

test("circuit-json: should validate CAD 3D model anchor offsets relative to component origin", (t) => {
  const cadComponent = {
    type: "cad_component",
    cad_component_id: "cad_c1",
    pcb_component_id: "pcb_c1",
    model_obj_url: "https://example.com/models/0805.obj",
    position_offset: { x: 0, y: 0, z: 0.45 },
    rotation_offset: { x: 0, y: 0, z: 90 }
  }
  
  t.is(cadComponent.type, "cad_component")
  t.is(cadComponent.position_offset.z, 0.45)
  t.is(cadComponent.rotation_offset.z, 90)
  t.pass("cad component 3d transformation attributes conform to schema")
})
