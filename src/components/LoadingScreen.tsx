import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { 
  Rocket, 
  Brain, 
  Zap, 
  Shield, 
  Code2, 
  Sparkles,
  CheckCircle,
  Loader2
} from "lucide-react";
import arch1techLogo from "@/assets/arch1tech-logo.png";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const loadingSteps = [
    { icon: <Rocket className="h-6 w-6" />, label: "Initializing Arch1tech Platform", delay: 500 },
    { icon: <Brain className="h-6 w-6" />, label: "Activating Astrid AI Co-pilot", delay: 800 },
    { icon: <Shield className="h-6 w-6" />, label: "Establishing Secure Connection", delay: 600 },
    { icon: <Code2 className="h-6 w-6" />, label: "Loading Development Environment", delay: 700 },
    { icon: <Zap className="h-6 w-6" />, label: "Optimizing Performance Matrix", delay: 500 },
    { icon: <Sparkles className="h-6 w-6" />, label: "Preparing Control Center", delay: 400 }
  ];

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let stepTimeout: NodeJS.Timeout;

    const startLoading = () => {
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(onComplete, 500);
            return 100;
          }
          return prev + (Math.random() * 3 + 1);
        });
      }, 100);

      const processSteps = (stepIndex: number) => {
        if (stepIndex < loadingSteps.length) {
          setCurrentStep(stepIndex);
          stepTimeout = setTimeout(() => {
            processSteps(stepIndex + 1);
          }, loadingSteps[stepIndex].delay);
        }
      };

      processSteps(0);
    };

    startLoading();

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimeout);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Floating Elements */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-4 h-4 bg-primary/30 rounded-full animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-6">
        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-2xl">
          <div className="p-8 text-center">
            {/* Logo */}
            <div className="w-20 h-20 mx-auto mb-6 pulse-cyan">
              <img 
                src={arch1techLogo} 
                alt="Arch1tech Logo" 
                className="w-full h-full object-contain"
              />
            </div>

            <h1 className="text-2xl font-bold mb-2 text-gradient-neural">
              Arch1tech
            </h1>
            <p className="text-muted-foreground mb-8">
              Preparing your development environment
            </p>

            {/* Progress Bar */}
            <div className="mb-8">
              <Progress value={progress} className="h-3 mb-4" />
              <div className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </div>
            </div>

            {/* Loading Steps */}
            <div className="space-y-4 text-left">
              {loadingSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                    index < currentStep 
                      ? 'bg-green-500/10 text-green-600' 
                      : index === currentStep
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {index < currentStep ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : index === currentStep ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-muted rounded-full" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {step.icon}
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Status */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Brain className="h-4 w-4" />
                <span className="text-sm font-medium">Astrid AI Status</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {currentStep >= 1 ? 'AI Co-pilot online and ready' : 'Initializing neural networks...'}
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          Building the future of development, one line at a time...
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(120deg); }
            66% { transform: translateY(5px) rotate(240deg); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `
      }} />
    </div>
  );
};