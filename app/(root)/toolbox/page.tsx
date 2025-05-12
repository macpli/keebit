"use client";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";

import Image from "next/image";

import * as UI from "@/components/ui/index";

import {
  Keyboard,
  Upload,
  Camera,
  Wand2,
  Headphones,
  PaintBucket,
  Layers,
  Zap,
  ChevronRight,
  X,
  Check,
  Loader2,
  Search,
  PlusCircle,
  Info,
} from "lucide-react";
import Sparkles from "@/public/Sparkles.svg";
import getCollections from "../_actions/getCollections";
import { ItemType } from "@/types/itemType";
import getItemTypes from "../_actions/getItemTypes";
import getDefaultItemTypes from "../_actions/getDefaultItemTypes";
import { Item } from "@/types/item";
import addItem from "../_actions/addItem";

// Mock switch types for recommendations
const switchTypes = [
  {
    name: "Gateron Black Ink V2",
    type: "Linear",
    force: "Medium-Heavy",
    sound: "Thocky",
  },
  { name: "Holy Panda", type: "Tactile", force: "Medium", sound: "Clacky" },
  { name: "Cherry MX Blue", type: "Clicky", force: "Medium", sound: "Clicky" },
  { name: "Boba U4T", type: "Tactile", force: "Medium-Heavy", sound: "Thocky" },
  { name: "Alpaca", type: "Linear", force: "Medium", sound: "Muted" },
  { name: "NK Cream", type: "Linear", force: "Medium-Heavy", sound: "Clacky" },
  { name: "Zealios V2", type: "Tactile", force: "Heavy", sound: "Tactile" },
  { name: "Tangerine", type: "Linear", force: "Light", sound: "Smooth" },
];

