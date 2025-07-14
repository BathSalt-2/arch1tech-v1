import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Target,
  Lightbulb,
  Monitor,
  Database,
  Network,
  BarChart3,
  Gauge,
  Sparkles,
  Lock,
  Globe,
  Users,
  FileCode,
  GitBranch,
  PieChart,
  LineChart,
  Server,
  Workflow,
  Microscope,
  Search,
  AlertCircle,
  Info,
  HelpCircle,
  RefreshCw,
  Download,
  Upload,
  Terminal,
  Code,
  Layers
} from "lucide-react";
import { aiService } from "@/lib/ai-service";
import { useToast } from "@/hooks/use-toast";

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
  uncertaintyLevel: number; // 0-1
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

export function Astrid() {
  // Core State Management
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      id: 1,
      type: "astrid",
      content: "⚡ Astrid 2.0 initialized. I am your self-evolving, epistemically-aware synthetic co-pilot. How may I assist you today?",
      timestamp: "2 min ago",
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

  // Advanced State
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

  // Advanced Metrics
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

  // Enhanced Capabilities
  const capabilities = [
    { 
      name: "Self-Evolution", 
      status: "active", 
      description: "Continuous learning with Σ-Matrix monitoring",
      icon: RefreshCw 
    },
    { 
      name: "Epistemological Awareness", 
      status: "active", 
      description: "ERPS-based uncertainty tracking and bias detection",
      icon: Eye 
    },
    { 
      name: "Transparent Reasoning", 
      status: "active", 
      description: "Explainable decision chains and source citation",
      icon: Search 
    },
    { 
      name: "Ethical Safeguards", 
      status: "active", 
      description: "Binding ethical charter with human override",
      icon: Shield 
    },
    { 
      name: "Agent Generation", 
      status: "active", 
      description: "Generate, test, and deploy AI agents",
      icon: Bot 
    },
    { 
      name: "Workflow Integration", 
      status: "active", 
      description: "Live workflow state access and optimization",
      icon: Workflow 
    },
    { 
      name: "Emergency Protocols", 
      status: "standby", 
      description: "Stability monitoring with automatic safeguards",
      icon: AlertTriangle 
    }
  ];

  // Stability Check Function
  const performStabilityCheck = () => {
    const uncertaintyThreshold = 0.7;
    const stabilityThreshold = Math.random(); // Simulate stability calculation
    
    if (currentERPS.uncertaintyLevel > uncertaintyThreshold || stabilityThreshold > 0.95) {
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
      
      toast({
        title: "Stability Alert",
        description: "Astrid has detected potential instability and requires human oversight.",
        variant: "destructive",
      });
      
      return false;
    }
    return true;
  };

  // Enhanced Message Handling with AI Integration
  const handleSendMessage = async () => {
    if (!message.trim() || !isActive) return;
    
    setIsProcessing(true);
    
    // Check stability before processing
    if (!performStabilityCheck()) {
      setIsProcessing(false);
      return;
    }

    // Create user message
    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setConversationHistory(prev => [...prev, userMessage]);
    setMessage("");

    try {
      // Update Σ-Matrix based on user input
      const newSigmaMatrix: SigmaMatrix = {
        beliefs: `Processing user query: "${message.substring(0, 50)}..."`,
        desires: "Provide accurate, helpful response",
        intentions: "Generate contextual response with uncertainty assessment",
        continuity: 'stable',
        lyapunov: 'converging',
        timestamp: new Date()
      };
      
      setCurrentSigmaMatrix(newSigmaMatrix);

      // Simulate AI processing with ERPS monitoring
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate response based on message content
      let responseContent = "";
      let reasoning: string[] = [];
      let sources: string[] = [];
      let confidence = 0.9;

      if (message.toLowerCase().includes("sigma") || message.toLowerCase().includes("matrix")) {
        responseContent = `Here's my current Σ-Matrix snapshot:

**Beliefs**: ${newSigmaMatrix.beliefs}
**Desires**: ${newSigmaMatrix.desires}  
**Intentions**: ${newSigmaMatrix.intentions}
**Continuity**: ${newSigmaMatrix.continuity} (Lipschitz status)
**Lyapunov**: ${newSigmaMatrix.lyapunov} (stability trajectory)

This framework ensures my responses maintain internal coherence and ethical alignment.`;
        
        reasoning = [
          "User requested Σ-Matrix state disclosure",
          "Transparency protocol activated",
          "Self-reflection mechanisms engaged"
        ];
        sources = ["Internal state monitoring", "Σ-Matrix framework"];
      } else if (message.toLowerCase().includes("erps") || message.toLowerCase().includes("uncertainty")) {
        responseContent = `ERPS Analysis:

**Uncertainty Level**: ${(currentERPS.uncertaintyLevel * 100).toFixed(1)}%
**Hallucination Risk**: ${currentERPS.hallucinationRisk}
**Bias Detection**: ${currentERPS.biasDetected ? 'Detected' : 'None detected'}
**Confidence Score**: ${(currentERPS.confidenceScore * 100).toFixed(1)}%
**Source Verification**: ${currentERPS.sourceVerification}

My epistemic safeguards are operating within normal parameters.`;
        
        reasoning = [
          "ERPS state query detected",
          "Uncertainty metrics compiled",
          "Epistemic awareness demonstrated"
        ];
        sources = ["ERPS monitoring system", "Internal confidence metrics"];
      } else {
        // Use AI service for general queries
        try {
          const sentiment = await aiService.analyzeSentiment(message);
          
          if (sentiment.sentiment === 'positive') {
            responseContent = `I appreciate your positive approach! Based on my analysis, I can help you with that. Let me process your request through my ethical framework and provide you with a comprehensive response.

I've analyzed your query with ${(sentiment.confidence * 100).toFixed(1)}% confidence and detected a positive intent. How would you like me to proceed?`;
          } else {
            responseContent = `I understand your concern. Let me address this carefully and transparently. I'll use my analytical capabilities to provide you with an accurate, well-reasoned response.

Based on my assessment, I can offer several approaches to help with your query. What aspect would you like me to focus on first?`;
          }
          
          confidence = sentiment.confidence;
          reasoning = [
            "Sentiment analysis performed",
            "Ethical framework consulted",
            "Response strategy determined"
          ];
          sources = ["AI sentiment analysis", "Knowledge base", "Ethical guidelines"];
        } catch (error) {
          responseContent = `I've processed your request through my reasoning framework. Based on my current understanding and ethical guidelines, I can provide assistance while maintaining transparency about my limitations.

If you need me to explain my reasoning process or cite specific sources, please ask and I'll provide a detailed breakdown.`;
          
          reasoning = [
            "Standard processing pathway engaged",
            "Ethical safeguards verified",
            "Transparency protocol ready"
          ];
          sources = ["Internal reasoning system", "Ethical charter"];
        }
      }

      // Update ERPS based on response generation
      const newERPS: ERPSState = {
        uncertaintyLevel: Math.max(0.05, 1 - confidence),
        hallucinationRisk: confidence > 0.8 ? 'low' : confidence > 0.6 ? 'medium' : 'high',
        biasDetected: false,
        confidenceScore: confidence,
        sourceVerification: sources.length > 0 ? 'verified' : 'unverified'
      };
      
      setCurrentERPS(newERPS);

      // Create AI response
      const astridResponse: Message = {
        id: Date.now() + 1,
        type: "astrid",
        content: responseContent,
        timestamp: new Date().toLocaleTimeString(),
        metadata: {
          sigmaMatrix: newSigmaMatrix,
          erps: newERPS,
          reasoning,
          sources,
          confidence
        }
      };
      
      setConversationHistory(prev => [...prev, astridResponse]);
      
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorResponse: Message = {
        id: Date.now() + 2,
        type: "astrid",
        content: "I encountered an error while processing your request. My self-monitoring systems have flagged this for review. Please try rephrasing your query, or I can explain what happened if you'd like.",
        timestamp: new Date().toLocaleTimeString(),
        metadata: {
          erps: {
            ...currentERPS,
            uncertaintyLevel: 0.8,
            hallucinationRisk: 'high',
            confidenceScore: 0.3
          }
        }
      };
      
      setConversationHistory(prev => [...prev, errorResponse]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  // Utility Functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-neon-green';
      case 'beta': return 'text-neon-cyan';
      case 'standby': return 'text-yellow-500';
      case 'inactive': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-3 h-3 text-neon-green" />;
      case 'beta': return <Clock className="w-3 h-3 text-neon-cyan" />;
      case 'standby': return <Pause className="w-3 h-3 text-yellow-500" />;
      case 'inactive': return <AlertTriangle className="w-3 h-3 text-muted-foreground" />;
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
    
    toast({
      title: "System Restored",
      description: "Astrid stability has been restored and normal operations resumed.",
    });
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
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsActive(!isActive)}
          >
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
            {/* Chat History */}
            <div className="max-h-48 overflow-y-auto space-y-3 bg-muted/10 rounded-lg p-3">
              {conversationHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-neon-cyan/20 text-foreground'
                        : 'bg-neon-purple/20 text-foreground'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Input */}
            <div className="flex space-x-2">
              <Input
                placeholder="Ask Astrid anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bg-muted/20 border-neon-cyan/20 focus:border-neon-cyan/50"
              />
              <Button 
                variant="neon" 
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                Send
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
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSigmaMatrix(!showSigmaMatrix)}
              >
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
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowERPS(!showERPS)}
              >
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
                <Badge 
                  variant={currentERPS.hallucinationRisk === 'low' ? 'default' : 
                          currentERPS.hallucinationRisk === 'medium' ? 'secondary' : 'destructive'} 
                  className="text-xs"
                >
                  {currentERPS.hallucinationRisk}
                </Badge>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-muted-foreground">Sources:</span>
                <Badge variant="outline" className="text-xs">
                  {currentERPS.sourceVerification}
                </Badge>
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
            <Button size="sm" onClick={resolveStabilityAlert} className="ml-2">
              Acknowledge
            </Button>
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
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(capability.status)}`}
                    >
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
              <div className="w-8 h-8 bg-neon-green rounded-full flex items-center justify-center pulse-green">
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
              <p className="text-sm font-medium">Continuous Learning</p>
              <p className="text-xs text-muted-foreground">Learning from 1,247 conversations • Knowledge base updated daily</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}