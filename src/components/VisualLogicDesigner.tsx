import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, 
  Share, 
  GitBranch, 
  Zap, 
  Database, 
  MessageSquare, 
  Settings,
  Eye,
  History,
  TrendingUp,
  Code,
  Loader2,
  X
} from "lucide-react";
import { aiService } from "@/lib/ai-service";
import { useToast } from "@/hooks/use-toast";

export function VisualLogicDesigner() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedNodeCode, setSelectedNodeCode] = useState<string>("");
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [testInput, setTestInput] = useState("Hello, I need help with my billing issue. My account shows incorrect charges.");
  const [sentimentResult, setSentimentResult] = useState<any>(null);
  const { toast } = useToast();
  
  const nodes = [
    { id: 'input', type: 'input', label: 'User Query', x: 50, y: 200, status: 'active', description: 'Process incoming user messages' },
    { id: 'memory', type: 'memory', label: 'Customer Context', x: 200, y: 100, status: 'stable', description: 'Retrieve customer history and preferences' },
    { id: 'crm', type: 'integration', label: 'CRM Lookup', x: 200, y: 300, status: 'stable', description: 'Query CRM system for account information' },
    { id: 'llm', type: 'logic', label: 'LLM Processing', x: 350, y: 200, status: 'optimizing', description: 'Process query with language model' },
    { id: 'sentiment', type: 'analysis', label: 'Sentiment Check', x: 500, y: 150, status: 'stable', description: 'Analyze customer sentiment' },
    { id: 'response', type: 'output', label: 'Generate Response', x: 650, y: 200, status: 'active', description: 'Generate appropriate response' },
  ];

  const connections = [
    { from: 'input', to: 'memory' },
    { from: 'input', to: 'crm' },
    { from: 'input', to: 'llm' },
    { from: 'memory', to: 'llm' },
    { from: 'crm', to: 'llm' },
    { from: 'llm', to: 'sentiment' },
    { from: 'llm', to: 'response' },
    { from: 'sentiment', to: 'response' },
  ];

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'input': return 'bg-neon-cyan';
      case 'memory': return 'bg-neon-purple';
      case 'integration': return 'bg-neon-green';
      case 'logic': return 'bg-primary';
      case 'analysis': return 'bg-secondary';
      case 'output': return 'bg-neon-cyan';
      default: return 'bg-muted';
    }
  };

  const handleNodeClick = async (nodeId: string) => {
    setSelectedNode(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setIsGeneratingCode(true);
      try {
        const code = await aiService.generateCode(node.description, node.type);
        setSelectedNodeCode(code);
        setShowCodeModal(true);
        toast({
          title: "🔧 Code Generated",
          description: `Generated ${node.type} implementation`,
        });
      } catch (error) {
        toast({
          title: "Code Generation Failed",
          description: "Using template code instead.",
          variant: "destructive",
        });
      } finally {
        setIsGeneratingCode(false);
      }
    }
  };

  const handleTestSentiment = async () => {
    if (!testInput.trim()) return;
    
    try {
      const result = await aiService.analyzeSentiment(testInput);
      setSentimentResult(result);
      toast({
        title: "🎭 Sentiment Analyzed",
        description: `${result.sentiment} (${Math.round(result.confidence * 100)}% confidence)`,
      });
    } catch (error) {
      toast({
        title: "Sentiment Analysis Failed",
        description: "Could not analyze sentiment.",
        variant: "destructive",
      });
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'active': return <div className="w-2 h-2 bg-neon-green rounded-full pulse-green" />;
      case 'stable': return <div className="w-2 h-2 bg-neon-cyan rounded-full" />;
      case 'optimizing': return <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse" />;
      default: return <div className="w-2 h-2 bg-muted rounded-full" />;
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-neon-green to-neon-cyan rounded-full flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-midnight-blue" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient-neon">Visual Logic Designer</h1>
            <p className="text-sm text-muted-foreground">Customer Service Chatbot</p>
          </div>
        </div>
        <Badge variant="secondary" className="neon-glow-purple">
          <Eye className="w-3 h-3 mr-1" />
          Live
        </Badge>
      </div>

      {/* Canvas Area */}
      <Card className="holographic-border min-h-96">
        <div className="holographic-content p-6">
          <div className="relative w-full h-80 bg-midnight-blue/20 rounded-lg overflow-hidden">
            {/* Grid Background */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, hsl(var(--neon-cyan)) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />
            
            {/* Connections */}
            <svg className="absolute inset-0 w-full h-full">
              {connections.map((conn, index) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;
                
                return (
                  <line
                    key={index}
                    x1={fromNode.x + 40}
                    y1={fromNode.y + 20}
                    x2={toNode.x}
                    y2={toNode.y + 20}
                    stroke="hsl(var(--neon-cyan))"
                    strokeWidth="2"
                    opacity="0.6"
                    className="animate-pulse"
                  />
                );
              })}
            </svg>
            
            {/* Nodes */}
            {nodes.map((node) => (
              <div
                key={node.id}
                className={`absolute w-20 h-10 ${getNodeColor(node.type)} rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                  selectedNode === node.id ? 'ring-2 ring-neon-cyan' : ''
                } ${isGeneratingCode && selectedNode === node.id ? 'animate-pulse' : ''}`}
                style={{ left: node.x, top: node.y }}
                onClick={() => handleNodeClick(node.id)}
              >
                <div className="text-xs font-medium text-midnight-blue text-center px-1">
                  {isGeneratingCode && selectedNode === node.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    node.label
                  )}
                </div>
                <div className="absolute -top-1 -right-1">
                  {getStatusIndicator(node.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Live Sentiment Testing */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-neon-cyan" />
              <span>Live Sentiment Testing</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter test message to analyze sentiment..."
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="min-h-16 bg-muted/20 border-neon-cyan/20 focus:border-neon-cyan/50"
            />
            <div className="flex items-center justify-between">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleTestSentiment}
                disabled={!testInput.trim()}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Analyze Sentiment
              </Button>
              {sentimentResult && (
                <Badge 
                  variant="secondary" 
                  className={`${
                    sentimentResult.sentiment === 'positive' ? 'text-neon-green' :
                    sentimentResult.sentiment === 'negative' ? 'text-red-400' : 'text-neon-cyan'
                  }`}
                >
                  {sentimentResult.sentiment} ({Math.round(sentimentResult.confidence * 100)}%)
                </Badge>
              )}
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="holographic-border w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="holographic-content">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center space-x-2">
                  <Code className="w-4 h-4 text-neon-cyan" />
                  <span>Generated Code</span>
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowCodeModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="bg-midnight-blue/40 rounded-lg p-4 border border-neon-cyan/20">
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                    {selectedNodeCode}
                  </pre>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      )}

      {/* Σ-Matrix Status */}
      <Card className="border-neon-purple/30 bg-neon-purple/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-neon-purple" />
            <span>Σ-Matrix Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Drift Score</span>
            <Badge variant="secondary" className="text-neon-green">0.02 - Excellent</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">DMAIC Status</span>
            <Badge variant="secondary" className="text-neon-cyan">Control Phase</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Last Optimization</span>
            <span className="text-xs text-muted-foreground">2 hours ago</span>
          </div>
        </CardContent>
      </Card>

      {/* ERPS Monitor */}
      <Card className="border-neon-green/30 bg-neon-green/5">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-neon-green rounded-full flex items-center justify-center pulse-green">
              <Zap className="w-4 h-4 text-midnight-blue" />
            </div>
            <div>
              <p className="text-sm font-medium">ERPS Self-Monitoring</p>
              <p className="text-xs text-muted-foreground">All checks passing • Real-time validation active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Controls */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <History className="w-4 h-4 text-neon-cyan" />
              <span>Version Timeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-neon-green rounded-full" />
                <span>v2.3 (current)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-muted rounded-full" />
                <span>v2.2</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-muted rounded-full" />
                <span>v2.1</span>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto">
                View All
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="neon" className="h-12">
          <Play className="w-4 h-4 mr-2" />
          Simulate
        </Button>
        <Button variant="pulse" className="h-12">
          <Share className="w-4 h-4 mr-2" />
          Deploy Now
        </Button>
      </div>
    </div>
  );
}