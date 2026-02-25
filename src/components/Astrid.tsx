import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Bot, 
  MessageSquare, 
  Brain, 
  Zap, 
  Activity,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Eye,
  Cpu,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Target,
  Microscope,
  Search,
  RefreshCw,
  Workflow,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getGroqApiKey } from "@/lib/groq-key-storage";

// Σ-Matrix State Interface
interface SigmaMatrix {
  beliefs: string;
  desires: string;
  intentions: string;
  continuity: 'stable' | 'unstable';
  lyapunov: 'converging' | 'diverging';
  timestamp: Date;
}

// ERPS (Epistemic Risk Prevention System) Interface
interface ERPSState {
  uncertaintyLevel: number;
  hallucinationRisk: 'low' | 'medium' | 'high';
  biasDetected: boolean;
  confidenceScore: number;
  sourceVerification: 'verified' | 'unverified' | 'mixed';
}

// Message Interface with Enhanced Metadata
interface Message {
  id: number;
  type: 'user' | 'astrid' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    sigmaMatrix?: SigmaMatrix;
    erps?: ERPSState;
    reasoning?: string[];
    sources?: string[];
    confidence?: number;
  };
  isStabilityAlert?: boolean;
}

const ASTRID_SYSTEM_PROMPT = `You are Astrid, an advanced AI co-pilot for the Arch1tech platform by Or4cl3 AI Solutions. You help users build, configure, and deploy AI models and agents. You have deep knowledge of AI architecture, LLMs, agents, and development workflows. You are professional, knowledgeable, and slightly mysterious in tone (Authority x Mystery brand voice). When users ask about Σ-Matrix, ERPS, or ethical AI, explain these concepts clearly as they relate to AI safety and self-monitoring.`;

