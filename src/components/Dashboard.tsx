import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Rocket, 
  Brain, 
  TrendingUp, 
  Zap, 
  Plus, 
  Activity,
  Cpu,
  Database,
  Code2
} from "lucide-react";

interface DashboardProps {
  onViewChange?: (view: string) => void;
}

export function Dashboard({ onViewChange }: DashboardProps) {
  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient-neon">Command Center</h1>
          <p className="text-muted-foreground">Hey Alex, Astrid's ready.</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center neon-glow-cyan">
          <span className="text-midnight-blue font-bold text-lg">Ω</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="holographic-border">
          <div className="holographic-content p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Rocket className="w-5 h-5 text-neon-cyan" />
              <span className="text-sm text-muted-foreground">Active Astrids</span>
            </div>
            <div className="text-2xl font-bold text-neon-cyan">2</div>
            <div className="text-xs text-muted-foreground">Free tier limit</div>
          </div>
        </div>

        <div className="holographic-border">
          <div className="holographic-content p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-neon-green" />
              <span className="text-sm text-muted-foreground">Custom LLMs</span>
            </div>
            <div className="text-2xl font-bold text-neon-green">3</div>
            <div className="text-xs text-muted-foreground">3 slots available</div>
          </div>
        </div>

        <div className="holographic-border">
          <div className="holographic-content p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-neon-purple" />
              <span className="text-sm text-muted-foreground">Σ-Matrix Drift</span>
            </div>
            <div className="text-2xl font-bold text-neon-purple">0.02</div>
            <div className="text-xs text-neon-green">Excellent stability</div>
          </div>
        </div>

        <div className="holographic-border">
          <div className="holographic-content p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Active Agents</span>
            </div>
            <div className="text-2xl font-bold text-primary">5</div>
            <div className="text-xs text-muted-foreground">Running workflows</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-neon-cyan" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-neon-green rounded-full pulse-green"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">VibeCodeAI refinement completed</p>
                <p className="text-xs text-muted-foreground">Customer support chatbot - 2 min ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-neon-cyan rounded-full pulse-cyan"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Astrid deployed new version</p>
                <p className="text-xs text-muted-foreground">E-commerce recommendations - 15 min ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-neon-purple rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Custom LLM training started</p>
                <p className="text-xs text-muted-foreground">Domain-specific model - 1 hour ago</p>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Main Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="neon" 
          className="h-20 flex-col space-y-2"
          onClick={() => onViewChange?.('capture')}
        >
          <Plus className="w-6 h-6" />
          <span>New Build</span>
        </Button>
        <Button 
          variant="holographic" 
          className="h-20 flex-col space-y-2"
          onClick={() => onViewChange?.('custom-llm')}
        >
          <Brain className="w-6 h-6" />
          <span>Custom LLM</span>
        </Button>
        <Button 
          variant="pulse" 
          className="h-20 flex-col space-y-2"
          onClick={() => onViewChange?.('marketplace')}
        >
          <Database className="w-6 h-6" />
          <span>Marketplace</span>
        </Button>
        <Button 
          variant="secondary" 
          className="h-20 flex-col space-y-2"
          onClick={() => onViewChange?.('logic')}
        >
          <Code2 className="w-6 h-6" />
          <span>Σ-Matrix</span>
        </Button>
      </div>
    </div>
  );
}