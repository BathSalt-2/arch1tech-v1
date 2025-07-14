import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageSquare,
  Zap,
  Settings,
  Brain
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface VoiceCommand {
  command: string;
  action: string;
  timestamp: Date;
}

export const VoiceInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [language, setLanguage] = useState("en-US");
  const [confidence, setConfidence] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          
          setConfidence(confidence * 100);
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          processVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize Speech Synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    let action = "Unknown command";

    // Command processing logic
    if (lowerCommand.includes("open dashboard")) {
      action = "Opening dashboard";
      // Add navigation logic here
    } else if (lowerCommand.includes("create new project")) {
      action = "Creating new project";
      // Add project creation logic here
    } else if (lowerCommand.includes("open marketplace")) {
      action = "Opening AI marketplace";
      // Add marketplace navigation logic here
    } else if (lowerCommand.includes("start astrid")) {
      action = "Activating Astrid co-pilot";
      // Add Astrid activation logic here
    } else if (lowerCommand.includes("show analytics")) {
      action = "Opening analytics dashboard";
      // Add analytics navigation logic here
    } else if (lowerCommand.includes("save project")) {
      action = "Saving current project";
      // Add save logic here
    } else if (lowerCommand.includes("help") || lowerCommand.includes("commands")) {
      action = "Showing available commands";
      speak("Available commands: Open dashboard, Create new project, Open marketplace, Start Astrid, Show analytics, Save project");
    }

    const newCommand: VoiceCommand = {
      command: command,
      action: action,
      timestamp: new Date()
    };

    setCommands(prev => [newCommand, ...prev].slice(0, 10));
    
    if (voiceEnabled && action !== "Unknown command") {
      speak(action);
    }
  };

  const speak = (text: string) => {
    if (synthRef.current && voiceEnabled) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.onend = () => setIsPlaying(false);
      synthRef.current.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript("");
    }
  };

  const stopPlaying = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Voice Commands & Natural Language Interface
            {isListening && <Badge variant="default" className="bg-red-500 animate-pulse">Listening</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Controls */}
          <div className="flex items-center gap-4">
            <Button
              onClick={toggleListening}
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className="gap-2"
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              {isListening ? "Stop Listening" : "Start Listening"}
            </Button>
            
            {isPlaying && (
              <Button onClick={stopPlaying} variant="outline" className="gap-2">
                <VolumeX className="h-4 w-4" />
                Stop Speaking
              </Button>
            )}

            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <Switch
                checked={voiceEnabled}
                onCheckedChange={setVoiceEnabled}
              />
              <span className="text-sm">Voice Responses</span>
            </div>
          </div>

          {/* Current Transcript */}
          {transcript && (
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div><strong>Transcript:</strong> {transcript}</div>
                  {confidence > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Confidence: {confidence.toFixed(1)}%
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Available Commands */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Available Voice Commands
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="font-medium">"Open dashboard"</div>
                <div className="text-muted-foreground">Navigate to main dashboard</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="font-medium">"Create new project"</div>
                <div className="text-muted-foreground">Start a new project</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="font-medium">"Open marketplace"</div>
                <div className="text-muted-foreground">Browse AI marketplace</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="font-medium">"Start Astrid"</div>
                <div className="text-muted-foreground">Activate AI co-pilot</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="font-medium">"Show analytics"</div>
                <div className="text-muted-foreground">Open analytics dashboard</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="font-medium">"Help"</div>
                <div className="text-muted-foreground">List available commands</div>
              </div>
            </div>
          </div>

          {/* Recent Commands */}
          {commands.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Recent Commands</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {commands.map((cmd, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                    <div>
                      <div className="text-sm font-medium">"{cmd.command}"</div>
                      <div className="text-xs text-muted-foreground">{cmd.action}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {cmd.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Voice Settings
            </h4>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <label className="font-medium">Language:</label>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="ml-2 p-1 border rounded"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};