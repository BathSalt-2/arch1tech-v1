import { Button } from "@/components/ui/button";
import { 
  Home, 
  Lightbulb, 
  Brain, 
  Workflow, 
  Bot, 
  Database,
  ShoppingBag,
  Settings
} from "lucide-react";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'capture', icon: Lightbulb, label: 'Capture' },
    { id: 'vibe', icon: Brain, label: 'VibeAI' },
    { id: 'logic', icon: Workflow, label: 'Logic' },
    { id: 'marketplace', icon: ShoppingBag, label: 'Market' },
    { id: 'custom-llm', icon: Database, label: 'LLM' },
    { id: 'astrid', icon: Bot, label: 'Astrid' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border p-4">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-4 gap-2">
          {navItems.slice(0, 4).map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? "neon" : "ghost"}
              size="sm"
              className="flex-col h-12 p-2"
              onClick={() => onViewChange(item.id)}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {navItems.slice(4).map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? "neon" : "ghost"}
              size="sm"
              className="flex-col h-12 p-2"
              onClick={() => onViewChange(item.id)}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}