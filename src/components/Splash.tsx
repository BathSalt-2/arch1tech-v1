import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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
          <div className="w-32 h-32 border-2 border-neon-cyan rounded-full animate-holographic-rotate neon-glow-cyan opacity-50" />
          
          {/* Inner logo */}
          <div className="absolute inset-4 bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-green rounded-full flex items-center justify-center neon-glow-cyan">
            <div className="text-midnight-blue font-bold text-2xl">Ω</div>
          </div>
        </div>

        {/* Brand text */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gradient-neon">Arch1tech</h1>
          <p className="text-muted-foreground text-lg">Powered by Or4cl3 AI Solutions</p>
          <p className="text-sm text-neon-cyan italic">Build the future, one thought at a time.</p>
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