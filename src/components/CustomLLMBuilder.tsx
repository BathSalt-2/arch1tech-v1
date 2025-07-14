import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { 
  Brain, 
  Upload, 
  Zap, 
  Settings, 
  Play,
  Save,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Cpu
} from "lucide-react";

export function CustomLLMBuilder() {
  const [modelName, setModelName] = useState("");
  const [description, setDescription] = useState("");
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([512]);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);

  const baseModels = [
    { 
      id: "phi3-mini", 
      name: "Phi-3 Mini", 
      size: "3.8B", 
      type: "Instruction Following",
      description: "Lightweight model for general tasks"
    },
    { 
      id: "llama2-7b", 
      name: "Llama 2 7B", 
      size: "7B", 
      type: "General Purpose",
      description: "Balanced performance and efficiency"
    },
    { 
      id: "mistral-7b", 
      name: "Mistral 7B", 
      size: "7B", 
      type: "Code & Reasoning",
      description: "Specialized for technical tasks"
    },
    { 
      id: "codellama-7b", 
      name: "Code Llama 7B", 
      size: "7B", 
      type: "Code Generation",
      description: "Optimized for programming tasks"
    }
  ];

  const [selectedBaseModel, setSelectedBaseModel] = useState(baseModels[0].id);

  const trainingSteps = [
    { id: 1, name: "Data Upload", status: "completed", icon: Upload },
    { id: 2, name: "Preprocessing", status: "completed", icon: Settings },
    { id: 3, name: "Fine-tuning", status: "active", icon: Brain },
    { id: 4, name: "Validation", status: "pending", icon: CheckCircle },
    { id: 5, name: "Deployment", status: "pending", icon: Zap }
  ];

  const handleStartTraining = () => {
    setIsTraining(true);
    // Simulate training progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        setIsTraining(false);
        clearInterval(interval);
      }
      setTrainingProgress(progress);
    }, 1000);
  };

  const getStepStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-neon-green" />;
      case 'active':
        return <Clock className="w-4 h-4 text-neon-cyan animate-pulse" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-neon-purple to-neon-pink rounded-full flex items-center justify-center">
          <Brain className="w-4 h-4 text-midnight-blue" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gradient-cosmic">Custom LLM Builder</h1>
          <p className="text-sm text-muted-foreground">Train your specialized model</p>
        </div>
      </div>

      {/* Model Configuration */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base">Model Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Model Name</label>
              <Input
                placeholder="e.g., customer-support-specialist"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="bg-muted/20 border-neon-purple/20 focus:border-neon-purple/50"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe your model's purpose and capabilities..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-muted/20 border-neon-purple/20 focus:border-neon-purple/50 min-h-20"
              />
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Base Model Selection */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base">Base Model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {baseModels.map((model) => (
              <div
                key={model.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedBaseModel === model.id
                    ? 'border-neon-purple bg-neon-purple/10'
                    : 'border-muted bg-muted/20 hover:border-neon-purple/30'
                }`}
                onClick={() => setSelectedBaseModel(model.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{model.name}</h4>
                      <Badge variant="outline" className="text-xs">{model.size}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
                  </div>
                  <Badge variant="secondary">{model.type}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </div>
      </Card>

      {/* Training Parameters */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base">Training Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Temperature</label>
                <span className="text-sm text-muted-foreground">{temperature[0]}</span>
              </div>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Lower values make the model more focused and deterministic
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Max Tokens</label>
                <span className="text-sm text-muted-foreground">{maxTokens[0]}</span>
              </div>
              <Slider
                value={maxTokens}
                onValueChange={setMaxTokens}
                max={2048}
                min={128}
                step={64}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Maximum length of generated responses
              </p>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Training Data */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base">Training Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full h-16 border-dashed border-2 border-neon-cyan/30 hover:border-neon-cyan/50">
              <Upload className="w-5 h-5 mr-2 text-neon-cyan" />
              <span>Upload training dataset (JSON, CSV, TXT)</span>
            </Button>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-neon-cyan">2.5K</div>
                <div className="text-xs text-muted-foreground">Examples</div>
              </div>
              <div>
                <div className="text-lg font-bold text-neon-green">98%</div>
                <div className="text-xs text-muted-foreground">Quality</div>
              </div>
              <div>
                <div className="text-lg font-bold text-neon-purple">4.2MB</div>
                <div className="text-xs text-muted-foreground">Size</div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Training Progress */}
      {isTraining && (
        <Card className="border-neon-cyan/30 bg-neon-cyan/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-neon-cyan animate-pulse" />
                <span className="text-sm font-medium">Training in progress...</span>
              </div>
              <span className="text-sm text-neon-cyan">{Math.round(trainingProgress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-neon-cyan h-2 rounded-full transition-all duration-300"
                style={{ width: `${trainingProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Estimated time remaining: {Math.round((100 - trainingProgress) / 10)} minutes
            </p>
          </CardContent>
        </Card>
      )}

      {/* Training Pipeline */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base">Training Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trainingSteps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8">
                  {getStepStatus(step.status)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{step.name}</p>
                </div>
                {index < trainingSteps.length - 1 && (
                  <div className="w-px h-6 bg-muted mx-4" />
                )}
              </div>
            ))}
          </CardContent>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          variant="neon" 
          className="w-full h-12"
          onClick={handleStartTraining}
          disabled={isTraining || !modelName.trim()}
        >
          {isTraining ? (
            <>
              <Cpu className="w-4 h-4 mr-2 animate-pulse" />
              Training...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Training
            </>
          )}
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save Config
          </Button>
          <Button variant="ghost">
            <FileText className="w-4 h-4 mr-2" />
            View Logs
          </Button>
        </div>
      </div>

      {/* Model Performance Preview */}
      <Card className="border-neon-green/30 bg-neon-green/5">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-neon-green rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-midnight-blue" />
            </div>
            <div>
              <p className="text-sm font-medium">Expected Performance</p>
              <p className="text-xs text-muted-foreground">
                Based on similar models: 92% accuracy • 1.2s avg response time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}