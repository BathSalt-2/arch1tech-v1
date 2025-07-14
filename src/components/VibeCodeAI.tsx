import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Edit, RefreshCw, Sparkles, ArrowRight, Info } from "lucide-react";

export function VibeCodeAI() {
  const originalInput = "I want to build an AI-powered customer service chatbot that can handle complex billing inquiries and integrate with our existing CRM system.";
  
  const optimizedPrompt = `Build an intelligent customer service chatbot with the following specifications:

**Core Functionality:**
- Handle complex billing inquiries with natural language understanding
- Integrate seamlessly with existing CRM systems via REST APIs
- Provide contextual responses based on customer history
- Escalate to human agents when confidence is low

**Technical Requirements:**
- Language model: GPT-4 or Claude-3 for complex reasoning
- Memory: Store conversation context and customer preferences
- Security: Implement data encryption and access controls
- Scalability: Support 1000+ concurrent conversations

**User Experience:**
- Friendly, professional tone
- Quick response times (<2 seconds)
- Multi-channel support (web, mobile, WhatsApp)
- Sentiment analysis for customer satisfaction tracking

**Success Metrics:**
- Resolution rate >85%
- Customer satisfaction >4.5/5
- Average handling time <3 minutes`;

  const changes = [
    { type: "added", text: "Specified technical architecture requirements" },
    { type: "enhanced", text: "Added specific performance metrics and constraints" },
    { type: "clarified", text: "Defined integration patterns and security requirements" },
    { type: "structured", text: "Organized requirements into logical categories" }
  ];

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-full flex items-center justify-center animate-pulse">
          <Sparkles className="w-4 h-4 text-midnight-blue" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gradient-neon">VibeCodeAI</h1>
          <p className="text-sm text-muted-foreground">Semantic refinement complete</p>
        </div>
      </div>

      {/* Original Input */}
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <div className="w-3 h-3 bg-muted rounded-full" />
            <span>Original Input</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{originalInput}</p>
        </CardContent>
      </Card>

      {/* Optimized Prompt */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <div className="w-3 h-3 bg-neon-cyan rounded-full pulse-cyan" />
              <span>Optimized VibeCode Prompt</span>
              <Badge variant="secondary" className="ml-auto">
                <Sparkles className="w-3 h-3 mr-1" />
                Enhanced
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/20 rounded-lg p-4 border border-neon-cyan/20">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {optimizedPrompt}
              </pre>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Changes Explanation */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Info className="w-4 h-4 text-neon-green" />
              <span>What Changed & Why</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {changes.map((change, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20">
                <div className="w-2 h-2 bg-neon-green rounded-full mt-2 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium capitalize">{change.type}:</span>
                  <span className="text-sm text-muted-foreground ml-2">{change.text}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </div>
      </Card>

      {/* Agent Type Detection */}
      <Card className="border-neon-purple/30 bg-neon-purple/5">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-neon-purple rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-midnight-blue" />
            </div>
            <div>
              <p className="text-sm font-medium">Agent Type Detected</p>
              <p className="text-xs text-muted-foreground">Conversational AI with CRM Integration</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button variant="neon" className="w-full h-12">
          <Check className="w-4 h-4 mr-2" />
          Approve & Build
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Manually
          </Button>
          <Button variant="ghost">
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Tips */}
      <Card className="bg-neon-cyan/5 border-neon-cyan/20">
        <CardContent className="p-4">
          <p className="text-sm text-neon-cyan font-medium mb-2">💡 Pro Tips:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Add specific constraints to improve agent reliability</li>
            <li>• Define success metrics for better optimization</li>
            <li>• Include integration requirements early in the process</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}