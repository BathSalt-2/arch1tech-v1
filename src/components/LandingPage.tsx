import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Zap, 
  Brain, 
  Code2, 
  Users, 
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  Shield,
  Globe,
  Star
} from "lucide-react";

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage = ({ onEnter }: LandingPageProps) => {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Development",
      description: "Revolutionary Astrid co-pilot with Σ-Matrix intelligence"
    },
    {
      icon: <Code2 className="h-8 w-8" />,
      title: "Real-time Collaboration", 
      description: "Build together with live coding and instant sync"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Voice Commands",
      description: "Control your environment with natural language"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Smart Analytics",
      description: "Predictive insights and performance optimization"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-lg animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-2000" />
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-green-500/10 rounded-full blur-xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Arch1tech
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            The ultimate AI-powered development platform that transforms how you build, collaborate, and innovate
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <Star className="h-3 w-3 mr-1" />
              Revolutionary AI Platform
            </Badge>
            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
              <Shield className="h-3 w-3 mr-1" />
              Enterprise Ready
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
              <Globe className="h-3 w-3 mr-1" />
              Global Scale
            </Badge>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-primary/20 bg-gradient-to-br from-card/50 to-primary/5 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center text-primary mb-4">
                  {features[currentFeature].icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{features[currentFeature].title}</h3>
                <p className="text-muted-foreground text-lg">{features[currentFeature].description}</p>
              </div>
              
              <div className="flex justify-center gap-2">
                {features.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      index === currentFeature ? 'bg-primary w-8' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: <Brain className="h-6 w-6" />,
              title: "Astrid AI Co-pilot",
              description: "Advanced AI assistant with Σ-Matrix intelligence"
            },
            {
              icon: <Users className="h-6 w-6" />,
              title: "Live Collaboration",
              description: "Real-time coding with global teams"
            },
            {
              icon: <TrendingUp className="h-6 w-6" />,
              title: "Smart Analytics",
              description: "Predictive insights and optimization"
            },
            {
              icon: <Sparkles className="h-6 w-6" />,
              title: "AI Templates",
              description: "Dynamic project generation"
            }
          ].map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-muted/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <div className="text-primary">
                    {feature.icon}
                  </div>
                </div>
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to revolutionize your development workflow?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of developers who are already building the future with Arch1tech
            </p>
          </div>

          <Button 
            onClick={onEnter}
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Rocket className="h-5 w-5 mr-2 group-hover:animate-pulse" />
            Enter Control Center
            <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="mt-6 text-sm text-muted-foreground">
            No credit card required • Instant access • Enterprise security
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 pt-12 border-t border-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Developers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1M+</div>
              <div className="text-muted-foreground">Projects Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};