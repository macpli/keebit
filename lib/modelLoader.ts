import { OrbitControls, useGLTF, Html } from "@react-three/drei";

export default function modelLoader(itemType: string) {
  switch (itemType) {
    case "Switch":
      return useGLTF("/switch.glb");
    case "Keyboard":
      return useGLTF("/kb.glb");
    case "PCB":
      return useGLTF("/pcb-tkl.glb");
    case "Plate":
      return useGLTF("/plate-60.glb");
    case "Stabilizers":
      return useGLTF("/stab.glb");
    default:
      return useGLTF("/switch.glb");
  }
}
