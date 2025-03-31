"use client";
import { useState, useRef } from "react";
import Image from "next/image";

import * as UI from "@/components/ui/index";

import {Keyboard,Upload,Camera,Wand2,Headphones,PaintBucket,Layers,Zap,ChevronRight,X,Check,Loader2,Search,PlusCircle,Info,} from "lucide-react";
import Sparkles from "@/public/Sparkles.svg"

// Mock switch types for recommendations
const switchTypes = [
    { name: "Gateron Black Ink V2", type: "Linear", force: "Medium-Heavy", sound: "Thocky" },
    { name: "Holy Panda", type: "Tactile", force: "Medium", sound: "Clacky" },
    { name: "Cherry MX Blue", type: "Clicky", force: "Medium", sound: "Clicky" },
    { name: "Boba U4T", type: "Tactile", force: "Medium-Heavy", sound: "Thocky" },
    { name: "Alpaca", type: "Linear", force: "Medium", sound: "Muted" },
    { name: "NK Cream", type: "Linear", force: "Medium-Heavy", sound: "Clacky" },
    { name: "Zealios V2", type: "Tactile", force: "Heavy", sound: "Tactile" },
    { name: "Tangerine", type: "Linear", force: "Light", sound: "Smooth" },
  ]

  

export default function ToolboxPage() {
  const [activeTab, setActiveTab] = useState("detect");

  // Analyzer
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResults, setDetectionResults] = useState<{ component: string; confidence: number }[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  // For build assistant
  const [buildPrompt, setBuildPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBuild, setGeneratedBuild] = useState<any | null>(null);

  // For switch recommender
  const [preferredType, setPreferredType] = useState<string>("all")
  const [preferredForce, setPreferredForce] = useState<number[]>([50])
  const [preferredSound, setPreferredSound] = useState<string>("all")
  const [recommendedSwitches, setRecommendedSwitches] = useState<any[]>([])

  // For Analyzer
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setDetectionResults([]);
    }
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

  const analyzeImage = () => {
    if (!imageUrl) return;

    setIsAnalyzing(true);

    // CALL AI API HERE
    console.log("analyzing image...");
  };

  const addToCollection = (component: string) => {
    setSelectedComponent(component);
    setShowAddDialog(true);
  };

  // FOR   Build Assistant
  const generateBuild = () => {
    if (!buildPrompt) return;

    setIsGenerating(true);

    // Simulate API call to an LLM
    setTimeout(() => {
      // Mock generated build
      const mockBuild = {
        name: "Minimalist TKL Build",
        description:
          "A clean and professional TKL keyboard with tactile switches and a muted sound profile.",
        components: [
          {
            type: "Case",
            name: "KBDfans Tofu84 Aluminum Case",
            description: "Gray aluminum case with a 7° typing angle",
          },
          {
            type: "PCB",
            name: "KBD8X MKII PCB",
            description: "Hot-swappable PCB with RGB underglow",
          },
          {
            type: "Plate",
            name: "Brass Plate",
            description: "Provides a firm typing experience",
          },
          {
            type: "Switches",
            name: "Boba U4T",
            description: "Tactile switches with a thocky sound profile",
          },
          {
            type: "Keycaps",
            name: "GMK Minimal",
            description: "Clean black-on-white Cherry profile keycaps",
          },
          {
            type: "Stabilizers",
            name: "Durock V2",
            description: "Screw-in stabilizers, lubed with Krytox 205g0",
          },
        ],
      };

      setGeneratedBuild(mockBuild);
      setIsGenerating(false);
    }, 3000);
  };

