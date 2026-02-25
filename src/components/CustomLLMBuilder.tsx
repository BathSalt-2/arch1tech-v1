import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Brain,
  Copy,
  Download,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Sparkles,
  Settings,
  FileText,
  Code,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getGroqApiKey } from "@/lib/groq-key-storage";

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

type TabType = 'system-prompt' | 'modelfile' | 'finetune' | 'model-card';

interface GenerationResults {
  systemPrompt: string;
  modelfile: string;
  finetuningSamples: string;
  modelCard: string;
}

async function callGroq(apiKey: string, systemContent: string, userContent: string): Promise<string> {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: userContent },
      ],
      stream: false,
    }),
  });
  if (!response.ok) throw new Error(`API error ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

const GENERATION_STEPS = [
  'Analyzing description',
  'Generating system prompt',
  'Writing Modelfile',
  'Creating training data',
  'Building model card',
  'Complete!',
];

export function CustomLLMBuilder() {
  const [description, setDescription] = useState('');
  const [modelName, setModelName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GenerationResults | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('system-prompt');
  const [apiKeySet] = useState(() => !!getGroqApiKey());
  const [currentStep, setCurrentStep] = useState(0);
  const [copiedTab, setCopiedTab] = useState<TabType | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!description.trim()) return;
    const apiKey = getGroqApiKey();
    if (!apiKey) {
      toast({ title: 'API Key Required', description: 'Please add your Groq API key in Settings.', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    setCurrentStep(0);
    setResults(null);

    try {
      setCurrentStep(1);
      const systemPromptPromise = callGroq(
        apiKey,
        'You are an expert AI system prompt engineer.',
        `Generate a comprehensive system prompt for an AI assistant with this description: ${description}. The system prompt should define personality, capabilities, constraints, and style. Format: just the system prompt text, no other content.`
      );

      setCurrentStep(2);
      const modelfilePromise = callGroq(
        apiKey,
        'You are an expert in Ollama Modelfiles.',
        `Generate an Ollama Modelfile for an AI named '${modelName || 'MyAI'}' with this description: ${description}. Use 'FROM llama3.2' as base. Include SYSTEM, PARAMETER temperature, and PARAMETER num_ctx. Format: just the Modelfile content.`
      );

      setCurrentStep(3);
      const finetunePromise = callGroq(
        apiKey,
        'You are an expert in LLM fine-tuning data preparation.',
        `Generate 5 fine-tuning examples in JSONL format (one per line) for an AI assistant with this description: ${description}. Each line: {"messages": [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}`
      );

      setCurrentStep(4);
      const modelCardPromise = callGroq(
        apiKey,
        'You are an expert in HuggingFace model documentation.',
        `Generate a HuggingFace model card in markdown for a custom AI model named '${modelName || 'MyAI'}' with this description: ${description}. Include: Model Description, Use Cases, Limitations, Training Data, Evaluation, License (OOML).`
      );

      const [systemPrompt, modelfile, finetuningSamples, modelCard] = await Promise.all([
        systemPromptPromise,
        modelfilePromise,
        finetunePromise,
        modelCardPromise,
      ]);

      setCurrentStep(5);
      setResults({ systemPrompt, modelfile, finetuningSamples, modelCard });
      setActiveTab('system-prompt');
      toast({ title: 'Generation complete!', description: 'Your custom AI specs are ready.' });
    } catch (err) {
      toast({ title: 'Generation failed', description: String(err), variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string, tab: TabType) => {
    await navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleExport = () => {
    if (!results) return;
    const content = [
      '# System Prompt\n',
      results.systemPrompt,
      '\n\n---\n\n# Ollama Modelfile\n',
      results.modelfile,
      '\n\n---\n\n# Fine-tuning JSONL\n',
      results.finetuningSamples,
      '\n\n---\n\n# Model Card\n',
      results.modelCard,
    ].join('');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${modelName || 'my-ai'}-specs.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'system-prompt', label: 'System Prompt', icon: Settings },
    { id: 'modelfile', label: 'Ollama Modelfile', icon: Code },
    { id: 'finetune', label: 'Fine-tune Data', icon: FileText },
    { id: 'model-card', label: 'Model Card', icon: BookOpen },
  ];

  const getTabContent = (): string => {
    if (!results) return '';
    switch (activeTab) {
      case 'system-prompt': return results.systemPrompt;
      case 'modelfile': return results.modelfile;
      case 'finetune': return results.finetuningSamples;
      case 'model-card': return results.modelCard;
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-full flex items-center justify-center">
          <Brain className="w-4 h-4 text-midnight-blue" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gradient-cosmic">Custom LLM Builder</h1>
          <p className="text-sm text-muted-foreground">Generate My AI — from words to deployable specs</p>
        </div>
      </div>

      {/* API Key Warning */}
      {!apiKeySet && (
        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-sm">
            Groq API key not set.{' '}
            <a href="/settings" className="text-neon-cyan underline">Go to Settings</a>{' '}to add your key.
            Get a free key at{' '}
            <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-neon-cyan underline">console.groq.com</a>
          </AlertDescription>
        </Alert>
      )}

      {/* Description Input */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base">Describe Your AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={`Describe your AI in plain English. Example:\n\n"A helpful customer service AI that answers questions about software products, is friendly and concise, and knows Python and JavaScript. It should escalate to a human when it's unsure, and never make up information."`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-muted/20 border-neon-purple/20 focus:border-neon-purple/50 min-h-32"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Model Name (optional)</label>
              <Input
                placeholder="e.g., SupportBot, CodeHelper, DataAnalyst"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="bg-muted/20 border-neon-purple/20 focus:border-neon-purple/50"
              />
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !description.trim()}
        className="w-full h-14 text-base font-semibold bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90 text-midnight-blue shadow-lg shadow-neon-purple/30 transition-all"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Generate My AI
          </>
        )}
      </Button>

      {/* Generation Progress */}
      {isGenerating && (
        <Card className="border-neon-cyan/30 bg-neon-cyan/5">
          <CardContent className="p-4 space-y-3">
            <p className="text-sm font-medium text-neon-cyan">Generating your AI specs...</p>
            <div className="space-y-2">
              {GENERATION_STEPS.map((step, i) => (
                <div key={step} className={`flex items-center space-x-2 text-xs ${
                  i < currentStep ? 'text-neon-green' :
                  i === currentStep ? 'text-neon-cyan animate-pulse' :
                  'text-muted-foreground'
                }`}>
                  {i < currentStep ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : i === currentStep ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-current" />
                  )}
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && (
        <Card className="holographic-border">
          <div className="holographic-content">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-neon-green">✓ Your AI Specs Ready</CardTitle>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tabs */}
              <div className="flex flex-wrap gap-1">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      activeTab === id
                        ? 'bg-neon-purple text-midnight-blue'
                        : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Code Block */}
              <div className="relative">
                <pre className="bg-midnight-blue/50 border border-neon-purple/20 rounded-lg p-3 text-xs text-foreground overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {getTabContent()}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-7 w-7 p-0"
                  onClick={() => handleCopy(getTabContent(), activeTab)}
                >
                  {copiedTab === activeTab ? (
                    <CheckCircle className="w-4 h-4 text-neon-green" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      )}
    </div>
  );
}
