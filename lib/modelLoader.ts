import { OrbitControls, useGLTF, Html } from "@react-three/drei";

export default function modelLoader(itemType: string){
    switch(itemType){
        case 'Switch':
            return useGLTF('/switch.glb');
        case 'Keyboard':
            return useGLTF('/kb.glb');
        default:
            return useGLTF('/switch.glb');
    }
}