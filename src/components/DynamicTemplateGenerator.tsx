import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Sparkles, 
  Code, 
  Download, 
  Save,
  Rocket,
  Layers,
  Database,
  Smartphone,
  Globe,
  Zap
} from "lucide-react";

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tech_stack: string[];
  features: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_time: string;
  code_structure: any;
}

interface GenerationRequest {
  project_type: string;
  target_platform: string;
  features: string[];
  tech_preferences: string[];
  complexity: string;
  description: string;
}

export const DynamicTemplateGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<ProjectTemplate | null>(null);
  const [request, setRequest] = useState<GenerationRequest>({
    project_type: '',
    target_platform: '',
    features: [],
    tech_preferences: [],
    complexity: '',
    description: ''
  });

  const projectTypes = [
    "Web Application",
    "Mobile App", 
    "Desktop Application",
    "API/Backend Service",
    "E-commerce Platform",
    "Social Media App",
    "Analytics Dashboard",
    "AI/ML Project",
    "Game",
    "Educational Platform"
  ];

  const platforms = [
    "Web (React/Vue/Angular)",
    "Mobile (React Native/Flutter)",
    "Desktop (Electron)",
    "Backend (Node.js/Python/Java)",
    "Full Stack",
    "Cross Platform"
  ];

  const availableFeatures = [
    "User Authentication",
    "Real-time Updates",
    "File Upload/Storage",
    "Payment Integration",
    "Push Notifications",
    "Social Login",
    "Analytics & Tracking",
    "Search Functionality",
    "Chat/Messaging",
    "AI Integration",
    "Database Management",
    "API Integration",
    "Responsive Design",
    "Offline Support",
    "Multi-language Support"
  ];

  const techOptions = [
    "React", "Vue.js", "Angular", "Svelte",
    "Node.js", "Python", "Java", "Go",
    "MongoDB", "PostgreSQL", "Firebase",
    "TypeScript", "GraphQL", "REST API",
    "Tailwind CSS", "Material-UI", "Bootstrap"
  ];

  const generateTemplate = async () => {
    if (!request.project_type || !request.target_platform || !request.description) {
      alert("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation (in real implementation, this would call an AI service)
    setTimeout(() => {
      const mockTemplate: ProjectTemplate = {
        id: `template_${Date.now()}`,
        name: `${request.project_type} - ${Date.now()}`,
        description: `AI-generated template for ${request.project_type} targeting ${request.target_platform}`,
        category: request.project_type,
        tech_stack: request.tech_preferences,
        features: request.features,
        difficulty: request.complexity as 'beginner' | 'intermediate' | 'advanced',
        estimated_time: request.complexity === 'beginner' ? '1-2 weeks' : request.complexity === 'intermediate' ? '3-6 weeks' : '2-3 months',
        code_structure: {
          directories: [
            "src/",
            "src/components/",
            "src/pages/",
            "src/hooks/",
            "src/utils/",
            "src/styles/",
            "public/",
            "tests/"
          ],
          entry_points: ["src/main.tsx", "src/App.tsx"],
          config_files: ["package.json", "vite.config.ts", "tailwind.config.ts"],
          key_components: request.features.map(f => `${f.replace(/\s+/g, '')}Component.tsx`)
        }
      };

      setGeneratedTemplate(mockTemplate);
      setIsGenerating(false);
    }, 3000);
  };

  const toggleFeature = (feature: string) => {
    setRequest(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const toggleTech = (tech: string) => {
    setRequest(prev => ({
      ...prev,
      tech_preferences: prev.tech_preferences.includes(tech)
        ? prev.tech_preferences.filter(t => t !== tech)
        : [...prev.tech_preferences, tech]
    }));
  };

  const saveTemplate = async () => {
    if (!generatedTemplate) return;
    
    // In real implementation, save to database
    console.log("Saving template:", generatedTemplate);
    alert("Template saved successfully!");
  };

  const downloadTemplate = () => {
    if (!generatedTemplate) return;
    
    const dataStr = JSON.stringify(generatedTemplate, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generatedTemplate.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Dynamic Project Template Generator
            {isGenerating && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Generation Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Project Type *</Label>
                <Select value={request.project_type} onValueChange={(value) => setRequest(prev => ({ ...prev, project_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Target Platform *</Label>
                <Select value={request.target_platform} onValueChange={(value) => setRequest(prev => ({ ...prev, target_platform: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map(platform => (
                      <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Complexity Level</Label>
                <Select value={request.complexity} onValueChange={(value) => setRequest(prev => ({ ...prev, complexity: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Project Description *</Label>
                <Textarea
                  value={request.description}
                  onChange={(e) => setRequest(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project in detail. What does it do? Who are the users? What problems does it solve?"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Features to Include</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableFeatures.map(feature => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={request.features.includes(feature)}
                        onCheckedChange={() => toggleFeature(feature)}
                      />
                      <Label htmlFor={feature} className="text-sm">{feature}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Technology Preferences</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {techOptions.map(tech => (
                    <div key={tech} className="flex items-center space-x-2">
                      <Checkbox
                        id={tech}
                        checked={request.tech_preferences.includes(tech)}
                        onCheckedChange={() => toggleTech(tech)}
                      />
                      <Label htmlFor={tech} className="text-sm">{tech}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={generateTemplate}
            disabled={isGenerating}
            size="lg"
            className="w-full gap-2"
          >
            <Sparkles className="h-5 w-5" />
            {isGenerating ? "Generating Template..." : "Generate AI Template"}
          </Button>

          {/* Generated Template */}
          {generatedTemplate && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Code className="h-5 w-5" />
                Generated Template
              </h3>
              
              <Alert>
                <Rocket className="h-4 w-4" />
                <AlertDescription>
                  Template generated successfully! Review the details below and save or download.
                </AlertDescription>
              </Alert>

              <Card className="bg-muted/30">
                <CardContent className="p-4 space-y-4">
                  <div>
                    <h4 className="font-medium">{generatedTemplate.name}</h4>
                    <p className="text-sm text-muted-foreground">{generatedTemplate.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Tech Stack</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {generatedTemplate.tech_stack.map(tech => (
                          <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Features</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {generatedTemplate.features.map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">{feature}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label className="text-xs text-muted-foreground">Difficulty</Label>
                      <div className="capitalize">{generatedTemplate.difficulty}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Est. Time</Label>
                      <div>{generatedTemplate.estimated_time}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Components</Label>
                      <div>{generatedTemplate.code_structure.key_components.length} files</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={saveTemplate} variant="default" className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Template
                    </Button>
                    <Button onClick={downloadTemplate} variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};