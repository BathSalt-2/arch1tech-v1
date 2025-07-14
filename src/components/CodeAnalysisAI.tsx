import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  Target,
  TrendingUp,
  Bug,
  Lightbulb
} from "lucide-react";

interface CodeIssue {
  type: 'error' | 'warning' | 'suggestion' | 'performance';
  line: number;
  message: string;
  severity: 'high' | 'medium' | 'low';
  fix?: string;
}

interface CodeMetrics {
  complexity: number;
  maintainability: number;
  performance: number;
  security: number;
}

export const CodeAnalysisAI = () => {
  const [code, setCode] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [issues, setIssues] = useState<CodeIssue[]>([]);
  const [metrics, setMetrics] = useState<CodeMetrics>({
    complexity: 85,
    maintainability: 78,
    performance: 92,
    security: 88
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const analyzeCode = async () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis (in real implementation, this would call an AI service)
    setTimeout(() => {
      const mockIssues: CodeIssue[] = [
        {
          type: 'warning',
          line: 12,
          message: 'Consider using useMemo for expensive calculations',
          severity: 'medium',
          fix: 'const memoizedValue = useMemo(() => expensiveCalculation(), [dependency]);'
        },
        {
          type: 'suggestion',
          line: 25,
          message: 'This function could be optimized using async/await',
          severity: 'low',
          fix: 'Convert Promise chains to async/await for better readability'
        },
        {
          type: 'error',
          line: 8,
          message: 'Potential memory leak detected in useEffect',
          severity: 'high',
          fix: 'Add cleanup function to prevent memory leaks'
        }
      ];

      const mockSuggestions = [
        "Consider implementing error boundaries for better error handling",
        "Add TypeScript interfaces for better type safety",
        "Use React.lazy() for code splitting to improve load times",
        "Implement proper accessibility attributes (ARIA)",
        "Consider using a state management library for complex state"
      ];

      setIssues(mockIssues);
      setSuggestions(mockSuggestions);
      setIsAnalyzing(false);
    }, 2000);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (code.length > 50) {
        analyzeCode();
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [code]);

  const getIssueIcon = (type: CodeIssue['type']) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'suggestion': return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'performance': return <Zap className="h-4 w-4 text-green-500" />;
      default: return <Bug className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: CodeIssue['severity']) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Code Analysis & Suggestions
            {isAnalyzing && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Code Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Complexity</span>
              </div>
              <Progress value={metrics.complexity} className="h-2" />
              <span className="text-xs text-muted-foreground">{metrics.complexity}%</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Maintainability</span>
              </div>
              <Progress value={metrics.maintainability} className="h-2" />
              <span className="text-xs text-muted-foreground">{metrics.maintainability}%</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Performance</span>
              </div>
              <Progress value={metrics.performance} className="h-2" />
              <span className="text-xs text-muted-foreground">{metrics.performance}%</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Security</span>
              </div>
              <Progress value={metrics.security} className="h-2" />
              <span className="text-xs text-muted-foreground">{metrics.security}%</span>
            </div>
          </div>

          {/* Code Input */}
          <div className="space-y-3">
            <h4 className="font-medium">Code to Analyze</h4>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your React/TypeScript code here for AI analysis..."
              className="min-h-[150px] font-mono bg-muted/50"
            />
            <Button onClick={analyzeCode} disabled={isAnalyzing} className="gap-2">
              <Brain className="h-4 w-4" />
              {isAnalyzing ? "Analyzing..." : "Analyze Code"}
            </Button>
          </div>

          {/* Issues Found */}
          {issues.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                Issues Found ({issues.length})
                <Badge variant="outline">{issues.filter(i => i.severity === 'high').length} Critical</Badge>
              </h4>
              <div className="space-y-2">
                {issues.map((issue, index) => (
                  <Alert key={index} className="border-l-4 border-l-primary">
                    <div className="flex items-start gap-3">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertDescription className="font-medium">
                            Line {issue.line}: {issue.message}
                          </AlertDescription>
                          <Badge variant={getSeverityColor(issue.severity)} className="text-xs">
                            {issue.severity}
                          </Badge>
                        </div>
                        {issue.fix && (
                          <div className="bg-muted/50 p-2 rounded text-sm font-mono">
                            {issue.fix}
                          </div>
                        )}
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                AI Improvement Suggestions
              </h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Lightbulb className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};