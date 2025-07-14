import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import arch1techLogo from "@/assets/arch1tech-logo.png";

interface SplashProps {
  onComplete: () => void;
}

export function Splash({ onComplete }: SplashProps) {
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Initializing Σ-Matrix...");

  useEffect(() => {
    const messages = [
      "Initializing Σ-Matrix...",
      "Activating Astrid...",
      "Loading VibeCodeAI...",
      "Establishing ERPS connections...",
      "Ready for deployment."
    ];

    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex++;
      if (messageIndex < messages.length) {
        setLoadingText(messages[messageIndex]);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          setTimeout(onComplete, 500);
        }, 1000);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight-blue via-deep-space to-midnight-blue">
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-neon-cyan rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

        {/* Main logo */}
        <div className="relative z-10 flex flex-col items-center space-y-8">
          <div className="relative">
            {/* Holographic rotating ring */}
            <div className="w-40 h-40 border-2 border-neon-cyan rounded-full animate-holographic-rotate neon-glow-cyan opacity-30" />
            
            {/* Logo image */}
            <div className="absolute inset-2 flex items-center justify-center">
              <img 
                src={arch1techLogo} 
                alt="Arch1tech Logo" 
                className="w-32 h-32 object-contain neon-glow-cyan"
              />
            </div>
          </div>

        {/* Brand text */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-gradient-neural">Arch1tech</h1>
          <p className="text-muted-foreground text-lg font-medium">AI-Powered Development Platform</p>
          <p className="text-sm text-accent italic font-light tracking-wide">Build the future, one thought at a time.</p>
        </div>

        {/* Loading indicator */}
        <div className="flex items-center space-x-3 mt-8">
          <Loader2 className="w-5 h-5 animate-spin text-neon-cyan" />
          <span className="text-foreground font-medium">{loadingText}</span>
        </div>
      </div>
    </div>
  );
}