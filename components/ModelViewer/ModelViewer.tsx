// @ts-nochec
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";

import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";

import { ColorDTO } from "@/types/ColorDTO";
import { getColors } from "@/app/(root)/_actions/getColors";
import addColor from "@/app/(root)/_actions/addColor";
import updateColor from "@/app/(root)/_actions/updateColor";
import { getColorsDefault } from "@/app/(root)/_actions/getColorsDefault";

import { Color } from "@/types/color";
import { Item } from "@/types/item";

import Spinner from "../Spinner";
import { ChevronLeft } from "lucide-react";
import { Button, Label, Slider } from "@/components/ui/index";


const Model = () => {
  const { scene } = useGLTF("/switch.glb"); 
  
  // Center the model
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center); 
  }, [scene]);

  return <primitive object={scene}  />;
};



const ModelViewer: React.FC<{ item: Item }> =  ({ item }) => {
  const [zoom, setZoom] = useState(0);
  const [colors, setColors] = useState<Color[]>([]); 
  const [colorToEdit, setColorToEdit] = useState<Color>();

  // Slider values
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number }>({
      r: colorToEdit?.r || 105, 
      g: colorToEdit?.g || 225,
      b: colorToEdit?.b || 225,
  })
  const containerRef = useRef<HTMLDivElement>(null);
  const { nodes, materials } = useGLTF("/switch.glb");
  
  const getMaterialColors = () => {
    let modelColors: Color[] = [];
    if(materials){
      Object.keys(materials).forEach((key, idx) => {
        const color = (materials[key] as THREE.MeshStandardMaterial).color;
        const rgbColor = convertColorTo255({ r: color.r, g: color.g, b: color.b });
        const newColor = {
            uuid: materials[key].uuid,
            r: rgbColor.r,
            g: rgbColor.g,
            b: rgbColor.b,
            material_index: idx,
        }
        
        modelColors.push(newColor);
      });
    }

    setColors([...(colors || []), ...modelColors]);
    return colors;
  };

  const convertColorTo255 = (color: { r: number; g: number; b: number }) => {
    return {
      r: Math.round(color.r * 255),
      g: Math.round(color.g * 255),
      b: Math.round(color.b * 255),
    };
  };

  const updateColorFromSlider = (component: "r" | "g" | "b", value: number) => {
    const newRgb = { ...rgb, [component]: value }
    setRgb(newRgb)
    if (colorToEdit) {
        setColorToEdit({ ...colorToEdit, ...newRgb });
    }
  }

  const setModelColor = async () => {
    if (colorToEdit) {
      const newColor = new THREE.Color(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
      
      // Find the material with the matching UUID
      Object.keys(materials).forEach((key, idx) => {
          if (idx === colorToEdit.material_index) {
              (materials[key] as THREE.MeshStandardMaterial).color.set(newColor);
              colors[idx] = colorToEdit;
          }
      });

      // TODO: SAVE THE COLORS AS JSON TO THE DATABASE
      // TO THEN LOAD AND APPLY THEM WITH THE MODEL INIT
      const colorData: ColorDTO = {
        item_id: item.itemId,
        model_name: "switch",
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        material_index: colorToEdit.material_index,
      };

      handleAddColor(colorData);
    }
  }

  const handleAddColor = async (colorData: ColorDTO) => {
    const colorsInDb = await getColors(item.itemId);
    
    if(colorsInDb.length > 0){
      // Update the color
      updateColor(colorData);
    } else {
      // Add the color
      addColor(colorData);
    }
  }

  const applyDefaultColors = async () => {
    let defaultColors: Color[] = await getColorsDefault("switch");

    Object.keys(materials).forEach(async (key, idx) => {
      if(defaultColors!.length > 0){
        setColors(defaultColors);
        const newColor = defaultColors ? new THREE.Color(`rgb(${defaultColors[idx].r}, ${defaultColors[idx].g}, ${defaultColors[idx].b})`) : new THREE.Color();
        (materials[key] as THREE.MeshStandardMaterial).color.set(newColor);
      }
    });
  }
  
  const configureModelSettings = async () => {    
    // Fetch and set the colors
    // If no colors are found, set the default colors
    let colors = await getColors(item.itemId);
    if(colors.length === 0){
      applyDefaultColors();
    } else {
      setColors(colors);
      Object.keys(materials).forEach(async (key, idx) => {
        if(colors.length > 0){
          const newColor = new THREE.Color(`rgb(${colors[idx].r}, ${colors[idx].g}, ${colors[idx].b})`);
          (materials[key] as THREE.MeshStandardMaterial).color.set(newColor);
        }
      });
    }
    
    

    // Configure zoom
    // COnfigure lighting
  }

  useEffect(() => {
      if(materials){
          getMaterialColors();
      }
  }, [materials]);

  // TODO: ConfigureModelSettings
  useEffect(() => {
    setColorToEdit(undefined);
    configureModelSettings();

      if(true){
          setZoom(80);
      }
  }, [item]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex">
        {/* 3D Model */}
        <div className="flex-1">
            <Canvas camera={{position:[-1,1.2,-1], zoom: zoom}}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[-2, 1, -2]} intensity= {3} />
                
                <Suspense fallback={<Html center><Spinner width={60} height={60}/></Html>}>
                  <Model />
                </Suspense>
        
                <OrbitControls panSpeed={0.01}/>
            </Canvas>
        </div>
     
        {/* Color Editor */}
        <div className="w-[180px] bg-muted/10 p-3 border-l">
          <h3 className="font-medium text-sm mb-4">Color Editor</h3>
          
          {/* Model Colors */}
          <div>
            { !colorToEdit && colors.map((color: Color, idx) => (
                <div key={idx} onClick={() => { setColorToEdit(color); setRgb({ r: color.r, g: color.g, b: color.b }); }} className="cursor-pointer p-2 rounded-md hover:bg-muted">
                    <div
                        className="w-full h-8 rounded-md border"
                        style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
                        aria-label="Color preview"
                    />
                </div>
            ))}
          </div>

            {/* Color editor */}
            {colorToEdit && (

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="red-slider" className="text-xs flex justify-between">
                    Red <span>{rgb.r}</span>
                  </Label>
                  <Slider
                    id="red-slider"
                    min={0}
                    max={255}
                    step={1}
                    value={[rgb.r]}
                    onValueChange={(value) => updateColorFromSlider("r", value[0])}
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="green-slider" className="text-xs flex justify-between">
                    Green <span>{rgb.g}</span>
                  </Label>
                  <Slider
                    id="green-slider"
                    min={0}
                    max={255}
                    step={1}
                    value={[rgb.g]}
                    onValueChange={(value) => updateColorFromSlider("g", value[0])}
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blue-slider" className="text-xs flex justify-between">
                    Blue <span>{rgb.b}</span>
                  </Label>
                  <Slider
                    id="blue-slider"
                    min={0}
                    max={255}
                    step={1}
                    value={[rgb.b]}
                    onValueChange={(value) => updateColorFromSlider("b", value[0])}
                    className="cursor-pointer"
                  />
                </div>

                <div className="pt-2">
                  <div
                    className="w-full h-8 rounded-md border"
                    style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }}
                    aria-label="Color preview"
                  />
                  {/* <p className="text-xs text-center mt-1">{color}</p> */}
                </div>

                <div className="w-full flex gap-2">
                    <Button asChild variant="outline" size="icon" className="flex-1 mb-4" onClick={() => setColorToEdit(undefined)}>
                        <ChevronLeft className="m-0"/>
                    </Button>
                    <Button className="flex-3" onClick={setModelColor}>Set Color</Button>
                </div>
                
              </div>
            )}
        </div>
    </div>
  );
};

export default ModelViewer;