//   FOR Switch Recommender
const recommendSwitches = () => {
    // Filter switches based on preferences
    let filtered = [...switchTypes]

    if (preferredType !== "all") {
      filtered = filtered.filter((s) => s.type.toLowerCase() === preferredType.toLowerCase())
    }

    if (preferredSound !== "all") {
      filtered = filtered.filter((s) => s.sound.toLowerCase() === preferredSound.toLowerCase())
    }

    // Force is more complex - we'd match based on ranges
    // For this demo, we'll just sort by how close they are to the preferred force
    const forceValue = preferredForce[0]
    const forceMap: { [key: string]: number } = {
      Light: 45,
      Medium: 55,
      "Medium-Heavy": 65,
      Heavy: 75,
    }

    filtered = filtered.sort((a, b) => {
      const aForce = forceMap[a.force] || 60
      const bForce = forceMap[b.force] || 60
      return Math.abs(aForce - forceValue) - Math.abs(bForce - forceValue)
    })

    setRecommendedSwitches(filtered)
  }

  return (
    <div className="min-h-screen mx-auto container px-4 py-8">
      <div className="flex items-center mb-8">
        <div className="mr-auto">
          <h1 className="text-3xl font-bold flex items-center">
            <Image src={Sparkles} alt="AI Detection sparkles" width={32} height={32} className="mr-2" />
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
                  <div>
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
                  </div>

                  <div className="flex flex-col gap-2">
                    <UI.Label>Preferences (optional)</UI.Label>
                    <div className="grid grid-cols-2 gap-2">
                      <UI.Select defaultValue="any">
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

                      <UI.Select defaultValue="any">
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
                      <UI.Select defaultValue="any">
                        <UI.SelectTrigger>
                          <UI.SelectValue placeholder="Budget" />
                        </UI.SelectTrigger>
                        <UI.SelectContent>
                          <UI.SelectItem value="any">Any Budget</UI.SelectItem>
                          <UI.SelectItem value="budget">
                            Budget ($50-150)
                          </UI.SelectItem>
                          <UI.SelectItem value="mid">
                            Mid-range ($150-300)
                          </UI.SelectItem>
                          <UI.SelectItem value="high">
                            High-end ($300+)
                          </UI.SelectItem>
                        </UI.SelectContent>
                      </UI.Select>

                      <UI.Select defaultValue="any">
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
                            {generatedBuild.name}
                            </h3>
                            <p className="text-muted-foreground">
                            {generatedBuild.description}
                            </p>
                        </div>

                        <UI.Separator />

                        <div className="space-y-3">
                            <h4 className="font-medium">Components</h4>
                            {generatedBuild.components.map(
                            (component: any, index: number) => (
                                <div
                                key={index}
                                className="flex justify-between items-start"
                                >
                                <div>
                                    <div className="font-medium">
                                    {component.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                    {component.description}
                                    </div>
                                </div>
                                <UI.Badge variant="outline">{component.type}</UI.Badge>
                                </div>
                            )
                            )}
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
              <UI.CardDescription>Find the perfect switches based on your preferences</UI.CardDescription>
            </UI.CardHeader>
            <UI.CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Preferences Input */}
                <div className="space-y-6">
                  <div>
                    <UI.Label className="mb-2 block">Switch Type</UI.Label>
                    <div className="flex flex-wrap gap-2">
                      <UI.Badge
                        variant={preferredType === "all" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setPreferredType("all")}
                      >
                        All Types
                      </UI.Badge>
                      <UI.Badge
                        variant={preferredType === "linear" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setPreferredType("linear")}
                      >
                        Linear
                      </UI.Badge>
                      <UI.Badge
                        variant={preferredType === "tactile" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setPreferredType("tactile")}
                      >
                        Tactile
                      </UI.Badge>
                      <UI.Badge
                        variant={preferredType === "clicky" ? "default" : "outline"}
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
                    <UI.Slider min={35} max={80} step={1} value={preferredForce} onValueChange={setPreferredForce} />
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
                        variant={preferredSound === "all" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setPreferredSound("all")}
                      >
                        All Sounds
                      </UI.Badge>
                      <UI.Badge
                        variant={preferredSound === "thocky" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setPreferredSound("thocky")}
                      >
                        Thocky
                      </UI.Badge>
                      <UI.Badge
                        variant={preferredSound === "clacky" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setPreferredSound("clacky")}
                      >
                        Clacky
                      </UI.Badge>
                      <UI.Badge
                        variant={preferredSound === "muted" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setPreferredSound("muted")}
                      >
                        Muted
                      </UI.Badge>
                      <UI.Badge
                        variant={preferredSound === "poppy" ? "default" : "outline"}
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
                      <h3 className="text-lg font-medium">Recommended Switches</h3>
                      <div className="space-y-3">
                        {recommendedSwitches.map((sw, index) => (
                          <div key={index} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{sw.name}</h4>
                              <UI.Badge variant="outline">{sw.type}</UI.Badge>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <UI.Badge variant="secondary">{sw.force}</UI.Badge>
                              <UI.Badge variant="secondary">{sw.sound}</UI.Badge>
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
                      <h3 className="text-lg font-medium mb-2">Switch Recommendations</h3>
                      <p className="text-muted-foreground max-w-md">
                        Set your preferences and get personalized switch recommendations
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </UI.CardContent>
          </UI.Card>
        </UI.TabsContent>
      </UI.Tabs>
    </div>
  );
}
