export const cad_model_formats = [
  "obj",
  "stl",
  "3mf",
  "gltf",
  "glb",
  "step",
  "wrl",
] as const

export const cad_model_axis_directions = [
  "x+",
  "x-",
  "y+",
  "y-",
  "z+",
  "z-",
] as const

export type CadModelFormat = (typeof cad_model_formats)[number]
export type CadModelAxisDirection = (typeof cad_model_axis_directions)[number]

export const cadModelDefaultDirectionMap = {
  obj: "z+",
  stl: "z+",
  "3mf": "z+",
  gltf: "y+",
  glb: "y+",
  step: "z+",
  wrl: "y+",
} as const
