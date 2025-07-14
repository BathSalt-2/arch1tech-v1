import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Clock
} from "lucide-react";

export function Astrid() {
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([
    {
      id: 1,
      type: "astrid",
      message: "Hello Alex! I'm Astrid, your AI assistant. How can I help you today?",
      timestamp: "2 min ago"
    },
    {
      id: 2,
      type: "user",
      message: "Show me the status of my current projects",
      timestamp: "1 min ago"
    },
    {
      id: 3,
      type: "astrid",
      message: "You have 3 active projects: Customer Support Bot (85% complete), Data Analyzer (45% complete), and Code Reviewer (70% complete). Would you like details on any specific project?",
      timestamp: "1 min ago"
    }
  ]);

  const astridMetrics = [
    { label: "Conversations", value: "1,247", icon: MessageSquare, color: "text-neon-cyan" },
    { label: "Tasks Completed", value: "89", icon: CheckCircle, color: "text-neon-green" },
    { label: "Avg Response", value: "0.8s", icon: Clock, color: "text-neon-purple" },
    { label: "Accuracy", value: "94.2%", icon: TrendingUp, color: "text-neon-pink" }
  ];

  const capabilities = [
    { name: "Project Management", status: "active", description: "Track and manage AI projects" },
    { name: "Code Generation", status: "active", description: "Generate code snippets and solutions" },
    { name: "Data Analysis", status: "active", description: "Analyze datasets and provide insights" },
    { name: "System Monitoring", status: "active", description: "Monitor platform health and performance" },
    { name: "User Assistance", status: "active", description: "Help with platform navigation and features" },
    { name: "Learning Mode", status: "beta", description: "Continuous learning from interactions" }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = {
      id: conversationHistory.length + 1,
      type: "user",
      message: message,
      timestamp: "now"
    };
    
    // Simulate Astrid response
    const astridResponse = {
      id: conversationHistory.length + 2,
      type: "astrid",
      message: "I understand your request. Let me process that information and provide you with the most relevant response based on your current projects and preferences.",
      timestamp: "now"
    };
    
    setConversationHistory([...conversationHistory, userMessage, astridResponse]);
    setMessage("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-neon-green';
      case 'beta': return 'text-neon-cyan';
      case 'inactive': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-3 h-3 text-neon-green" />;
      case 'beta': return <Clock className="w-3 h-3 text-neon-cyan" />;
      case 'inactive': return <AlertTriangle className="w-3 h-3 text-muted-foreground" />;
      default: return <AlertTriangle className="w-3 h-3 text-muted-foreground" />;
    }
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
                    <p className="text-sm">{msg.message}</p>
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
                {getStatusIcon(capability.status)}
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