export default function ToolboxPage() {
  const apiUrl = process.env.NEXT_PUBLIC_AI_API_BASE_URL;

  const [activeTab, setActiveTab] = useState("detect");
  const [collections, setCollections] = useState<any[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);

  // Analyzer
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResults, setDetectionResults] = useState<
    { component: string; confidence: number }[]
  >([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [matchedItemType, setMatchedItemType] = useState<ItemType | null>(null);

  const [componentName, setComponentName] = useState("");
  const [componentDescription, setComponentDescription] = useState("");
  const [selectedItemTypeId, setSelectedItemTypeId] = useState<string>("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [componentQuantity, setComponentQuantity] = useState<number>(1);

  // For build assistant
  const [buildPrompt, setBuildPrompt] = useState({
    layout: "any",
    switchType: "any",
    budget: "any",
    soundProfile: "any",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBuild, setGeneratedBuild] = useState<any | null>(null);

  // For switch recommender
  const [preferredType, setPreferredType] = useState<string>("all");
  const [preferredForce, setPreferredForce] = useState<number[]>([50]);
  const [preferredSound, setPreferredSound] = useState<string>("all");
  const [recommendedSwitches, setRecommendedSwitches] = useState<any[]>([]);

  const [shouldFetch, setShouldFetch] = useState(false);

  const { data: session } = useSession();

  // For Analyzer
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImageFile(file);
      setDetectionResults([]);
    }

    console.log("File uploaded:", file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setDetectionResults([]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const analyzeImage = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("file", imageFile);
    setIsAnalyzing(true);

    try {
      const res = await fetch(apiUrl + "/classify", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      console.log("Detection results:", data);

      const formatted = Object.entries(data).map(([component, confidence]) => ({
        component,
        confidence: parseFloat(confidence as string),
      }));

      const sorted = formatted
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3);

      setDetectionResults(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addToCollection = (component: string) => {
    setSelectedComponent(component);
    setShowAddDialog(true);
  };

  // FOR   Build Assistant
  const generateBuild = async () => {
    if (!buildPrompt) return;

    const requestBody = {
      prompt: buildPrompt,
    };

    setIsGenerating(true);

    console.log(apiUrl)
    try {
      const res = await fetch(apiUrl + "/suggest-build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody.prompt),
      });

      const data = await res.json();
      console.log("Req:", requestBody.prompt);
      console.log("Response:", data);

      const proposedBuild = {
        description: data.description,
        layout: data.layout,
        soundProfile: data.soundProfile,
        swtichType: data.swtichType,
        totalPrice: data.totalPrice,
        components: data.components,
      };

      setGeneratedBuild(proposedBuild);
      setIsGenerating(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  //   FOR Switch Recommender
  const recommendSwitches = () => {
    // Filter switches based on preferences
    let filtered = [...switchTypes];

    if (preferredType !== "all") {
      filtered = filtered.filter(
        (s) => s.type.toLowerCase() === preferredType.toLowerCase()
      );
    }

    if (preferredSound !== "all") {
      filtered = filtered.filter(
        (s) => s.sound.toLowerCase() === preferredSound.toLowerCase()
      );
    }

    // Force is more complex - we'd match based on ranges
    // For this demo, we'll just sort by how close they are to the preferred force
    const forceValue = preferredForce[0];
    const forceMap: { [key: string]: number } = {
      Light: 45,
      Medium: 55,
      "Medium-Heavy": 65,
      Heavy: 75,
    };

    filtered = filtered.sort((a, b) => {
      const aForce = forceMap[a.force] || 60;
      const bForce = forceMap[b.force] || 60;
      return Math.abs(aForce - forceValue) - Math.abs(bForce - forceValue);
    });

    setRecommendedSwitches(filtered);
  };

  const matchDetectedType = () => {
    if (!selectedComponent) return;
    console.log(selectedComponent);
    console.log(itemTypes);

    const selectedWords = selectedComponent.toLowerCase().split(" ");

    const match = itemTypes.find((itemType) =>
      selectedWords.some((word) => itemType.name.toLowerCase().includes(word))
    );
    if (match) {
      setMatchedItemType(match);
    }

    console.log("Matched item type:", match);
  };

  const addDetctedItemToCollection = async () => {
    const item: any = {
      name: componentName,
      description: componentDescription,
      itemType: matchedItemType ? matchedItemType.name : "",
      quantity: componentQuantity,
      additionalData: {},
    }
    console.log('ITEM: ' + item)

    try {
      await addItem(item, selectedCollectionId, true);
      console.log("Item added successfully");
    } catch (error) {
      console.error("Error adding item:", error);
    }
    
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCollections(session?.user!.id!);
      const customItemTypes = await getItemTypes();
      const defaultItemTypes = await getDefaultItemTypes();

      const itemTypes = [...customItemTypes, ...defaultItemTypes];

      setCollections(data);
      setItemTypes(itemTypes);

      setShouldFetch(false);
    };

    if (shouldFetch) {
      fetchData();
    }
  }, [shouldFetch]);

  useEffect(() => {
    if (session && session.user && session.user.id) {
      setShouldFetch(true);
    }
  }, [session]);

  useEffect(() => {
    if (!selectedComponent) return;
    matchDetectedType();
  }, [selectedComponent]);

   useEffect(() => {
    if (showAddDialog && selectedComponent) {
      setComponentName(selectedComponent);
      setComponentDescription("");
      setSelectedItemTypeId(matchedItemType ? matchedItemType.id : "");
      setSelectedCollectionId("");
      setComponentQuantity(1);
    }
  }, [showAddDialog, selectedComponent, matchedItemType]);

  return (
    <div className="min-h-screen mx-auto container px-4 py-8">
      <div className="flex items-center mb-8">
        <div className="mr-auto">
          <h1 className="text-3xl font-bold flex items-center">
            <Image
              src={Sparkles}
              alt="AI Detection sparkles"
              width={32}
              height={32}
              className="mr-2"
            />
            {/* <Sparkles className="h-8 w-8 mr-2 text-primary" /> */}
            AI Features
          </h1>
          <p className="text-muted-foreground mt-1">
            Enhance your keyboard collection with AI-powered tools
          </p>
        </div>
      </div>

      {/* Tabs */}
      <UI.Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-8"
      >
        <UI.TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
          <UI.TabsTrigger value="detect" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">Component Detection</span>
            <span className="sm:hidden">Detect</span>
          </UI.TabsTrigger>
          <UI.TabsTrigger value="build" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            <span className="hidden sm:inline">Build Assistant</span>
            <span className="sm:hidden">Build</span>
          </UI.TabsTrigger>
          <UI.TabsTrigger value="switch" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Switch Recommender</span>
            <span className="sm:hidden">Switches</span>
          </UI.TabsTrigger>
        </UI.TabsList>

        {/* Component Detection Tab */}
        <UI.TabsContent value="detect" className="space-y-6">
          <UI.Card>
            <UI.CardHeader>
              <UI.CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Keyboard Component Detection
              </UI.CardTitle>
              <UI.CardDescription>
                Upload an image of a keyboard or components to automatically
                identify and catalog them
              </UI.CardDescription>
            </UI.CardHeader>
            <UI.CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Image Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-80 ${
                    imageUrl ? "border-primary" : "border-muted-foreground/20"
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {imageUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt="Uploaded keyboard"
                        fill
                        className="object-contain"
                      />
                      <UI.Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setImageUrl(null)}
                      >
                        <X className="h-4 w-4" />
                      </UI.Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                      <p className="text-center mb-4">
                        <span className="font-medium">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground text-center">
                        Upload a clear image of your keyboard or components
                      </p>
                      <UI.Button
                        variant="outline"
                        onClick={triggerFileInput}
                        className="mt-4"
                      >
                        Select Image
                      </UI.Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                    </>
                  )}
                </div>

                {/* Detection Results */}
                <div className="flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">
                      Detection Results
                    </h3>
                    {imageUrl &&
                      !isAnalyzing &&
                      detectionResults.length === 0 && (
                        <UI.Button onClick={analyzeImage} className="w-full">
                          <Zap className="h-4 w-4 mr-2" />
                          Analyze Image
                        </UI.Button>
                      )}

                    {isAnalyzing && (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">
                          Analyzing image...
                        </p>
                      </div>
                    )}

                    {detectionResults.length > 0 && (
                      <div className="space-y-3">
                        {detectionResults.map((result, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center">
                              <UI.Badge variant="outline" className="mr-3">
                                {Math.round(result.confidence * 100)}%
                              </UI.Badge>
                              <span className="font-medium capitalize">
                                {result.component}
                              </span>
                            </div>
                            <UI.Button
                              variant="outline"
                              size="sm"
                              onClick={() => addToCollection(result.component)}
                            >
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Add
                            </UI.Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {!imageUrl && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Search className="h-8 w-8 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          Upload an image to detect keyboard components
                        </p>
                      </div>
                    )}
                  </div>

                  {detectionResults.length > 0 && (
                    <div className="mt-auto">
                      <UI.Button className="w-full">
                        <Keyboard className="h-4 w-4 mr-2" />
                        Create Collection from Results
                      </UI.Button>
                    </div>
                  )}
                </div>
              </div>
            </UI.CardContent>
          </UI.Card>
        </UI.TabsContent>

        <UI.TabsContent value="build" className="space-y-6">
          <UI.Card>
            <UI.CardHeader>
              <UI.CardTitle className="flex items-center">
                <Wand2 className="h-5 w-5 mr-2" />
                AI Keyboard Build Assistant
              </UI.CardTitle>
              <UI.CardDescription>
                Describe your ideal keyboard and let AI suggest a complete build
              </UI.CardDescription>
            </UI.CardHeader>
            <UI.CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Prompt Input */}
                <div className="space-y-4">
                  {/* <div>
                    <UI.Label htmlFor="build-prompt">
                      Describe your ideal keyboard
                    </UI.Label>
                    <UI.Textarea
                      id="build-prompt"
                      placeholder="Example: I want a 75% keyboard with tactile switches that has a thocky sound profile. I prefer aluminum cases and PBT keycaps."
                      className="h-40 resize-none mt-2"
                      value={buildPrompt}
                      onChange={(e) => setBuildPrompt(e.target.value)}
                    />
                  </div> */}

                  <div className="flex flex-col gap-2">
                    <UI.Label>Preferences</UI.Label>
                    <div className="grid grid-cols-2 gap-2">
                      <UI.Select
                        defaultValue="any"
                        value={buildPrompt.layout}
                        onValueChange={(val) =>
                          setBuildPrompt((prev) => ({ ...prev, layout: val }))
                        }
                      >
                        <UI.SelectTrigger>
                          <UI.SelectValue placeholder="Layout" />
                        </UI.SelectTrigger>
                        <UI.SelectContent>
                          <UI.SelectItem value="any">Any Layout</UI.SelectItem>
                          <UI.SelectItem value="60">60%</UI.SelectItem>
                          <UI.SelectItem value="65">65%</UI.SelectItem>
                          <UI.SelectItem value="75">75%</UI.SelectItem>
                          <UI.SelectItem value="full">Full-size</UI.SelectItem>
                          <UI.SelectItem value="tkl">TKL</UI.SelectItem>
                        </UI.SelectContent>
                      </UI.Select>

                      <UI.Select
                        defaultValue="any"
                        value={buildPrompt.switchType}
                        onValueChange={(val) =>
                          setBuildPrompt((prev) => ({
                            ...prev,
                            switchType: val,
                          }))
                        }
                      >
                        <UI.SelectTrigger>
                          <UI.SelectValue placeholder="Switch Type" />
                        </UI.SelectTrigger>
                        <UI.SelectContent>
                          <UI.SelectItem value="any">Any Switch</UI.SelectItem>
                          <UI.SelectItem value="linear">Linear</UI.SelectItem>
                          <UI.SelectItem value="tactile">Tactile</UI.SelectItem>
                          <UI.SelectItem value="clicky">Clicky</UI.SelectItem>
                        </UI.SelectContent>
                      </UI.Select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <UI.Select
                        defaultValue="any"
                        value={buildPrompt.budget}
                        onValueChange={(val) =>
                          setBuildPrompt((prev) => ({ ...prev, budget: val }))
                        }
                      >
                        <UI.SelectTrigger>
                          <UI.SelectValue placeholder="Budget" />
                        </UI.SelectTrigger>
                        <UI.SelectContent>
                          <UI.SelectItem value="any">Any Budget</UI.SelectItem>
                          <UI.SelectItem value="$50-150">
                            Budget ($50-150)
                          </UI.SelectItem>
                          <UI.SelectItem value="$150-300">
                            Mid-range ($150-300)
                          </UI.SelectItem>
                          <UI.SelectItem value="$300+">
                            High-end ($300+)
                          </UI.SelectItem>
                        </UI.SelectContent>
                      </UI.Select>

                      <UI.Select
                        defaultValue="any"
                        value={buildPrompt.soundProfile}
                        onValueChange={(val) =>
                          setBuildPrompt((prev) => ({
                            ...prev,
                            soundProfile: val,
                          }))
                        }
                      >
                        <UI.SelectTrigger>
                          <UI.SelectValue placeholder="Sound Profile" />
                        </UI.SelectTrigger>
                        <UI.SelectContent>
                          <UI.SelectItem value="any">Any Sound</UI.SelectItem>
                          <UI.SelectItem value="thocky">Thocky</UI.SelectItem>
                          <UI.SelectItem value="clacky">Clacky</UI.SelectItem>
                          <UI.SelectItem value="poppy">Poppy</UI.SelectItem>
                          <UI.SelectItem value="muted">Muted</UI.SelectItem>
                        </UI.SelectContent>
                      </UI.Select>
                    </div>
                  </div>

                  <UI.Button
                    onClick={generateBuild}
                    disabled={!buildPrompt || isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Build
                      </>
                    )}
                  </UI.Button>
                </div>

                {/* Generated Build */}
                <div className="border rounded-lg p-4">
                  {generatedBuild ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold">
                          {/* {generatedBuild.name} */}
                          AI Generated Build
                        </h3>
                        <p className="text-muted-foreground">
                          {generatedBuild.description}
                        </p>
                      </div>

                      <UI.Separator />

                      <div className="space-y-4">
                        <h4 className="font-bold">Components</h4>

                        <div className="flex justify-between items-start">
                          <div className="font-medium">
                            {generatedBuild.components.case}
                          </div>

                          <UI.Badge variant="outline">Case</UI.Badge>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="font-medium">
                            {generatedBuild.components.switches}
                          </div>

                          <UI.Badge variant="outline">Switches</UI.Badge>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="font-medium">
                            {generatedBuild.components.keycaps}
                          </div>

                          <UI.Badge variant="outline">Keycaps</UI.Badge>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="font-medium">
                            {generatedBuild.components.pcb}
                          </div>

                          <UI.Badge variant="outline">PCB</UI.Badge>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="font-medium">
                            {generatedBuild.components.stabilizers}
                          </div>

                          <UI.Badge variant="outline">Stabilizers</UI.Badge>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <UI.Button variant="outline">Refine Build</UI.Button>
                        <UI.Button>Create Collection</UI.Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                      <Wand2 className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        AI Build Assistant
                      </h3>
                      <p className="text-muted-foreground max-w-md">
                        Describe your preferences and let AI suggest the perfect
                        keyboard build for you
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </UI.CardContent>
          </UI.Card>
        </UI.TabsContent>

        {/* Switch Recommender Tab */}
        <UI.TabsContent value="switch" className="space-y-6">
          <UI.Card>
            <UI.CardHeader>
              <UI.CardTitle className="flex items-center">
                <Layers className="h-5 w-5 mr-2" />
                Switch Recommendation Engine
              </UI.CardTitle>
              <UI.CardDescription>
                Find the perfect switches based on your preferences
              </UI.CardDescription>
            </UI.CardHeader>
            <UI.CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Preferences Input */}
                <div className="space-y-6">
                  <div>
                    <UI.Label className="mb-2 block">Switch Type</UI.Label>
                    <div className="flex flex-wrap gap-2">
                      <UI.Badge
                        variant={
                          preferredType === "all" ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setPreferredType("all")}
                      >
                        All Types
                      </UI.Badge>
                      <UI.Badge
                        variant={
                          preferredType === "linear" ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setPreferredType("linear")}
                      >
                        Linear
                      </UI.Badge>
                      <UI.Badge
                        variant={
                          preferredType === "tactile" ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setPreferredType("tactile")}
                      >
                        Tactile
                      </UI.Badge>
                      <UI.Badge
                        variant={
                          preferredType === "clicky" ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setPreferredType("clicky")}
                      >
                        Clicky
                      </UI.Badge>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <UI.Label>Actuation Force</UI.Label>
                      <span className="text-sm">{preferredForce[0]}g</span>
                    </div>
                    <UI.Slider
                      min={35}
                      max={80}
                      step={1}
                      value={preferredForce}
                      onValueChange={setPreferredForce}
                    />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Light (35g)</span>
                      <span>Medium (55g)</span>
                      <span>Heavy (80g)</span>
                    </div>
                  </div>

                  <div>
                    <UI.Label className="mb-2 block">Sound Profile</UI.Label>
                    <div className="flex flex-wrap gap-2">
                      <UI.Badge
                        variant={
                          preferredSound === "all" ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setPreferredSound("all")}
                      >
                        All Sounds
                      </UI.Badge>
                      <UI.Badge
                        variant={
                          preferredSound === "thocky" ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setPreferredSound("thocky")}
                      >
                        Thocky
                      </UI.Badge>
                      <UI.Badge
                        variant={
                          preferredSound === "clacky" ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setPreferredSound("clacky")}
                      >
                        Clacky
                      </UI.Badge>
                      <UI.Badge
                        variant={
                          preferredSound === "muted" ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setPreferredSound("muted")}
                      >
                        Muted
                      </UI.Badge>
                      <UI.Badge
                        variant={
                          preferredSound === "poppy" ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setPreferredSound("poppy")}
                      >
                        Poppy
                      </UI.Badge>
                    </div>
                  </div>

                  <UI.Button onClick={recommendSwitches} className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Get Recommendations
                  </UI.Button>
                </div>

                {/* Recommendations */}
                <div className="border rounded-lg p-4">
                  {recommendedSwitches.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Recommended Switches
                      </h3>
                      <div className="space-y-3">
                        {recommendedSwitches.map((sw, index) => (
                          <div
                            key={index}
                            className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex justify-between">
                              <h4 className="font-medium">{sw.name}</h4>
                              <UI.Badge variant="outline">{sw.type}</UI.Badge>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <UI.Badge variant="secondary">
                                {sw.force}
                              </UI.Badge>
                              <UI.Badge variant="secondary">
                                {sw.sound}
                              </UI.Badge>
                            </div>
                            <div className="flex justify-end mt-2">
                              <UI.Button variant="ghost" size="sm">
                                Learn More
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </UI.Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                      <Layers className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        Switch Recommendations
                      </h3>
                      <p className="text-muted-foreground max-w-md">
                        Set your preferences and get personalized switch
                        recommendations
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </UI.CardContent>
          </UI.Card>
        </UI.TabsContent>
      </UI.Tabs>

      {/* Add Detected Item to collection dialog */}
      <UI.Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <UI.DialogContent>
          <UI.DialogHeader>
            <UI.DialogTitle>Add to Collection</UI.DialogTitle>
            <UI.DialogDescription>
              Add this detected {selectedComponent} to one of your collections
            </UI.DialogDescription>
          </UI.DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <UI.Label htmlFor="component-name">Component Name</UI.Label>
              <UI.Input
                id="component-name"
                placeholder={`Enter ${selectedComponent} name`}
                value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <UI.Label htmlFor="component-description">Description</UI.Label>
              <UI.Textarea
                id="component-description"
                placeholder="Enter a description"
                className="resize-none"
                 value={componentDescription}
              onChange={(e) => setComponentDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <UI.Label htmlFor="collection">Item Type</UI.Label>

              <UI.Select
                defaultValue={matchedItemType ? matchedItemType.id : ""}
              >
                <UI.SelectTrigger id="collection">
                  <UI.SelectValue placeholder="Select item type" />
                </UI.SelectTrigger>

                <UI.SelectContent>
                  {matchedItemType && (
                    <UI.SelectItem value={matchedItemType.id}>
                      {/* {matchedItemType.name} */}
                    </UI.SelectItem>
                  )}

                  {itemTypes.map((itemType, rx) => (
                    <UI.SelectItem key={rx} value={itemType.id}>
                      {itemType.name}
                    </UI.SelectItem>
                  ))}
                </UI.SelectContent>
              </UI.Select>
            </div>

            <div className="space-y-2">
              <UI.Label htmlFor="collection">Add to Collection</UI.Label>
              <UI.Select defaultValue="" value={selectedCollectionId} onValueChange={setSelectedCollectionId}>
                <UI.SelectTrigger id="collection">
                  <UI.SelectValue placeholder="Select collection" />
                </UI.SelectTrigger>
                <UI.SelectContent>
                  {collections.map((collection) => (
                    <UI.SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </UI.SelectItem>
                  ))}
                </UI.SelectContent>
              </UI.Select>
            </div>
          </div>

          <UI.DialogFooter>
            <UI.Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
            >
              Cancel
            </UI.Button>
            <UI.Button
              onClick={() => (
                addDetctedItemToCollection(), setShowAddDialog(false)
              )}
            >
              <Check className="h-4 w-4 mr-2" />
              Add Component
            </UI.Button>
          </UI.DialogFooter>
        </UI.DialogContent>
      </UI.Dialog>
    </div>
  );
}
