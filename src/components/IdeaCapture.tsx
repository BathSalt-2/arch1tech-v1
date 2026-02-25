import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Send, FileText, Lightbulb, Target, Users, Loader2, Sparkles } from "lucide-react";
import { aiService } from "@/lib/ai-service";
import { useToast } from "@/hooks/use-toast";

export function IdeaCapture() {
  const [idea, setIdea] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancedIdea, setEnhancedIdea] = useState<any>(null);
  const { toast } = useToast();

  const handleEnhanceIdea = async () => {
    if (!idea.trim()) return;
    
    setIsProcessing(true);
    try {
      const result = await aiService.enhanceIdea(idea);
      setEnhancedIdea({ enhanced: result, complexity: 'N/A', estimatedTime: 'N/A', suggestions: [] });
      toast({
        title: "✨ Idea Enhanced",
        description: "Your idea has been enhanced by AI.",
      });
    } catch (error) {
      toast({
        title: "Enhancement Failed",
        description: "Using basic analysis instead.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const suggestions = [
    { icon: Target, text: "Add your goal or objective" },
    { icon: Users, text: "Define your target audience" },
    { icon: Lightbulb, text: "Specify the style or tone" },
  ];

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-green rounded-full flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-midnight-blue" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gradient-neon">Idea Capture</h1>
          <p className="text-sm text-muted-foreground">Describe your vision</p>
        </div>
      </div>

      {/* Main Input */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-lg">Tell me your idea...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="I want to build an AI-powered customer service chatbot that can handle complex billing inquiries and integrate with our existing CRM system..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="min-h-32 bg-muted/20 border-2 border-neon-cyan/20 focus:border-neon-cyan/50 resize-none"
              />
              <Button
                variant="ghost"
                size="icon"
                className={`absolute bottom-3 right-3 ${isRecording ? 'text-red-500 pulse-green' : 'text-muted-foreground'}`}
                onClick={() => setIsRecording(!isRecording)}
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
            
            {isRecording && (
              <div className="flex items-center space-x-2 text-sm text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span>Recording... Speak now</span>
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      {/* Prompt Boost Suggestions */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-neon-green" />
              <span>Boost Your Prompt</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-auto p-3 text-left hover:bg-neon-cyan/10 hover:border-neon-cyan/30 border border-transparent transition-all"
                onClick={() => setIdea(prev => prev + `\n\n${suggestion.text}: `)}
              >
                <suggestion.icon className="w-4 h-4 text-neon-cyan mr-3 flex-shrink-0" />
                <span className="text-sm">{suggestion.text}</span>
              </Button>
            ))}
          </CardContent>
        </div>
      </Card>

      {/* File Attachment */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardContent className="p-4">
            <Button variant="outline" className="w-full h-16 border-dashed border-2 border-neon-purple/30 hover:border-neon-purple/50">
              <FileText className="w-5 h-5 mr-2 text-neon-purple" />
              <span>Attach files or datasets (CSV, JSON)</span>
            </Button>
          </CardContent>
        </div>
      </Card>

      {/* Enhanced Idea Display */}
      {enhancedIdea && (
        <Card className="holographic-border">
          <div className="holographic-content">
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-neon-purple" />
                <span>AI Enhanced Idea</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted/20 rounded-lg p-3 border border-neon-purple/20">
                <p className="text-sm leading-relaxed">{enhancedIdea.enhanced}</p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Complexity: {enhancedIdea.complexity}</span>
                <span className="text-muted-foreground">Est. Time: {enhancedIdea.estimatedTime}</span>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-neon-cyan">AI Suggestions:</p>
                {enhancedIdea.suggestions.slice(0, 2).map((suggestion: string, index: number) => (
                  <div key={index} className="text-xs text-muted-foreground bg-muted/10 rounded p-2">
                    • {suggestion}
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          variant="secondary" 
          className="w-full h-12"
          disabled={!idea.trim() || isProcessing}
          onClick={handleEnhanceIdea}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enhancing with AI...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Enhance with AI
            </>
          )}
        </Button>
        
        <Button 
          variant="neon" 
          className="w-full h-12"
          disabled={!idea.trim()}
        >
          <Send className="w-4 h-4 mr-2" />
          Send to VibeCodeAI
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          disabled={!idea.trim()}
        >
          Save as Draft
        </Button>
      </div>
    </div>
  );
}