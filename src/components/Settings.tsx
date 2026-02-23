import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Cpu, 
  Database,
  Moon,
  Sun,
  Volume2,
  Eye,
  EyeOff,
  Lock,
  Key,
  CheckCircle,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [aiAcceleration, setAiAcceleration] = useState(true);
  const [volume, setVolume] = useState([75]);

  // API Key state
  const [groqKey, setGroqKey] = useState(() => localStorage.getItem('arch1tech-groq-key') || '');
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(() => !!localStorage.getItem('arch1tech-groq-key'));

  const { toast } = useToast();

  const handleSaveKey = () => {
    if (groqKey.trim()) {
      localStorage.setItem('arch1tech-groq-key', groqKey.trim());
      setKeySaved(true);
      toast({ title: 'API Key Saved', description: 'Your Groq API key has been saved locally.' });
    } else {
      localStorage.removeItem('arch1tech-groq-key');
      setKeySaved(false);
      toast({ title: 'API Key Removed', description: 'Groq API key cleared.' });
    }
  };

  const handleClearKey = () => {
    setGroqKey('');
    localStorage.removeItem('arch1tech-groq-key');
    setKeySaved(false);
    toast({ title: 'API Key Cleared' });
  };

  return (
    <div className="min-h-screen p-4 space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-green rounded-full flex items-center justify-center">
          <SettingsIcon className="w-4 h-4 text-midnight-blue" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gradient-neural">Settings</h1>
          <p className="text-sm text-muted-foreground">Customize your experience</p>
        </div>
      </div>

      {/* AI Configuration — Groq API Key */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Key className="w-4 h-4 text-neon-cyan" />
              <span>AI Configuration</span>
              {keySaved ? (
                <CheckCircle className="w-4 h-4 text-neon-green ml-auto" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-500 ml-auto" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Groq API Key</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    type={showKey ? 'text' : 'password'}
                    placeholder="gsk_..."
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                    className="bg-muted/20 border-neon-cyan/20 focus:border-neon-cyan/50 pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                </div>
                <Button onClick={handleSaveKey} variant="neon" size="sm">
                  Save
                </Button>
              </div>
              {keySaved && (
                <p className="text-xs text-neon-green flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>API key configured — AI features active</span>
                </p>
              )}
              {!keySaved && (
                <p className="text-xs text-yellow-500 flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>No API key — AI features limited to offline fallbacks</span>
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <a
                href="https://console.groq.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-neon-cyan flex items-center space-x-1 hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Get free key at console.groq.com</span>
              </a>
              {keySaved && (
                <Button variant="ghost" size="sm" onClick={handleClearKey} className="text-xs text-red-400">
                  Clear key
                </Button>
              )}
            </div>
            <div className="p-3 rounded-lg bg-muted/10 text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Your key is stored locally</p>
              <p>Keys are saved in your browser only and never sent to any server other than Groq.</p>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Profile Settings */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <User className="w-4 h-4 text-neon-cyan" />
              <span>Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Alex Chen</p>
                <p className="text-xs text-muted-foreground">alex.chen@arch1tech.com</p>
              </div>
              <Badge variant="secondary" className="text-neon-green">Pro</Badge>
            </div>
            <Button variant="outline" className="w-full">Edit Profile</Button>
          </CardContent>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Palette className="w-4 h-4 text-neon-purple" />
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span className="text-sm">Dark Mode</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">UI Scale</label>
                <span className="text-sm text-muted-foreground">100%</span>
              </div>
              <Slider defaultValue={[100]} max={150} min={75} step={25} />
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Bell className="w-4 h-4 text-neon-green" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Push Notifications</span>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Updates</span>
              <Switch defaultChecked />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4" />
                  <label className="text-sm">Sound Volume</label>
                </div>
                <span className="text-sm text-muted-foreground">{volume[0]}%</span>
              </div>
              <Slider value={volume} onValueChange={setVolume} max={100} min={0} step={5} />
            </div>
          </CardContent>
        </div>
      </Card>

      {/* AI & Performance */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-neon-cyan" />
              <span>AI & Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm">WebGPU Acceleration</span>
                <p className="text-xs text-muted-foreground">Use GPU for AI processing</p>
              </div>
              <Switch checked={aiAcceleration} onCheckedChange={setAiAcceleration} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm">Auto-save Projects</span>
                <p className="text-xs text-muted-foreground">Save changes automatically</p>
              </div>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Model Caching</span>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="holographic-border">
        <div className="holographic-content">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Shield className="w-4 h-4 text-neon-purple" />
              <span>Privacy & Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm">Data Encryption</span>
                <p className="text-xs text-muted-foreground">Encrypt local storage</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm">Analytics</span>
                <p className="text-xs text-muted-foreground">Help improve the platform</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button variant="outline" className="w-full">
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </div>
      </Card>

      {/* Storage */}
      <Card className="border-neon-green/30 bg-neon-green/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-neon-green rounded-full flex items-center justify-center">
                <Database className="w-4 h-4 text-midnight-blue" />
              </div>
              <div>
                <p className="text-sm font-medium">Storage Usage</p>
                <p className="text-xs text-muted-foreground">2.3 GB of 10 GB used</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border-muted">
        <CardContent className="p-4 text-center">
          <div className="space-y-2">
            <p className="text-sm font-medium">Arch1tech Platform</p>
            <p className="text-xs text-muted-foreground">Version 2.3.1</p>
            <p className="text-xs text-muted-foreground">© 2024 Or4cl3 AI Solutions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
