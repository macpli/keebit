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
import modelLoader from "@/lib/modelLoader";

import { Color } from "@/types/color";
import { Item } from "@/types/item";

import Spinner from "../Spinner";
import { ChevronLeft } from "lucide-react";
import { Button, Label, Slider } from "@/components/ui/index";
import CameraConfiguration from "@/lib/cameraConfig";
import { CameraConfig } from "@/types/cameraConfig";
import { set } from "react-hook-form";

const Model = ({ itemType }: { itemType: string }) => {
  const { scene } = modelLoader(itemType);

  // Center the model
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
  }, [scene]);

  return <primitive object={scene} />;
};

const CameraUpdater = ({ config }: { config: CameraConfig }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (config) {
      camera.position.set(
        config.position[0],
        config.position[1],
        config.position[2]
      );
      camera.zoom = config.zoom;
      // camera.fov = 50;
      camera.updateProjectionMatrix(); 
    }
  }, [config, camera]);

  return null; 
};

const ModelViewer: React.FC<{ item: Item }> = ({ item }) => {
  const [colors, setColors] = useState<Color[]>([]);
  const [colorToEdit, setColorToEdit] = useState<Color>();
  const [config, setConfig] = useState<CameraConfig>();
  const [colorsToSave, setColorsToSave] = useState<ColorDTO[]>([]);

  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(false);

  // Slider values
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number }>({
    r: colorToEdit?.r || 105,
    g: colorToEdit?.g || 225,
    b: colorToEdit?.b || 225,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const { nodes, materials } = modelLoader(item.itemType);

  // Gets the default colors of the model
  const getMaterialColors = () => {
    let modelColors: Color[] = [];
    if (materials) {
      Object.keys(materials).forEach((key, idx) => {
        const color = (materials[key] as THREE.MeshStandardMaterial).color;
        const rgbColor = convertColorTo255({
          r: color.r,
          g: color.g,
          b: color.b,
        });
        const newColor = {
          uuid: materials[key].uuid,
          r: rgbColor.r,
          g: rgbColor.g,
          b: rgbColor.b,
          material_index: idx,
        };

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
    const newRgb = { ...rgb, [component]: value };
    setRgb(newRgb);
    if (colorToEdit) {
      setColorToEdit({ ...colorToEdit, ...newRgb });
    }

    updateModelColor();
  };

  const updateModelColor = () => {
    if (colorToEdit) {
      const newColor = new THREE.Color(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);

      // Find the material with the matching UUID
      Object.keys(materials).forEach((key, idx) => {
        if (idx === colorToEdit.material_index) {
          (materials[key] as THREE.MeshStandardMaterial).color.set(newColor);
          colors[idx] = colorToEdit;
        }
      });

      const newColorToSave: ColorDTO = {
        item_id: item.itemId,
        model_name: item.itemType,
        r: colorToEdit.r,
        g: colorToEdit.g,
        b: colorToEdit.b,
        material_index: colorToEdit.material_index,
      };
      setColorsToSave((prevColors) => {
        const updatedColors = prevColors.some(
          (c) => c.material_index === newColorToSave.material_index
        )
          ? prevColors.map((c) =>
              c.material_index === newColorToSave.material_index
                ? newColorToSave
                : c
            )
          : [...prevColors, newColorToSave];

        return updatedColors;
      });
    }
  };

  // Sets the color on the model and triggers the handleAddColor to add / update to database
  const setModelColor = async () => {
    if(colorsToSave.length !== colors.length){
      const colorsToSaveMap = new Map(
        colors.map((color) => [color.material_index, color])
      );

      const fullColorsToSave = colors.map((defaultColor)=> {
        return(
          colorsToSaveMap.get(defaultColor.material_index) || {
            item_id: item.itemId,
            model_name: item.itemType,
            r: defaultColor.r,
            g: defaultColor.g,
            b: defaultColor.b,
            material_index: defaultColor.material_index
          }
        );
      });

      setColorsToSave(
        fullColorsToSave.map((color) =>
          "item_id" in color
            ? color
            : {
                item_id: item.itemId,
                model_name: item.itemType,
                r: color.r,
                g: color.g,
                b: color.b,
                material_index: color.material_index,
              }
        )
      );

      fullColorsToSave.forEach((color) => {
        handleAddColor({
          item_id: item.itemId,
          model_name: item.itemType,
          r: color.r,
          g: color.g,
          b: color.b,
          material_index: color.material_index,
        });
      });
    } else {
      
      colorsToSave.forEach((color) => {
        handleAddColor(color);
      });
    }

  };

  const handleAddColor = async (colorData: ColorDTO) => {
    const colorsInDb: ColorDTO[] = await getColors(item.itemId);

    const colorExists = colorsInDb.find((c) => {
      return (
        c.item_id === colorData.item_id &&
        c.material_index === colorData.material_index
      );
    });

    if (colorExists !== undefined) {
      // Update the color
      updateColor(colorData);
    } else {
      // Add the color
      addColor(colorData);
    }
  };

  // Applies the default colors to the model if no colors are found in the database
  const applyDefaultColors = async () => {
    let defaultColors: Color[] = await getColorsDefault(item.itemType);

    Object.keys(materials).forEach(async (key, idx) => {
      if (defaultColors!.length > 0) {
        setColors(defaultColors);
        const newColor = defaultColors
          ? new THREE.Color(
              `rgb(${defaultColors[idx].r}, ${defaultColors[idx].g}, ${defaultColors[idx].b})`
            )
          : new THREE.Color();
        (materials[key] as THREE.MeshStandardMaterial).color.set(newColor);
      }
    });
  };

  const configureModelSettings = async () => {
    // Fetch and set the colors
    // If no colors are found, set the default colors
    let colors = await getColors(item.itemId);
    if (colors.length === 0) {
      applyDefaultColors();
    } else {
      setColors(colors);
      Object.keys(materials).forEach(async (key, idx) => {
        if (colors.length > 0) {
          const newColor = new THREE.Color(
            `rgb(${colors[idx].r}, ${colors[idx].g}, ${colors[idx].b})`
          );
          (materials[key] as THREE.MeshStandardMaterial).color.set(newColor);
        }
      });
    }

    // Configure zoom
    const newConfig = CameraConfiguration(item.itemType);
    setConfig(newConfig);

    // COnfigure lighting
  };

  useEffect(() => {
    if (materials) {
      getMaterialColors();
    }
  }, [materials]);

  // TODO: ConfigureModelSettings
  useEffect(() => {
    setConfig(CameraConfiguration(item.itemType));
    setColorToEdit(undefined);
    configureModelSettings();
  }, [item]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex">
      {/* 3D Model */}
      <div className="flex-1">
        <Canvas>
          {config && <CameraUpdater config={config} />}
          <ambientLight intensity={1.5} />
          <directionalLight position={[-2, 1, -2]} intensity={3} />

          <Suspense
            fallback={
              <Html center>
                <Spinner width={60} height={60} />
              </Html>
            }
          >
            <Model itemType={item.itemType} />
          </Suspense>

          <OrbitControls panSpeed={0.01} />
        </Canvas>
      </div>

      {/* Color Editor */}
      <div
        className={`absolute right-0 top-0 bottom-0 transition-all duration-300 border-l bg-muted/10 ${
          isPanelCollapsed ? "w-[40px]" : "w-[180px]"
        } flex flex-col`}
      >
        {/* Toggle button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 -translate-y-1/2 -left-10"
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
        >
          <ChevronLeft
            className={`transition-transform duration-300 ${
              isPanelCollapsed ? "" : "rotate-180"
            }`}
          />
        </Button>

        {/* Panel content - only show when not collapsed */}
        {!isPanelCollapsed && (
          <div className="p-3 pt-0 flex-1">
            <h3 className="font-medium text-sm my-4">Color Editor</h3>

            {/* Model Colors */}
            {!colorToEdit && (
              <div>
                {!colorToEdit &&
                  colors.map((color: Color, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setColorToEdit(color);
                        setRgb({ r: color.r, g: color.g, b: color.b });
                      }}
                      className="cursor-pointer p-2 rounded-md hover:bg-muted"
                    >
                      <div
                        className="w-full h-8 rounded-md border"
                        style={{
                          backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                        }}
                        aria-label="Color preview"
                      />
                    </div>
                  ))}

                <div className="mt-10 p-2">
                  <Button className="w-full" onClick={setModelColor}>
                    Set Color
                  </Button>
                </div>
              </div>
            )}

            {/* Color editor */}
            {colorToEdit && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label
                    htmlFor="red-slider"
                    className="text-xs flex justify-between"
                  >
                    Red <span>{rgb.r}</span>
                  </Label>
                  <Slider
                    id="red-slider"
                    min={0}
                    max={255}
                    step={1}
                    value={[rgb.r]}
                    onValueChange={(value) =>
                      updateColorFromSlider("r", value[0])
                    }
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="green-slider"
                    className="text-xs flex justify-between"
                  >
                    Green <span>{rgb.g}</span>
                  </Label>
                  <Slider
                    id="green-slider"
                    min={0}
                    max={255}
                    step={1}
                    value={[rgb.g]}
                    onValueChange={(value) =>
                      updateColorFromSlider("g", value[0])
                    }
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="blue-slider"
                    className="text-xs flex justify-between"
                  >
                    Blue <span>{rgb.b}</span>
                  </Label>
                  <Slider
                    id="blue-slider"
                    min={0}
                    max={255}
                    step={1}
                    value={[rgb.b]}
                    onValueChange={(value) =>
                      updateColorFromSlider("b", value[0])
                    }
                    className="cursor-pointer"
                  />
                </div>

                <div className="pt-2">
                  <div
                    className="w-full h-8 rounded-md border"
                    style={{
                      backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                    }}
                    aria-label="Color preview"
                  />
                </div>

                <div className="w-full flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-1 mb-4"
                    onClick={() => setColorToEdit(undefined)}
                  >
                    <ChevronLeft className="m-0" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelViewer;
