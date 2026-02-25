import { useEffect, useState } from 'react';
import { aiService } from '@/lib/ai-service';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface AIInitializerProps {
  children: React.ReactNode;
}

export function AIInitializer({ children }: AIInitializerProps) {
  const [initStatus, setInitStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Initializing AI models...');

  useEffect(() => {
    setMessage('Checking AI configuration...');
    if (aiService.isConfigured()) {
      setInitStatus('success');
      setMessage('AI models ready');
    } else {
      setInitStatus('error');
      setMessage('No API key configured – using fallbacks');
    }
    setTimeout(() => setInitStatus('success'), 2000);
  }, []);

  if (initStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="holographic-border w-80">
          <div className="holographic-content">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center mx-auto neon-glow-cyan">
                <Loader2 className="w-8 h-8 text-midnight-blue animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gradient-neural">Astrid AI</h3>
                <p className="text-sm text-muted-foreground mt-1">{message}</p>
              </div>
              <div className="text-xs text-neon-cyan">
                Loading open-source models...
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      {children}
      {initStatus === 'success' && (
        <div className="fixed top-4 right-4 z-50 transition-all duration-500">
          <Card className="border-neon-green/30 bg-neon-green/5">
            <CardContent className="p-3 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-neon-green" />
              <span className="text-sm text-neon-green">AI Ready</span>
            </CardContent>
          </Card>
        </div>
      )}
      {initStatus === 'error' && (
        <div className="fixed top-4 right-4 z-50 transition-all duration-500">
          <Card className="border-orange-500/30 bg-orange-500/5">
            <CardContent className="p-3 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-500">Using fallbacks</span>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}