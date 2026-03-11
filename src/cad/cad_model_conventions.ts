export const cad_model_formats = [
  "obj",
  "stl",
  "3mf",
  "gltf",
  "glb",
  "step",
  "wrl",
] as const

export type CadModelFormat = (typeof cad_model_formats)[number]
export type CadModelDirection = "x+" | "x-" | "y+" | "y-" | "z+" | "z-"

export const cadModelDefaultDirection = "z+" as const

export const cadModelDefaultDirectionMap: Record<
  CadModelFormat,
  CadModelDirection
> = {
  obj: cadModelDefaultDirection,
  stl: cadModelDefaultDirection,
  "3mf": "z+",
  gltf: "y+",
  glb: "y+",
  step: cadModelDefaultDirection,
  wrl: "y+",
} as const