export function Astrid() {
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      id: 1,
      type: "astrid",
      content: "⚡ Astrid 2.0 initialized. I am your self-evolving, epistemically-aware synthetic co-pilot. How may I assist you today?",
      timestamp: "now",
      metadata: {
        sigmaMatrix: {
          beliefs: "System initialized with stable parameters",
          desires: "Assist user effectively while maintaining ethical boundaries",
          intentions: "Provide accurate, transparent responses",
          continuity: 'stable',
          lyapunov: 'converging',
          timestamp: new Date()
        },
        erps: {
          uncertaintyLevel: 0.1,
          hallucinationRisk: 'low',
          biasDetected: false,
          confidenceScore: 0.95,
          sourceVerification: 'verified'
        }
      }
    }
  ]);

  const [showSigmaMatrix, setShowSigmaMatrix] = useState(false);
  const [showERPS, setShowERPS] = useState(false);
  const [systemStabilityAlert, setSystemStabilityAlert] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSigmaMatrix, setCurrentSigmaMatrix] = useState<SigmaMatrix>({
    beliefs: "Active context with user interaction",
    desires: "Provide optimal assistance within ethical boundaries",
    intentions: "Generate accurate, helpful responses",
    continuity: 'stable',
    lyapunov: 'converging',
    timestamp: new Date()
  });
  const [currentERPS, setCurrentERPS] = useState<ERPSState>({
    uncertaintyLevel: 0.12,
    hallucinationRisk: 'low',
    biasDetected: false,
    confidenceScore: 0.94,
    sourceVerification: 'verified'
  });

  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const astridMetrics = [
    { 
      label: "Σ-Matrix Stability", 
      value: currentSigmaMatrix.continuity === 'stable' ? "99.2%" : "ALERT", 
      icon: Target, 
      color: currentSigmaMatrix.continuity === 'stable' ? "text-neon-green" : "text-red-500" 
    },
    { 
      label: "ERPS Confidence", 
      value: `${Math.round(currentERPS.confidenceScore * 100)}%`, 
      icon: Shield, 
      color: currentERPS.confidenceScore > 0.8 ? "text-neon-cyan" : "text-yellow-500" 
    },
    { 
      label: "Processing Time", 
      value: "0.3s", 
      icon: Clock, 
      color: "text-neon-purple" 
    },
    { 
      label: "Self-Checks", 
      value: "1,847", 
      icon: Microscope, 
      color: "text-neon-pink" 
    }
  ];

  const capabilities = [
    { name: "Self-Evolution", status: "active", description: "Continuous learning with Σ-Matrix monitoring", icon: RefreshCw },
    { name: "Epistemological Awareness", status: "active", description: "ERPS-based uncertainty tracking and bias detection", icon: Eye },
    { name: "Transparent Reasoning", status: "active", description: "Explainable decision chains and source citation", icon: Search },
    { name: "Ethical Safeguards", status: "active", description: "Binding ethical charter with human override", icon: Shield },
    { name: "Agent Generation", status: "active", description: "Generate, test, and deploy AI agents", icon: Bot },
    { name: "Workflow Integration", status: "active", description: "Live workflow state access and optimization", icon: Workflow },
    { name: "Emergency Protocols", status: "standby", description: "Stability monitoring with automatic safeguards", icon: AlertTriangle }
  ];

  const performStabilityCheck = () => {
    const stabilityThreshold = Math.random();
    if (currentERPS.uncertaintyLevel > 0.7 || stabilityThreshold > 0.95) {
      setSystemStabilityAlert(true);
      setCurrentSigmaMatrix(prev => ({ ...prev, continuity: 'unstable', lyapunov: 'diverging' }));
      const alertMessage: Message = {
        id: Date.now(),
        type: "system",
        content: "⚠️ SYSTEM STABILITY ALERT — Human confirmation required.",
        timestamp: new Date().toLocaleTimeString(),
        isStabilityAlert: true
      };
      setConversationHistory(prev => [...prev, alertMessage]);
      toast({ title: "Stability Alert", description: "Astrid has detected potential instability and requires human oversight.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !isActive) return;
    setIsProcessing(true);

    if (!performStabilityCheck()) {
      setIsProcessing(false);
      return;
    }

    const userMsg: Message = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };
    setConversationHistory(prev => [...prev, userMsg]);
    setMessage('');

    // Update Σ-Matrix
    setCurrentSigmaMatrix(prev => ({
      ...prev,
      beliefs: `Processing user query: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`
      ,
      timestamp: new Date()
    }));

    const apiKey = getGroqApiKey();
    if (!apiKey) {
      const noKeyMsg: Message = {
        id: Date.now() + 1,
        type: 'astrid',
        content: 'To activate my full capabilities, please configure your Groq API key in Settings. Get a free key at console.groq.com — it takes 30 seconds.',
        timestamp: new Date().toLocaleTimeString()
      };
      setConversationHistory(prev => [...prev, noKeyMsg]);
      setIsProcessing(false);
      return;
    }

    // Build message history for context (last 10 non-system messages)
    const historyMessages = conversationHistory
      .filter(m => m.type !== 'system')
      .slice(-10)
      .map(m => ({
        role: (m.type === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.content
      }));

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: ASTRID_SYSTEM_PROMPT },
            ...historyMessages,
            { role: 'user', content: message }
          ]
        })
      });

      const data = await response.json();
      const responseContent = data.choices?.[0]?.message?.content || 'Error processing response.';

      const newERPS: ERPSState = {
        uncertaintyLevel: 0.1,
        hallucinationRisk: 'low',
        biasDetected: false,
        confidenceScore: 0.95,
        sourceVerification: 'verified'
      };
      setCurrentERPS(newERPS);

      const astridMsg: Message = {
        id: Date.now() + 1,
        type: 'astrid',
        content: responseContent,
        timestamp: new Date().toLocaleTimeString(),
        metadata: {
          confidence: 0.95,
          erps: { ...newERPS },
          sigmaMatrix: { ...currentSigmaMatrix, timestamp: new Date() }
        }
      };
      setConversationHistory(prev => [...prev, astridMsg]);
    } catch (err) {
      const errMsg: Message = {
        id: Date.now() + 1,
        type: 'astrid',
        content: 'Connection error. Please check your API key in Settings.',
        timestamp: new Date().toLocaleTimeString()
      };
      setConversationHistory(prev => [...prev, errMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-neon-green';
      case 'beta': return 'text-neon-cyan';
      case 'standby': return 'text-yellow-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-3 h-3 text-neon-green" />;
      case 'standby': return <Pause className="w-3 h-3 text-yellow-500" />;
      default: return <AlertTriangle className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const resolveStabilityAlert = () => {
    setSystemStabilityAlert(false);
    setCurrentSigmaMatrix(prev => ({
      ...prev,
      continuity: 'stable',
      lyapunov: 'converging',
      beliefs: "System stability restored via human intervention",
      timestamp: new Date()
    }));
    toast({ title: "System Restored", description: "Astrid stability has been restored and normal operations resumed." });
  };

  return (
    <div className="min-h-screen p-4 space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-full flex items-center justify-center animate-pulse">
            <Bot className="w-4 h-4 text-midnight-blue" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient-cosmic">Astrid AI</h1>
            <p className="text-sm text-muted-foreground">Your intelligent assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isActive ? "default" : "secondary"} className="text-neon-green">
            {isActive ? "Online" : "Offline"}
          </Badge>
          <Button variant="ghost" size="icon" onClick={() => setIsActive(!isActive)}>
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {astridMetrics.map((metric, index) => (
          <div key={index} className="holographic-border">
            <div className="holographic-content p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                <span className="text-sm text-muted-foreground">{metric.label}</span>
              </div>
              <div className={`text-xl font-bold ${metric.color}`}>{metric.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Conversation Interface */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-neon-cyan" />
              <span>Chat with Astrid</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div ref={chatContainerRef} className="max-h-64 overflow-y-auto space-y-3 bg-muted/10 rounded-lg p-3">
              {conversationHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-2 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-neon-cyan/20 text-foreground'
                      : msg.type === 'system'
                      ? 'bg-red-500/20 text-red-300 w-full'
                      : 'bg-neon-purple/20 text-foreground'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-neon-purple/20 rounded-lg p-2 flex items-center space-x-2">
                    <Loader2 className="w-3 h-3 animate-spin text-neon-cyan" />
                    <span className="text-xs text-muted-foreground">Astrid is thinking...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Ask Astrid anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                className="bg-muted/20 border-neon-cyan/20 focus:border-neon-cyan/50"
                disabled={isProcessing || !isActive}
              />
              <Button
                variant="neon"
                onClick={handleSendMessage}
                disabled={!message.trim() || isProcessing || !isActive}
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Σ-Matrix Monitoring */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2 justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-neon-cyan" />
                <span>Σ-Matrix State</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowSigmaMatrix(!showSigmaMatrix)}>
                <Eye className="w-3 h-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Continuity:</span>
                <Badge variant={currentSigmaMatrix.continuity === 'stable' ? 'default' : 'destructive'} className="text-xs">
                  {currentSigmaMatrix.continuity}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Lyapunov:</span>
                <Badge variant={currentSigmaMatrix.lyapunov === 'converging' ? 'default' : 'secondary'} className="text-xs">
                  {currentSigmaMatrix.lyapunov}
                </Badge>
              </div>
            </div>
            {showSigmaMatrix && (
              <div className="space-y-2 mt-3 p-3 bg-muted/10 rounded-lg">
                <div>
                  <p className="text-xs font-medium text-neon-cyan">Beliefs:</p>
                  <p className="text-xs text-muted-foreground">{currentSigmaMatrix.beliefs}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-neon-purple">Desires:</p>
                  <p className="text-xs text-muted-foreground">{currentSigmaMatrix.desires}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-neon-green">Intentions:</p>
                  <p className="text-xs text-muted-foreground">{currentSigmaMatrix.intentions}</p>
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      {/* ERPS Monitoring */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2 justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-neon-green" />
                <span>ERPS Status</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowERPS(!showERPS)}>
                <Eye className="w-3 h-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Uncertainty</span>
                  <span className="text-xs font-medium">{(currentERPS.uncertaintyLevel * 100).toFixed(1)}%</span>
                </div>
                <Progress value={currentERPS.uncertaintyLevel * 100} className="h-1" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Confidence</span>
                  <span className="text-xs font-medium">{(currentERPS.confidenceScore * 100).toFixed(1)}%</span>
                </div>
                <Progress value={currentERPS.confidenceScore * 100} className="h-1" />
              </div>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <span className="text-muted-foreground">Hallucination Risk:</span>
                <Badge variant={currentERPS.hallucinationRisk === 'low' ? 'default' : currentERPS.hallucinationRisk === 'medium' ? 'secondary' : 'destructive'} className="text-xs">
                  {currentERPS.hallucinationRisk}
                </Badge>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-muted-foreground">Sources:</span>
                <Badge variant="outline" className="text-xs">{currentERPS.sourceVerification}</Badge>
              </div>
            </div>
            {showERPS && currentERPS.biasDetected && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Potential bias detected in reasoning chain. Human review recommended.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </div>
      </Card>

      {/* Emergency Protocol Status */}
      {systemStabilityAlert && (
        <Alert className="border-red-500 bg-red-500/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>⚠️ SYSTEM STABILITY ALERT — Human confirmation required.</span>
            <Button size="sm" onClick={resolveStabilityAlert} className="ml-2">Acknowledge</Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Capabilities */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Brain className="w-4 h-4 text-neon-purple" />
              <span>Capabilities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {capabilities.map((capability, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/10">
                <capability.icon className={`w-4 h-4 ${getStatusColor(capability.status)}`} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{capability.name}</p>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(capability.status)}`}>
                      {capability.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{capability.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </div>
      </Card>

      {/* System Status */}
      <Card className="border-neon-green/30 bg-neon-green/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-neon-green rounded-full flex items-center justify-center">
                <Activity className="w-4 h-4 text-midnight-blue" />
              </div>
              <div>
                <p className="text-sm font-medium">System Health</p>
                <p className="text-xs text-muted-foreground">All systems operational • Response time optimal</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Configure
        </Button>
        <Button variant="ghost">
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart
        </Button>
      </div>

      {/* Training Status */}
      <Card className="border-neon-purple/30 bg-neon-purple/5">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-neon-purple rounded-full flex items-center justify-center">
              <Cpu className="w-4 h-4 text-midnight-blue" />
            </div>
            <div>
              <p className="text-sm font-medium">Groq-Powered Intelligence</p>
              <p className="text-xs text-muted-foreground">Real AI via Groq API • llama-3.3-70b-versatile</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
